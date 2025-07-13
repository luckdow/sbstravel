import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, DollarSign, QrCode, Phone, Mail, Star, Download, Eye, Plus, CheckCircle, Home, FileText, Car, CreditCard, MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getVehicleTypeDisplayName } from '../utils/vehicle';
import { getCustomerSession, isCustomerSessionValid } from '../utils/customerSession';
import { useStore } from '../store/useStore';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
};

export default function OriginalCustomerPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<Record<string, unknown> | null>(null);
  const [customerReservations, setCustomerReservations] = useState<Record<string, unknown>[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showNewReservationMessage, setShowNewReservationMessage] = useState(false);
  const { reservations, fetchReservations } = useStore();

  // Check customer session and load data
  useEffect(() => {
    // Check for customer session
    if (!isCustomerSessionValid()) {
      toast.error('Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.');
      navigate('/booking');
      return;
    }

    const session = getCustomerSession();
    if (session) {
      setCustomerData(session);
      
      // Fetch latest reservations
      fetchReservations().then(() => {
        // Filter reservations for this customer
        const customerReservations = reservations.filter(r => 
          r.customerId === session.customerId || 
          (r.customerEmail === session.email && r.customerName?.includes(session.firstName))
        );
        setCustomerReservations(customerReservations);
      });
    }
  }, [navigate, fetchReservations, reservations]);

  // Handle new reservation success message
  useEffect(() => {
    // Check if we should show success notification (only once per session)
    const sessionKey = 'sbs_reservation_success_shown';
    const alreadyShown = sessionStorage.getItem(sessionKey);
    
    if (location.state?.newReservation && !alreadyShown) {
      setShowNewReservationMessage(true);
      // Mark as shown for this session to prevent re-triggering
      sessionStorage.setItem(sessionKey, 'true');
      
      // Clear the location state to prevent re-triggering on navigation
      window.history.replaceState({}, '', location.pathname);
      
      // Hide message after 5 seconds
      setTimeout(() => setShowNewReservationMessage(false), 5000);
    }
  }, [location.state, location.pathname]);

  const handleViewDetails = (reservation: Record<string, unknown>) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const customerInfo = customerData ? {
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    email: customerData.email,
    phone: customerData.phone,
    totalReservations: customerReservations.length,
    totalSpent: customerReservations.reduce((sum, r) => sum + (r.amount || 0), 0)
  } : {
    firstName: 'Müşteri',
    lastName: 'Adı',
    email: 'musteri@example.com',
    phone: '+90 5XX XXX XX XX',
    totalReservations: 0,
    totalSpent: 0
  };

  const handleDownloadInvoice = async (reservation: any) => {
    try {
      // Prepare invoice data
      const invoiceData = {
        reservation: {
          id: reservation.id || 'RES-001',
          pickupLocation: reservation.pickupLocation || reservation.route?.split(' → ')[0] || 'Antalya Havalimanı',
          dropoffLocation: reservation.dropoffLocation || reservation.route?.split(' → ')[1] || 'Kemer',
          pickupDate: reservation.pickupDate || reservation.date || new Date().toLocaleDateString('tr-TR'),
          pickupTime: reservation.pickupTime || reservation.time || '14:30',
          totalPrice: reservation.totalPrice || reservation.amount || 85.00,
          vehicleType: reservation.vehicleType || 'standard',
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          qrCode: reservation.qrCode || 'QR_' + Date.now()
        },
        company: {
          name: 'SBS TRAVEL',
          address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
          phone: '+90 242 123 45 67',
          email: 'sbstravelinfo@gmail.com',
          taxNumber: '1234567890',
          bankName: 'Türkiye İş Bankası',
          iban: 'TR12 0006 4000 0011 2345 6789 01'
        }
      };
      
      await generateInvoicePDF(invoiceData);
      toast.success('Fatura başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Fatura oluşturulurken bir hata oluştu');
    }
  };

  const generateQRCode = useCallback(async (reservation: any) => {
    try {
      // Use QRCode library to generate QR code
      const QRCode = await import('qrcode');
      const qrData = JSON.stringify({
        id: reservation.id,
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        route: reservation.route || `${reservation.pickupLocation} → ${reservation.dropoffLocation}`,
        date: reservation.date || reservation.pickupDate,
        time: reservation.time || reservation.pickupTime,
        qrCode: reservation.qrCode
      });
      
      const qrCodeDataUrl = await QRCode.default.toDataURL(qrData);
      setQrCodeUrl(qrCodeDataUrl);
      setSelectedReservation(reservation);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('QR kodu oluşturulurken bir hata oluştu');
    }
  }, [customerInfo]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Message for New Reservations */}
          {showNewReservationMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-800">Rezervasyon Başarılı! 🎉</h2>
                  <p className="text-green-700">
                    Rezervasyonunuz başarıyla oluşturuldu. Transfer bilgilerinizi aşağıdan takip edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </h2>
                  <p className="text-gray-600">SBS Transfer Müşterisi</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700 text-sm">{customerInfo.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 text-sm">{customerInfo.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="text-xl font-bold text-blue-600">{customerInfo.totalReservations}</div>
                      <div className="text-xs text-blue-700">Rezervasyon</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="text-xl font-bold text-green-600">${customerInfo.totalSpent.toFixed(2)}</div>
                      <div className="text-xs text-green-700">Toplam</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/booking"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Rezervasyon</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Reservations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Rezervasyonlarım</h3>
                
                {customerReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">Henüz rezervasyonunuz yok</h4>
                    <p className="text-gray-500 mb-6">İlk transfer rezervasyonunuzu oluşturun</p>
                    <Link
                      to="/booking"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Rezervasyon Yap</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerReservations.map((reservation) => (
                      <div key={reservation.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{reservation.route || `${reservation.pickupLocation} → ${reservation.dropoffLocation}`}</h4>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{reservation.date || reservation.pickupDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{reservation.time || reservation.pickupTime}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[reservation.status || 'confirmed']}`}>
                            {statusLabels[reservation.status || 'confirmed']}
                          </span>
                          {reservation.driverId && (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ml-2">
                              Şoför Atandı
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">${(reservation.amount || reservation.totalPrice || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-gray-700">{getVehicleTypeDisplayName(reservation.vehicleType || 'standard')}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <QrCode className="h-4 w-4 text-purple-600" />
                            <span className="text-sm cursor-pointer hover:text-blue-600" onClick={() => reservation.qrCode && generateQRCode(reservation)}>
                              {reservation.qrCode ? 'QR Kodu Göster' : 'QR Kodu Yok'}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button 
                            onClick={() => handleViewDetails(reservation)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            <span>DETAY</span>
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(reservation)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span>FATURA</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Reservation Detail Modal */}
     {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Rezervasyon Detayları</h3>
                <p className="text-blue-100 text-sm">#{selectedReservation.id}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Durum</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedReservation.status]}`}>
                  {statusLabels[selectedReservation.status]}
                </span>
                {selectedReservation.driverId && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ml-2">
                    Şoför Atandı
                  </span>
                )}
              </div>

              {/* Trip Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Seyahat Bilgileri</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Kalkış</p>
                      <p className="font-medium">
                        {selectedReservation.pickupLocation || selectedReservation.route?.split(' → ')[0] || 'Antalya Havalimanı'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Varış</p>
                      <p className="font-medium">
                        {selectedReservation.dropoffLocation || selectedReservation.route?.split(' → ')[1] || 'Kemer'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tarih</p>
                        <p className="font-medium">{selectedReservation.date || selectedReservation.pickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Saat</p>
                        <p className="font-medium">{selectedReservation.time || selectedReservation.pickupTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Ad Soyad</p>
                      <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-medium">{customerInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">E-posta</p>
                      <p className="font-medium">{customerInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Araç Bilgileri</h4>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Araç Tipi</p>
                    <p className="font-medium">{getVehicleTypeDisplayName(selectedReservation.vehicleType || selectedReservation.vehicle || 'standard')}</p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              {selectedReservation.driverId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Şoför Bilgileri</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Şoför</p>
                        <p className="font-medium">{selectedReservation.driverName || 'Atanmış Şoför'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Car className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Araç Plakası</p>
                        <p className="font-medium">{selectedReservation.vehiclePlate || selectedReservation.licensePlate || 'Belirtilmemiş'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Ücret Bilgileri</h4>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Toplam Ücret</p>
                    <p className="font-medium text-lg">${selectedReservation.amount || selectedReservation.totalPrice || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transfer QR Kodu</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center">
              {qrCodeUrl && (
                <div className="mb-4 bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                </div>
              )}
              <p className="text-sm text-gray-600 mb-4">
                Bu QR kodu şoförünüze göstererek rezervasyonunuzu doğrulayabilirsiniz.
              </p>
              <button
                onClick={() => setShowQRModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}