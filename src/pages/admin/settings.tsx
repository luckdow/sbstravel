import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import { 
  Settings, 
  Save, 
  Globe, 
  DollarSign, 
  Mail, 
  Phone,
  CreditCard,
  Building,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SystemSettings {
  pricing: {
    standard: number;
    premium: number;
    luxury: number;
    commissionRate: number;
  };
  company: {
    name: string;
    phone: string;
    email: string;
    address: string;
    website: string;
    taxNumber: string;
  };
  payment: {
    paytr: {
      enabled: boolean;
      merchantId: string;
      merchantKey: string;
      merchantSalt: string;
    };
    cashOnDelivery: boolean;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    pricing: {
      standard: 4.5,
      premium: 6.5,
      luxury: 8.5,
      commissionRate: 0.25
    },
    company: {
      name: 'SBS TRAVEL',
      phone: '+90 242 123 45 67',
      email: 'sbstravelinfo@gmail.com',
      address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
      website: 'https://www.sbstravel.com',
      taxNumber: '1234567890'
    },
    payment: {
      paytr: {
        enabled: false,
        merchantId: '',
        merchantKey: '',
        merchantSalt: ''
      },
      cashOnDelivery: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Ayarlar başarıyla kaydedildi');
      
      // Apply settings immediately
      // In a real implementation, this would update the settings in the database
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, field: string, value: any) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };

  const updateNestedSetting = (category: keyof SystemSettings, parent: string, field: string, value: any) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [parent]: {
          ...settings[category][parent],
          [field]: value
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
            <p className="text-gray-600">Temel sistem parametrelerini ve entegrasyonları yönetin</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Ayarları Kaydet</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'company', label: 'Şirket Bilgileri', icon: Building },
                { id: 'pricing', label: 'Fiyatlandırma', icon: DollarSign },
                { id: 'payment', label: 'Ödeme', icon: CreditCard }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Company Settings */}
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Şirket Bilgileri</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket Adı</label>
                    <input
                      type="text"
                      value={settings.company.name}
                      onChange={(e) => updateSetting('company', 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={settings.company.phone}
                        onChange={(e) => updateSetting('company', 'phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={settings.company.email}
                        onChange={(e) => updateSetting('company', 'email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="url"
                        value={settings.company.website}
                        onChange={(e) => updateSetting('company', 'website', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Vergi Numarası</label>
                    <input
                      type="text"
                      value={settings.company.taxNumber}
                      onChange={(e) => updateSetting('company', 'taxNumber', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                  <textarea
                    rows={3}
                    value={settings.company.address}
                    onChange={(e) => updateSetting('company', 'address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Pricing Settings */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Fiyatlandırma Ayarları</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Standart ($/km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.pricing.standard}
                      onChange={(e) => updateSetting('pricing', 'standard', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Premium ($/km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.pricing.premium}
                      onChange={(e) => updateSetting('pricing', 'premium', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lüks ($/km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.pricing.luxury}
                      onChange={(e) => updateSetting('pricing', 'luxury', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Şirket Komisyonu (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={settings.pricing.commissionRate * 100}
                      onChange={(e) => updateSetting('pricing', 'commissionRate', parseFloat(e.target.value) / 100)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Şoför payı: {100 - (settings.pricing.commissionRate * 100)}%
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 mt-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Fiyatlandırma Bilgileri</h3>
                  <p className="text-blue-700 text-sm">
                    Yukarıdaki değerler, sistemin kilometre başına ücretlendirme hesaplamalarında kullanılacaktır. 
                    Şirket komisyonu, her tamamlanan transfer sonrası şirket ve şoför arasındaki gelir dağılımını belirler.
                  </p>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Ödeme Ayarları</h2>
                
                {/* PayTR Settings */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      PayTR Entegrasyonu
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.payment.paytr.enabled}
                        onChange={(e) => updateNestedSetting('payment', 'paytr', 'enabled', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        settings.payment.paytr.enabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                          settings.payment.paytr.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </label>
                  </div>
                  
                  {settings.payment.paytr.enabled && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Merchant ID</label>
                          <input
                            type="text"
                            value={settings.payment.paytr.merchantId}
                            onChange={(e) => updateNestedSetting('payment', 'paytr', 'merchantId', e.target.value)}
                            placeholder="12345"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Key</label>
                          <input
                            type="password"
                            value={settings.payment.paytr.merchantKey}
                            onChange={(e) => updateNestedSetting('payment', 'paytr', 'merchantKey', e.target.value)}
                            placeholder="xxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Salt</label>
                          <input
                            type="password"
                            value={settings.payment.paytr.merchantSalt}
                            onChange={(e) => updateNestedSetting('payment', 'paytr', 'merchantSalt', e.target.value)}
                            placeholder="xxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Bağlantıyı Test Et
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Cash on Delivery */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Nakit Ödeme
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.payment.cashOnDelivery}
                        onChange={(e) => updateSetting('payment', 'cashOnDelivery', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        settings.payment.cashOnDelivery ? 'bg-purple-600' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                          settings.payment.cashOnDelivery ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Bu seçenek aktif olduğunda, müşteriler nakit ödeme seçeneğini kullanabilirler.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}