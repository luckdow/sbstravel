import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Calendar, MapPin, Clock, DollarSign, QrCode, Phone, Mail, Star, 
  Download, Eye, Plus, CheckCircle, Home, ArrowRight, X
} from 'lucide-react';
import QRCodeDisplay from 'react-qr-code';
import { getVehicleTypeDisplayName } from '../../utils/vehicle';
import { generateCustomerViewURL } from '../../utils/qrCode';
import { getCustomerSession, isCustomerSessionValid } from '../../utils/customerSession';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  started: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  assigned: 'Şoför Atandı',
  started: 'Transfer Başladı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
};

export default function CustomerPanel() {
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [customerReservations, setCustomerReservations] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations, fetchReservations, fetchSettings, drivers, fetchDrivers } = useStore();

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
      
      // Fetch latest reservations, settings, and drivers
      Promise.all([
        fetchReservations(),
        fetchSettings(),
        fetchDrivers()
      ]).then(() => {
        // Filter reservations for this customer
        const customerReservations = reservations.filter(r => 
          r.customerId === session.customerId || 
          (r.customerEmail === session.email && r.customerName?.includes(session.firstName))
        );
        setCustomerReservations(customerReservations);
      });
    }
  }, [navigate, fetchReservations, fetchSettings, fetchDrivers, reservations]);

  // Separate effect for one-time success notification
  useEffect(() => {
    // Check if we should show success notification (only once per session)
    const sessionKey = 'sbs_reservation_success_shown';
    const alreadyShown = sessionStorage.getItem(sessionKey);
    
    if (location.state?.newReservation && !alreadyShown) {
      toast.success('🎉 Rezervasyonunuz başarıyla tamamlandı!');
      // Mark as shown for this session to prevent re-triggering
      sessionStorage.setItem(sessionKey, 'true');
      
      // Clear the location state to prevent re-triggering on navigation
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.state, location.pathname]);

  // Helper function to get driver name
  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'Şoför';
  };

  // Helper function to get status display
  const getStatusDisplay = (reservation: any) => {
    if (reservation.status === 'assigned' && reservation.driverId) {
      return `${statusLabels.assigned} - ${getDriverName(reservation.driverId)}`;
    }
    return statusLabels[reservation.status as keyof typeof statusLabels] || statusLabels.pending;
  };

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const handleShowQRCode = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowQRModal(true);
  };

  const handleDownloadInvoice = async (reservation: any) => {
    try {
      // Get system settings for company info
      const { settings } = useStore.getState();
      
      if (!settings) {
        toast.error('Sistem ayarları yüklenemedi. Lütfen tekrar deneyin.');
        return;
      }
      
      const invoiceData = {
        reservation: {
          id: reservation.id,
          pickupLocation: reservation.pickupLocation,
          dropoffLocation: reservation.dropoffLocation,
          pickupDate: reservation.pickupDate,
          pickupTime: reservation.pickupTime,
          totalPrice: reservation.totalPrice || 0,
          vehicleType: reservation.vehicleType || reservation.vehicle || 'standard',
          customerName: customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Müşteri',
          customerEmail: customerData?.email || '',
          customerPhone: customerData?.phone || '',
          qrCode: generateCustomerViewURL(reservation.id, reservation.qrCode || `QR_${reservation.id}`)
        },
        company: {
          name: settings.company.name,
          address: settings.company.address,
          phone: settings.company.phone,
          email: settings.company.email,
          taxNumber: settings.company.taxNumber,
          bankName: settings.company.bankName,
          iban: settings.company.iban
        }
      };
      
      await generateInvoicePDF(invoiceData);
      toast.success('Fatura başarıyla indirildi!');
    } catch (error) {
      console.error('Fatura oluşturulurken hata:', error);
      toast.error('Fatura oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Müşteri Paneli</h1>
                <p className="text-gray-600">
                  Hoş geldiniz, {customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Değerli Müşterimiz'}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/booking"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Rezervasyon</span>
              </Link>
              <Link
                to="/"
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <Home className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              {/* Reservations Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Geçmiş Rezervasyonlarım</h2>
                </div>

                {customerReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz rezervasyonunuz yok</h3>
                    <p className="text-gray-500 mb-4">İlk rezervasyonunuzu oluşturmak için aşağıdaki butona tıklayın.</p>
                    <Link
                      to="/booking"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      <span>İlk Rezervasyonu Oluştur</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerReservations.map((reservation) => (
                      <div key={reservation.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-bold text-gray-800">{reservation.id}</div>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[reservation.status as keyof typeof statusColors] || statusColors.pending}`}>
                            {getStatusDisplay(reservation)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{reservation.pickupLocation} → {reservation.dropoffLocation}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{reservation.pickupDate} - {reservation.pickupTime}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">${reservation.totalPrice}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Star className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-700">{getVehicleTypeDisplayName(reservation.vehicleType || reservation.vehicle || 'standard')}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleViewDetails(reservation)}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Detaylar</span>
                          </button>
                          <button 
                            onClick={() => handleShowQRCode(reservation)}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <QrCode className="h-4 w-4" />
                            <span>QR GÖR</span>
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(reservation)}
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Fatura</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Rezervasyon Detayları</h2>
                  <p className="text-blue-100 mt-1">#{selectedReservation.id}</p>
                </div>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <span className={`inline-flex px-6 py-3 rounded-full text-lg font-semibold ${statusColors[selectedReservation.status as keyof typeof statusColors] || statusColors.pending}`}>
                  {getStatusDisplay(selectedReservation)}
                </span>
              </div>

              {/* Route Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="flex items-center font-bold text-gray-800 mb-4">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Güzergah Bilgileri
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Kalkış Noktası</span>
                    <span className="font-semibold text-gray-800">{selectedReservation.pickupLocation}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Varış Noktası</span>
                    <span className="font-semibold text-gray-800">{selectedReservation.dropoffLocation}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Transfer Tarihi</span>
                    <span className="font-semibold text-gray-800">{selectedReservation.pickupDate} - {selectedReservation.pickupTime}</span>
                  </div>
                </div>
              </div>

              {/* Driver Information (if assigned) */}
              {selectedReservation.status === 'assigned' && selectedReservation.driverId && (
                <div className="bg-indigo-50 rounded-2xl p-6">
                  <h3 className="flex items-center font-bold text-indigo-800 mb-4">
                    <User className="h-5 w-5 mr-2" />
                    Şoför Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <p className="text-indigo-700">
                      <strong>Şoför:</strong> {getDriverName(selectedReservation.driverId)}
                    </p>
                    <p className="text-sm text-indigo-600">
                      Şoförünüz atanmıştır. Transfer günü sizinle iletişime geçecektir.
                    </p>
                  </div>
                </div>
              )}

              {/* Vehicle & Price Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="flex items-center font-bold text-blue-800 mb-4">
                    <Star className="h-5 w-5 mr-2" />
                    Araç Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <p className="text-blue-700">
                      <strong>Araç Tipi:</strong> {getVehicleTypeDisplayName(selectedReservation.vehicleType || selectedReservation.vehicle || 'standard')}
                    </p>
                    <p className="text-blue-700">
                      <strong>Yolcu Sayısı:</strong> {selectedReservation.passengerCount} kişi
                    </p>
                    <p className="text-blue-700">
                      <strong>Bagaj Sayısı:</strong> {selectedReservation.baggageCount} adet
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="flex items-center font-bold text-green-800 mb-4">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Ödeme Bilgileri
                  </h3>
                  <div className="space-y-2">
                    <p className="text-green-700">
                      <strong>Toplam Tutar:</strong> ${selectedReservation.totalPrice || 0}
                    </p>
                    <p className="text-green-700">
                      <strong>Ödeme Durumu:</strong> {selectedReservation.paymentStatus === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                    </p>
                    <p className="text-sm text-green-600">KDV Dahil</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="flex items-center font-bold text-purple-800 mb-4">
                  <User className="h-5 w-5 mr-2" />
                  Müşteri Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-purple-600 text-sm">Ad Soyad</span>
                    <p className="font-semibold text-purple-800">
                      {customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Belirtilmemiş'}
                    </p>
                  </div>
                  <div>
                    <span className="text-purple-600 text-sm">E-posta</span>
                    <p className="font-semibold text-purple-800">{customerData?.email || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <span className="text-purple-600 text-sm">Telefon</span>
                    <p className="font-semibold text-purple-800">{customerData?.phone || 'Belirtilmemiş'}</p>
                  </div>
                  <div>
                    <span className="text-purple-600 text-sm">Rezervasyon Tarihi</span>
                    <p className="font-semibold text-purple-800">
                      {selectedReservation.createdAt ? new Date(selectedReservation.createdAt.toDate?.() || selectedReservation.createdAt).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleDownloadInvoice(selectedReservation)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <Download className="h-5 w-5" />
                  <span>Fatura İndir</span>
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleShowQRCode(selectedReservation);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                >
                  <QrCode className="h-5 w-5" />
                  <span>QR Kodu Göster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Transfer QR Kodu</h2>
                  <p className="text-green-100 text-sm mt-1">#{selectedReservation.id}</p>
                </div>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-8 text-center">
              {/* QR Code */}
              <div className="bg-white p-6 rounded-2xl border-4 border-gray-100 shadow-lg inline-block mb-6">
                <QRCodeDisplay
                  value={generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode || `QR_${selectedReservation.id}`)}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">Transfer QR Kodu</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Bu QR kodu şoförünüze göstererek transferinizi başlatabilirsiniz. 
                    QR kod transfer günü geçerli olacaktır.
                  </p>
                </div>
                
                {/* Transfer Info */}
                <div className="bg-gray-50 rounded-xl p-4 text-left">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Güzergah:</span>
                      <span className="font-semibold text-gray-800">{selectedReservation.pickupLocation} → {selectedReservation.dropoffLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tarih:</span>
                      <span className="font-semibold text-gray-800">{selectedReservation.pickupDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saat:</span>
                      <span className="font-semibold text-gray-800">{selectedReservation.pickupTime}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <button 
                    onClick={() => {
                      const url = generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode || `QR_${selectedReservation.id}`);
                      window.open(url, '_blank');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    QR Sayfasını Aç
                  </button>
                  <button 
                    onClick={() => {
                      const url = generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode || `QR_${selectedReservation.id}`);
                      if (navigator.share) {
                        navigator.share({
                          title: 'SBS Transfer QR Kodu',
                          text: `Transfer QR Kodu - ${selectedReservation.pickupLocation} → ${selectedReservation.dropoffLocation}`,
                          url: url
                        });
                      } else {
                        navigator.clipboard.writeText(url);
                        toast.success('QR kod linki panoya kopyalandı!');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    QR Kodu Paylaş
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}