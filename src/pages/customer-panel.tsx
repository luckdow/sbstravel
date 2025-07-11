import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, MapPin, Clock, DollarSign, QrCode, Phone, Mail, Star, Download, Eye, Plus } from 'lucide-react';

const mockReservations = [
  {
    id: 'RES-001',
    route: 'Antalya Havalimanı → Kemer',
    date: '2024-01-15',
    time: '14:30',
    status: 'confirmed',
    amount: 85.00,
    qrCode: 'QR_ABC123',
    vehicle: 'Premium'
  },
  {
    id: 'RES-002',
    route: 'Kemer → Antalya Havalimanı',
    date: '2024-01-20',
    time: '10:00',
    status: 'pending',
    amount: 85.00,
    qrCode: 'QR_DEF456',
    vehicle: 'Premium'
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
                          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>Detaylar</span>
                          </button>
                          <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
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
                        href="mailto:info@ayttransfer.com"
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
    </div>
  );
}