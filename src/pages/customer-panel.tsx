import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, MapPin, Clock, DollarSign, QrCode, Phone, Mail, Star, Download, Eye, Plus, X } from 'lucide-react';
import QRCodeDisplay from 'react-qr-code';
import { getVehicleTypeDisplayName } from '../utils/vehicle';
import { generateCustomerViewURL } from '../utils/qrCode';

const mockReservations = [
  {
    id: 'RES-001',
    route: 'Antalya Havalimanı → Kemer',
    date: '2024-01-15',
    time: '14:30',
    status: 'confirmed',
    amount: 85.00,
    qrCode: 'QR_ABC123',
    vehicle: 'premium'
  },
  {
    id: 'RES-002',
    route: 'Kemer → Antalya Havalimanı',
    date: '2024-01-20',
    time: '10:00',
    status: 'pending',
    amount: 85.00,
    qrCode: 'QR_DEF456',
    vehicle: 'premium'
  }
];

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

export default function CustomerPanel() {
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const handleShowQRCode = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowQRModal(true);
  };

  const handleDownloadInvoice = (reservation: any) => {
    // TODO: Implement invoice download functionality
    alert(`Fatura indirilecek: ${reservation.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Müşteri Paneli</h1>
              <p className="text-gray-600">Hoş geldiniz, Ahmet Yılmaz</p>
            </div>
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">2</div>
                  <div className="text-sm text-gray-600">Toplam Rezervasyon</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">$170</div>
                  <div className="text-sm text-gray-600">Toplam Harcama</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">4.9</div>
                  <div className="text-sm text-gray-600">Ortalama Puan</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <QrCode className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">1</div>
                  <div className="text-sm text-gray-600">Aktif Transfer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'reservations', label: 'Rezervasyonlarım', icon: Calendar },
                  { id: 'profile', label: 'Profil Bilgileri', icon: User },
                  { id: 'support', label: 'Destek', icon: Phone }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Rezervasyonlarım</h2>
                    <Link
                      to="/booking"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Yeni Rezervasyon</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockReservations.map((reservation) => (
                      <div key={reservation.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-bold text-gray-800">{reservation.id}</div>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[reservation.status as keyof typeof statusColors]}`}>
                            {statusLabels[reservation.status as keyof typeof statusLabels]}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{reservation.route}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{reservation.date} - {reservation.time}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">${reservation.amount}</span>
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
                            <span>QR Kod</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Profil Bilgileri</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ad</label>
                        <input
                          type="text"
                          value="Ahmet"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Soyad</label>
                        <input
                          type="text"
                          value="Yılmaz"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                        <input
                          type="email"
                          value="ahmet@email.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                        <input
                          type="tel"
                          value="+90 532 123 4567"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Bilgileri Güncelle
                  </button>
                </div>
              )}

              {/* Support Tab */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Destek</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Phone className="h-6 w-6 text-blue-600" />
                        <h3 className="font-bold text-blue-800">Telefon Desteği</h3>
                      </div>
                      <p className="text-blue-700 mb-4">7/24 canlı destek hattımızdan bize ulaşabilirsiniz.</p>
                      <a
                        href="tel:+902421234567"
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-block"
                      >
                        +90 242 123 45 67
                      </a>
                    </div>
                    
                    <div className="bg-green-50 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Mail className="h-6 w-6 text-green-600" />
                        <h3 className="font-bold text-green-800">E-posta Desteği</h3>
                      </div>
                      <p className="text-green-700 mb-4">Sorularınızı e-posta ile gönderebilirsiniz.</p>
                      <a
                        href="mailto:sbstravelinfo@gmail.com"
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-block"
                      >
                        E-posta Gönder
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Rezervasyon Detayları</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Rezervasyon No</span>
                  <p className="font-semibold">{selectedReservation.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Durum</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ml-2 ${statusColors[selectedReservation.status as keyof typeof statusColors]}`}>
                    {statusLabels[selectedReservation.status as keyof typeof statusLabels]}
                  </span>
                </div>
              </div>

              {/* Route Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Güzergah Bilgileri</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{selectedReservation.route}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>{selectedReservation.date} - {selectedReservation.time}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Araç Bilgileri</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Araç Tipi:</strong> {getVehicleTypeDisplayName(selectedReservation.vehicle)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleDownloadInvoice(selectedReservation)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Fatura İndir</span>
                </button>
                <button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleShowQRCode(selectedReservation);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <QrCode className="h-4 w-4" />
                  <span>QR Kod</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">QR Kod</h2>
              <button 
                onClick={() => setShowQRModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                <QRCodeDisplay
                  value={generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode)}
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-2">Rezervasyon QR Kodu</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bu QR kodu şoförünüze göstererek transferinizi başlatabilirsiniz.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const url = generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode);
                    window.open(url, '_blank');
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  QR Sayfasını Aç
                </button>
                <button 
                  onClick={() => {
                    // TODO: Implement QR code sharing functionality
                    if (navigator.share) {
                      navigator.share({
                        title: 'Transfer QR Kodu',
                        url: generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode)
                      });
                    } else {
                      // Fallback to copy to clipboard
                      navigator.clipboard.writeText(generateCustomerViewURL(selectedReservation.id, selectedReservation.qrCode));
                      alert('QR kod linki panoya kopyalandı!');
                    }
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  QR Kodu Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}