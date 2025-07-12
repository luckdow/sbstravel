import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Globe, 
  DollarSign, 
  Bell, 
  Shield, 
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Building,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getAllSettings, updateSettings } from '../../../lib/firebase/collections';
import toast from 'react-hot-toast';
import { SystemSettings } from '../../../lib/types';

export default function SystemSettingsPanel() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const allSettings = await getAllSettings();
      setSettings({
        pricing: allSettings.pricing || {
          standard: 4.5,
          premium: 6.5,
          luxury: 8.5,
          commissionRate: 0.25
        },
        company: allSettings.company || {
          name: 'SBS TRAVEL',
          phone: '+90 242 123 45 67',
          email: 'sbstravelinfo@gmail.com',
          address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
          website: 'https://www.sbstravel.com',
          taxNumber: '1234567890'
        },
        notifications: allSettings.notifications || {
          email: {
            enabled: false,
            provider: 'none'
          },
          sms: {
            enabled: false,
            provider: 'none'
          },
          whatsapp: {
            enabled: false
          }
        },
        payment: allSettings.payment || {
          paytr: {
            enabled: false,
            merchantId: '',
            merchantKey: '',
            merchantSalt: ''
          },
          cashOnDelivery: true
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      // Save each settings category
      await updateSettings('pricing', settings.pricing);
      await updateSettings('company', settings.company);
      await updateSettings('notifications', settings.notifications);
      await updateSettings('payment', settings.payment);
      
      toast.success('Ayarlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category: keyof SystemSettings, field: string, value: any) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };

  const updateNestedSetting = (category: keyof SystemSettings, parent: string, field: string, value: any) => {
    if (!settings) return;
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Ayarlar yükleniyor...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Ayarlar yüklenemedi</h3>
        <p className="mt-2 text-gray-500">Lütfen daha sonra tekrar deneyin</p>
        <button 
          onClick={loadSettings}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sistem Ayarları</h1>
          <p className="text-gray-600">Temel sistem parametrelerini ve entegrasyonları yönetin</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? (
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
              { id: 'notifications', label: 'Bildirimler', icon: Bell },
              { id: 'payment', label: 'Ödeme', icon: CreditCard }
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banka Adı</label>
                  <input
                    type="text"
                    value={settings.company.bankName || ''}
                    onChange={(e) => updateSetting('company', 'bankName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: Türkiye İş Bankası"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IBAN</label>
                  <input
                    type="text"
                    value={settings.company.iban || ''}
                    onChange={(e) => updateSetting('company', 'iban', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Örn: TR12 0006 4000 0011 2345 6789 01"
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
                      value={settings.company.email}
                      onChange={(e) => updateSetting('company', 'email', e.target.value)}
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
                      value={settings.company.website}
                      onChange={(e) => updateSetting('company', 'website', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vergi Numarası</label>
                  <input
                    type="text"
                    value={settings.company.taxNumber}
                    onChange={(e) => updateSetting('company', 'taxNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adres</label>
                <textarea
                  rows={3}
                  value={settings.company.address}
                  onChange={(e) => updateSetting('company', 'address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Premium ($/km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.pricing.premium}
                    onChange={(e) => updateSetting('pricing', 'premium', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lüks ($/km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.pricing.luxury}
                    onChange={(e) => updateSetting('pricing', 'luxury', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bildirim Ayarları</h2>
              
              {/* Email Settings */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    E-posta Bildirimleri
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email.enabled}
                      onChange={(e) => updateNestedSetting('notifications', 'email', 'enabled', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.email.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                        settings.notifications.email.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                
                {settings.notifications.email.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Sağlayıcı</label>
                      <select
                        value={settings.notifications.email.provider}
                        onChange={(e) => updateNestedSetting('notifications', 'email', 'provider', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">Seçiniz</option>
                        <option value="gmail">Gmail SMTP</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="ses">Amazon SES</option>
                      </select>
                    </div>
                    
                    {settings.notifications.email.provider === 'gmail' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Kullanıcı Adı</label>
                          <input
                            type="text"
                            placeholder="ornek@gmail.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Şifre</label>
                          <input
                            type="password"
                            placeholder="App Password"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    {settings.notifications.email.provider === 'sendgrid' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SendGrid API Key</label>
                        <input
                          type="password"
                          placeholder="SG.xxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    )}
                    
                    {settings.notifications.email.provider === 'ses' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">AWS Access Key</label>
                          <input
                            type="text"
                            placeholder="AKIAXXXXXXX"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">AWS Secret Key</label>
                          <input
                            type="password"
                            placeholder="xxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Bağlantıyı Test Et
                    </button>
                  </div>
                )}
              </div>
              
              {/* SMS Settings */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    SMS Bildirimleri
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms.enabled}
                      onChange={(e) => updateNestedSetting('notifications', 'sms', 'enabled', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.sms.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                        settings.notifications.sms.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                
                {settings.notifications.sms.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMS Sağlayıcı</label>
                      <select
                        value={settings.notifications.sms.provider}
                        onChange={(e) => updateNestedSetting('notifications', 'sms', 'provider', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">Seçiniz</option>
                        <option value="netgsm">NetGSM</option>
                        <option value="twilio">Twilio</option>
                      </select>
                    </div>
                    
                    {settings.notifications.sms.provider === 'netgsm' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NetGSM Kullanıcı Adı</label>
                          <input
                            type="text"
                            placeholder="8xxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NetGSM Şifre</label>
                          <input
                            type="password"
                            placeholder="xxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">NetGSM Başlık</label>
                          <input
                            type="text"
                            placeholder="SBSTRAVEL"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    {settings.notifications.sms.provider === 'twilio' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Twilio Account SID</label>
                          <input
                            type="text"
                            placeholder="ACxxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Twilio Auth Token</label>
                          <input
                            type="password"
                            placeholder="xxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Twilio Phone Number</label>
                          <input
                            type="text"
                            placeholder="+1xxxxxxxxxx"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Bağlantıyı Test Et
                    </button>
                  </div>
                )}
              </div>
              
              {/* WhatsApp Settings */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    WhatsApp Bildirimleri
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.whatsapp.enabled}
                      onChange={(e) => updateNestedSetting('notifications', 'whatsapp', 'enabled', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      settings.notifications.whatsapp.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                        settings.notifications.whatsapp.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </div>
                  </label>
                </div>
                
                {settings.notifications.whatsapp.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Business API Token</label>
                        <input
                          type="password"
                          placeholder="xxxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number ID</label>
                        <input
                          type="text"
                          placeholder="xxxxxxxxxxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Bağlantıyı Test Et
                    </button>
                  </div>
                )}
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
                  <h3 className="font-semibold text-gray-800 flex items-center">
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
                      settings.payment.paytr.enabled ? 'bg-blue-600' : 'bg-gray-300'
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
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Key</label>
                        <input
                          type="password"
                          value={settings.payment.paytr.merchantKey}
                          onChange={(e) => updateNestedSetting('payment', 'paytr', 'merchantKey', e.target.value)}
                          placeholder="xxxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Salt</label>
                        <input
                          type="password"
                          value={settings.payment.paytr.merchantSalt}
                          onChange={(e) => updateNestedSetting('payment', 'paytr', 'merchantSalt', e.target.value)}
                          placeholder="xxxxxxx"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Bağlantıyı Test Et
                    </button>
                  </div>
                )}
              </div>
              
              {/* Cash on Delivery */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center">
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
                      settings.payment.cashOnDelivery ? 'bg-blue-600' : 'bg-gray-300'
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
  );
}