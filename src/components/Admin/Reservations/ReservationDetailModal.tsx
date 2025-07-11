import React from 'react';
import { X, MapPin, Calendar, Clock, User, Car, CreditCard, Phone, Mail, Star, Download, Share2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { getLocationString } from '../../../lib/utils/location';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
}

export default function ReservationDetailModal({ isOpen, onClose, reservation }: ReservationDetailModalProps) {
  if (!isOpen || !reservation) return null;

  const handleDownloadQR = () => {
    // Create SVG element for QR code
    const svg = document.getElementById('qr-code-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-code-${reservation.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShareReservation = async () => {
    const shareData = {
      title: `Rezervasyon ${reservation.id}`,
      text: `${reservation.customerName} - ${getLocationString(reservation.pickupLocation)} → ${getLocationString(reservation.dropoffLocation)}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Rezervasyon bilgileri panoya kopyalandı!');
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    assigned: 'bg-purple-100 text-purple-800 border-purple-300',
    started: 'bg-green-100 text-green-800 border-green-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300'
  };

  const statusLabels = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    assigned: 'Atandı',
    started: 'Başladı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span>Rezervasyon Detayları</span>
              </h2>
              <p className="text-gray-600 mt-1">#{reservation.id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                statusColors[reservation.status as keyof typeof statusColors] || statusColors.pending
              }`}>
                {statusLabels[reservation.status as keyof typeof statusLabels] || 'Belirsiz'}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Müşteri Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ad Soyad</label>
                      <p className="text-gray-800 font-semibold">{reservation.customerName || 'Bilgi yok'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">E-posta</label>
                      <p className="text-gray-800 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {reservation.customerEmail || 'Bilgi yok'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefon</label>
                      <p className="text-gray-800 flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {reservation.customerPhone || 'Bilgi yok'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Yolcu Sayısı</label>
                      <p className="text-gray-800 font-semibold">{reservation.passengerCount || 1} kişi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Güzergah Detayları
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-green-700">Kalkış Noktası</label>
                      <p className="text-gray-800 font-semibold">{getLocationString(reservation.pickupLocation)}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {reservation.pickupDate}
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        {reservation.pickupTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gray-300"></div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                    <div className="flex-shrink-0 w-3 h-3 bg-red-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-red-700">Varış Noktası</label>
                      <p className="text-gray-800 font-semibold">{getLocationString(reservation.dropoffLocation)}</p>
                      <p className="text-sm text-gray-600 mt-1">Tahmini varış: {reservation.estimatedArrival || 'Hesaplanıyor...'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-purple-600" />
                  Araç ve Şoför Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Araç Tipi</label>
                      <p className="text-gray-800 font-semibold">{reservation.vehicleType || 'Belirlenmedi'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bagaj Sayısı</label>
                      <p className="text-gray-800">{reservation.baggageCount || 0} adet</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {reservation.driverId ? (
                      <>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Şoför</label>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {reservation.driverName ? reservation.driverName.split(' ').map((n: string) => n[0]).join('') : 'SB'}
                            </div>
                            <div>
                              <p className="text-gray-800 font-semibold">{reservation.driverName || reservation.driverId}</p>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{reservation.driverRating || '5.0'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Şoför Telefon</label>
                          <p className="text-gray-800">{reservation.driverPhone || 'Bilgi yok'}</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 italic">Henüz şoför atanmadı</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Ödeme Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Toplam Tutar</label>
                      <p className="text-2xl font-bold text-green-600">${reservation.totalPrice || '0'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ödeme Durumu</label>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                        reservation.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.paymentStatus === 'paid' ? 'Ödendi' : 'Beklemede'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ödeme Yöntemi</label>
                      <p className="text-gray-800">{reservation.paymentMethod || 'Nakit'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">İşlem Tarihi</label>
                      <p className="text-gray-800">{reservation.paymentDate || reservation.createdDate || 'Belirlenmedi'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - QR Code & Actions */}
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">QR Kod</h3>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <QRCode
                      id="qr-code-svg"
                      value={`https://sbstravel.com/reservation/${reservation.id}`}
                      size={160}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Rezervasyon doğrulama için QR kodu kullanın
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    İndir
                  </button>
                  <button
                    onClick={handleShareReservation}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Paylaş
                  </button>
                </div>
              </div>

              {/* Reservation Timeline */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Durum Geçmişi</h3>
                <div className="space-y-4">
                  {[
                    { status: 'Rezervasyon oluşturuldu', time: reservation.createdDate || '2024-01-15 10:30', active: true },
                    { status: 'Ödeme onaylandı', time: reservation.paymentDate || '2024-01-15 10:32', active: reservation.paymentStatus === 'paid' },
                    { status: 'Şoför atandı', time: reservation.assignedDate || '', active: !!reservation.driverId },
                    { status: 'Transfer başladı', time: reservation.startedDate || '', active: reservation.status === 'started' || reservation.status === 'completed' },
                    { status: 'Transfer tamamlandı', time: reservation.completedDate || '', active: reservation.status === 'completed' }
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center space-x-3 ${item.active ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.status}</p>
                        {item.time && <p className="text-xs text-gray-500">{item.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">İşlemler</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Düzenle
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    Durum Güncelle
                  </button>
                  <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Müşteriyi Ara
                  </button>
                  <button className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium">
                    İptal Et
                  </button>
                </div>
              </div>

              {/* Additional Notes */}
              {reservation.notes && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Notlar</h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                    {reservation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}