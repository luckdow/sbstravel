import React, { useState, useEffect } from 'react';
import { useFirebaseStore } from '../store/useFirebaseStore';
import { Reservation } from '../types';
import { QrCode, Star, Calendar, MapPin, Clock, User, Phone, Mail, Car, CreditCard, FileText } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const CustomerPanel: React.FC = () => {
  const { user, reservations, getReservationsByCustomer } = useFirebaseStore();
  const [customerReservations, setCustomerReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (user?.email) {
      loadCustomerReservations();
    }
  }, [user, reservations]);

  const loadCustomerReservations = async () => {
    if (user?.email) {
      try {
        const userReservations = await getReservationsByCustomer(user.email);
        setCustomerReservations(userReservations);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    }
  };

  const generateQRCode = async (reservation: Reservation) => {
    try {
      const QRCode = (await import('qrcode')).default;
      const qrData = JSON.stringify({
        id: reservation.id,
        customerEmail: reservation.customerEmail,
        pickupLocation: reservation.pickupLocation,
        dropoffLocation: reservation.dropoffLocation,
        date: reservation.date,
        time: reservation.time
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      setQrCodeUrl(qrCodeDataUrl);
      setSelectedReservation(reservation);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleShowDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleGenerateInvoice = async (reservation: Reservation) => {
    try {
      await generateInvoicePDF(reservation);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Fatura oluşturulurken bir hata oluştu.');
    }
  };

  const getVehicleTypeName = (vehicleType: string) => {
    const typeMap: { [key: string]: string } = {
      'standard': 'Standart',
      'premium': 'Premium',
      'luxury': 'Lüks',
      'vip': 'VIP'
    };
    return typeMap[vehicleType?.toLowerCase()] || vehicleType || 'Standart';
  };

  const getStatusText = (reservation: Reservation) => {
    if (reservation.driverId && reservation.driverName) {
      return `Şoför Atandı: ${reservation.driverName}`;
    }
    return reservation.status === 'confirmed' ? 'Onaylandı' : 
           reservation.status === 'completed' ? 'Tamamlandı' : 
           reservation.status === 'cancelled' ? 'İptal Edildi' : 'Beklemede';
  };

  const getStatusColor = (reservation: Reservation) => {
    if (reservation.driverId) return 'text-green-600 bg-green-50';
    switch (reservation.status) {
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmanız Gerekiyor</h2>
          <p className="text-gray-600">Rezervasyonlarınızı görüntülemek için lütfen giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Geçmiş Rezervasyonlarım</h2>
          </div>
          
          <div className="p-6">
            {customerReservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz rezervasyonunuz yok</h3>
                <p className="text-gray-500">İlk rezervasyonunuzu yapmak için rezervasyon sayfasını ziyaret edin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customerReservations.map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation)}`}>
                            {getStatusText(reservation)}
                          </span>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Star className="w-4 h-4" />
                            <span className="text-sm">{getVehicleTypeName(reservation.vehicleType)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{reservation.pickupLocation}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{reservation.dropoffLocation}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{reservation.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{reservation.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => generateQRCode(reservation)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>QR GÖR</span>
                        </button>
                        <button
                          onClick={() => handleShowDetails(reservation)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>DETAY</span>
                        </button>
                        <button
                          onClick={() => handleGenerateInvoice(reservation)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>FATURA</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rezervasyon QR Kodu</h3>
              {qrCodeUrl && (
                <div className="mb-4">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-48 h-48" />
                </div>
              )}
              <p className="text-sm text-gray-600 mb-4">
                Bu QR kodu şoförünüze göstererek rezervasyonunuzu doğrulayabilirsiniz.
              </p>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-bold">Rezervasyon Detayları</h3>
              <p className="text-blue-100">#{selectedReservation.id}</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Durum</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReservation)}`}>
                  {getStatusText(selectedReservation)}
                </span>
              </div>

              {/* Trip Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Seyahat Bilgileri</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Kalkış</p>
                      <p className="font-medium">{selectedReservation.pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Varış</p>
                      <p className="font-medium">{selectedReservation.dropoffLocation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Tarih</p>
                        <p className="font-medium">{selectedReservation.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Saat</p>
                        <p className="font-medium">{selectedReservation.time}</p>
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
                      <p className="font-medium">{selectedReservation.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-medium">{selectedReservation.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">E-posta</p>
                      <p className="font-medium">{selectedReservation.customerEmail}</p>
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
                    <p className="font-medium">{getVehicleTypeName(selectedReservation.vehicleType)}</p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              {selectedReservation.driverId && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Şoför Bilgileri</h4>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Şoför</p>
                      <p className="font-medium">{selectedReservation.driverName}</p>
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
                    <p className="font-medium text-lg">{selectedReservation.totalPrice} TL</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPanel;