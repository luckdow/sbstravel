import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, Calendar, MapPin, Clock, DollarSign, QrCode, Phone, Mail, Star, 
  Download, Eye, Plus, Settings, Bell, CreditCard, LogOut, History,
  Navigation, Globe, Moon, Sun
} from 'lucide-react';
import { authService } from '../../lib/services/auth-service';
import { useStore } from '../../store/useStore';
import { transactionService } from '../../lib/services/transaction-service';
import { notificationService } from '../../lib/services/notification-service';
import toast from 'react-hot-toast';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { reservations } = useStore();

  const authState = authService.getAuthState();
  const user = authState.user;

  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  const handleLogout = async () => {
    await authService.logout();
    toast.success('Başarıyla çıkış yapıldı');
  };

  const transactionStats = transactionService.getTransactionStats();
  const notificationStats = notificationService.getNotificationStats();

  // Customer stats
  const customerReservations = reservations.filter(r => r.customerEmail === user?.email);
  const totalSpent = customerReservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const completedTrips = customerReservations.filter(r => r.status === 'completed').length;
  const upcomingTrips = customerReservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Müşteri Paneli
                </h1>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hoş geldiniz, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <Link
                to="/booking"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Rezervasyon</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'} hover:bg-opacity-80 transition-colors`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {customerReservations.length}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toplam Rezervasyon
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    ${totalSpent.toFixed(0)}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Toplam Harcama
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {completedTrips}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tamamlanan Seyahat
                  </div>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border p-6`}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {upcomingTrips}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Yaklaşan Seyahat
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-sm border mb-8`}>
            <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'dashboard', label: 'Genel Bakış', icon: Calendar },
                  { id: 'reservations', label: 'Rezervasyonlarım', icon: Navigation },
                  { id: 'history', label: 'Geçmiş', icon: History },
                  { id: 'profile', label: 'Profil', icon: User },
                  { id: 'notifications', label: 'Bildirimler', icon: Bell },
                  { id: 'settings', label: 'Ayarlar', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : `border-transparent ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Genel Bakış
                  </h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        Hızlı İşlemler
                      </h3>
                      <div className="space-y-3">
                        <Link
                          to="/booking"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-3"
                        >
                          <Plus className="h-5 w-5" />
                          <span>Yeni Rezervasyon Yap</span>
                        </Link>
                        
                        <button className={`w-full ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-white border text-gray-700'} p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-3`}>
                          <QrCode className="h-5 w-5" />
                          <span>QR Kodlarım</span>
                        </button>
                        
                        <button className={`w-full ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-white border text-gray-700'} p-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-3`}>
                          <CreditCard className="h-5 w-5" />
                          <span>Ödeme Geçmişi</span>
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        Son Aktiviteler
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              Rezervasyon onaylandı
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              2 saat önce
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              E-posta bildirim gönderildi
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              3 saat önce
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reservations Tab */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      Rezervasyonlarım
                    </h2>
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
                      <div key={reservation.id} className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            {reservation.id}
                          </div>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[reservation.status as keyof typeof statusColors]}`}>
                            {statusLabels[reservation.status as keyof typeof statusLabels]}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center space-x-3">
                            <MapPin className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {reservation.route}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {reservation.date} - {reservation.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <DollarSign className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              ${reservation.amount}
                            </span>
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
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Profil Bilgileri
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Ad
                        </label>
                        <input
                          type="text"
                          value={user?.firstName || ''}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Soyad
                        </label>
                        <input
                          type="text"
                          value={user?.lastName || ''}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          E-posta
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={user?.phone || ''}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-gray-200 text-gray-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    Bilgileri Güncelle
                  </button>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Ayarlar
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        Görünüm
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Karanlık Tema
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Gözlerinizi korumak için karanlık temayı kullanın
                          </p>
                        </div>
                        <button
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isDarkMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl p-6`}>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                        Bildirimler
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            E-posta Bildirimleri
                          </span>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            SMS Bildirimleri
                          </span>
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Pazarlama E-postaları
                          </span>
                          <input type="checkbox" className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Tab */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Destek
                  </h2>
                  
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