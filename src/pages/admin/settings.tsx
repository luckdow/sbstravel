import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { Settings, Save, Bell, Shield, DollarSign, MapPin, Mail, Phone, Globe, Users, Database, Monitor } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Genel Ayarlar', icon: Settings },
    { id: 'pricing', label: 'Fiyatlandırma', icon: DollarSign },
    { id: 'users', label: 'Kullanıcı Yönetimi', icon: Users },
    { id: 'system', label: 'Sistem Parametreleri', icon: Database },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'locations', label: 'Lokasyonlar', icon: MapPin },
    { id: 'monitoring', label: 'İzleme', icon: Monitor }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
          <p className="text-gray-600">Sistem genelindeki ayarları yönetin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Genel Ayarlar</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket Adı</label>
                      <input
                        type="text"
                        defaultValue="AYT Transfer"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          defaultValue="+90 242 123 45 67"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          defaultValue="info@ayttransfer.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          defaultValue="https://ayttransfer.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                    <textarea
                      rows={3}
                      defaultValue="Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Pricing Settings */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Fiyatlandırma Ayarları</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Standart ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="4.5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Premium ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="6.5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Lüks ($/km)</label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue="8.5"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket Komisyonu (%)</label>
                      <input
                        type="number"
                        defaultValue="25"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">KDV Oranı (%)</label>
                      <input
                        type="number"
                        defaultValue="18"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Kullanıcı Yönetimi</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Admin Kullanıcıları</h3>
                      
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        {[
                          { name: 'Admin User', email: 'admin@sbstravel.com', role: 'Super Admin', active: true },
                          { name: 'Mehmet Yılmaz', email: 'mehmet@sbstravel.com', role: 'Admin', active: true },
                          { name: 'Ayşe Kaya', email: 'ayse@sbstravel.com', role: 'Operator', active: false }
                        ].map((user, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{user.role}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked={user.active} className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                        Yeni Admin Ekle
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Şoför Yönetimi</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl">
                          <p className="text-2xl font-bold text-green-600">24</p>
                          <p className="text-sm text-gray-600">Aktif Şoför</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl">
                          <p className="text-2xl font-bold text-yellow-600">3</p>
                          <p className="text-sm text-gray-600">Bekleyen Onay</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Şoför Onay Süreci</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                          <option>Otomatik Onay</option>
                          <option>Manuel Onay</option>
                          <option>Belgeli Onay</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Minimum Değerlendirme</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          defaultValue="4.0"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* System Parameters */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Sistem Parametreleri</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Rezervasyon Ayarları</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Maksimum Rezervasyon Süresi (gün)</label>
                        <input
                          type="number"
                          defaultValue="90"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rezervasyon Süresi (saat)</label>
                        <input
                          type="number"
                          defaultValue="2"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">İptal Süresi (saat)</label>
                        <input
                          type="number"
                          defaultValue="24"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-gray-800">Otomatik Onay</h4>
                          <p className="text-sm text-gray-600">Rezervasyonları otomatik onayla</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Ödeme Ayarları</h3>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ödeme Zaman Aşımı (dakika)</label>
                        <input
                          type="number"
                          defaultValue="15"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Para Birimi</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                          <option>TRY (₺)</option>
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-gray-800">Nakit Ödeme</h4>
                          <p className="text-sm text-gray-600">Nakit ödeme seçeneği</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-semibold text-gray-800">Kredi Kartı</h4>
                          <p className="text-sm text-gray-600">Online kredi kartı ödemesi</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Monitoring */}
              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Sistem İzleme</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Sistem Durumu</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">API Durumu</span>
                          <span className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Çevrimiçi
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Veritabanı</span>
                          <span className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Bağlı
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Ödeme Gateway</span>
                          <span className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Aktif
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Performans</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Yanıt Süresi</span>
                          <span className="text-green-600">245ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Uptime</span>
                          <span className="text-green-600">99.9%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Memory Usage</span>
                          <span className="text-yellow-600">65%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Etkinlik</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Bugünkü Rezervasyonlar</span>
                          <span className="text-blue-600">142</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Aktif Kullanıcılar</span>
                          <span className="text-blue-600">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Hata Sayısı</span>
                          <span className="text-red-600">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Son Etkinlikler</h3>
                    <div className="space-y-3">
                      {[
                        { time: '2 dk önce', event: 'Yeni rezervasyon oluşturuldu: #R2024001', type: 'success' },
                        { time: '5 dk önce', event: 'Ödeme tamamlandı: 750 TL', type: 'success' },
                        { time: '12 dk önce', event: 'Şoför konumu güncellendi', type: 'info' },
                        { time: '18 dk önce', event: 'API yanıt süresinde yavaşlama', type: 'warning' },
                        { time: '25 dk önce', event: 'Backup işlemi başarıyla tamamlandı', type: 'success' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500' :
                            activity.type === 'warning' ? 'bg-yellow-500' :
                            activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.event}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Bildirim Ayarları</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-800">Yeni Rezervasyon</h3>
                        <p className="text-sm text-gray-600">Yeni rezervasyon geldiğinde bildirim gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-800">Ödeme Bildirimleri</h3>
                        <p className="text-sm text-gray-600">Ödeme işlemleri için bildirim gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-800">SMS Bildirimleri</h3>
                        <p className="text-sm text-gray-600">Müşterilere SMS bildirimi gönder</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Güvenlik Ayarları</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Şifre Uzunluğu</label>
                      <input
                        type="number"
                        defaultValue="8"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-800">İki Faktörlü Doğrulama</h3>
                        <p className="text-sm text-gray-600">Admin girişleri için 2FA zorunlu</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Locations Settings */}
              {activeTab === 'locations' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Lokasyon Ayarları</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Varsayılan Şehir</label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                        <option>Antalya</option>
                        <option>İstanbul</option>
                        <option>Ankara</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Google Maps API Key</label>
                      <input
                        type="password"
                        defaultValue="AIzaSyDa66vbuMgm_L4wdOgPutliu_PLzI3xqEw"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                  <Save className="h-5 w-5" />
                  <span>Ayarları Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}