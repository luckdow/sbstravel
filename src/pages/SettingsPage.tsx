import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Download, Upload, Trash2, RefreshCw, Moon, Sun, 
  Globe, DollarSign, Bell, Eye, Type, Monitor, Smartphone, Shield,
  Database, HardDrive, CheckCircle, AlertTriangle, Info
} from 'lucide-react';
import { authService } from '../../lib/services/auth-service';
import { persistenceService, STORAGE_CONFIGS, UserPreferences, DEFAULT_USER_PREFERENCES } from '../../lib/services/persistence-service';
import { transactionService } from '../../lib/services/transaction-service';
import { notificationService } from '../../lib/services/notification-service';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [storageStats, setStorageStats] = useState(persistenceService.getStorageStats());
  const [activeTab, setActiveTab] = useState('appearance');
  const [isLoading, setIsLoading] = useState(false);

  const authState = authService.getAuthState();
  const user = authState.user;

  useEffect(() => {
    // Load user preferences
    const savedPreferences = persistenceService.load<UserPreferences>(STORAGE_CONFIGS.USER_PREFERENCES);
    if (savedPreferences) {
      setPreferences(savedPreferences);
    }

    // Update storage stats
    setStorageStats(persistenceService.getStorageStats());
  }, []);

  const savePreferences = () => {
    setIsLoading(true);
    const success = persistenceService.save(STORAGE_CONFIGS.USER_PREFERENCES, preferences);
    
    if (success) {
      toast.success('Ayarlar başarıyla kaydedildi');
      
      // Apply theme immediately
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      toast.error('Ayarlar kaydedilirken hata oluştu');
    }
    setIsLoading(false);
  };

  const handleExportData = () => {
    try {
      const backup = persistenceService.createBackup();
      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ayt-transfer-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Veriler başarıyla dışa aktarıldı');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Dışa aktarma sırasında hata oluştu');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupString = e.target?.result as string;
        const success = persistenceService.restoreBackup(backupString);
        
        if (success) {
          toast.success('Veriler başarıyla içe aktarıldı');
          // Reload page to reflect changes
          window.location.reload();
        } else {
          toast.error('İçe aktarma sırasında hata oluştu');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Geçersiz yedekleme dosyası');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm('Tüm uygulama verileri silinecek. Emin misiniz?')) {
      const success = persistenceService.clearAll();
      if (success) {
        toast.success('Tüm veriler temizlendi');
        // Reload page
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error('Veri temizleme sırasında hata oluştu');
      }
    }
  };

  const refreshStorageStats = () => {
    setStorageStats(persistenceService.getStorageStats());
    toast.success('Depolama istatistikleri güncellendi');
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'appearance', label: 'Görünüm', icon: Monitor },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'accessibility', label: 'Erişilebilirlik', icon: Eye },
    { id: 'privacy', label: 'Gizlilik', icon: Shield },
    { id: 'data', label: 'Veri Yönetimi', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
              <p className="text-gray-600">Uygulama tercihlerinizi yönetin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
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
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Görünüm Ayarları</h2>
                  
                  {/* Theme */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Moon className="h-5 w-5 mr-2" />
                      Tema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Açık Tema', icon: Sun },
                        { value: 'dark', label: 'Koyu Tema', icon: Moon },
                        { value: 'auto', label: 'Sistem', icon: Monitor }
                      ].map((theme) => (
                        <label
                          key={theme.value}
                          className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            preferences.theme === theme.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={theme.value}
                            checked={preferences.theme === theme.value}
                            onChange={(e) => setPreferences({
                              ...preferences,
                              theme: e.target.value as 'light' | 'dark' | 'auto'
                            })}
                            className="sr-only"
                          />
                          <theme.icon className="h-6 w-6 text-blue-600 mr-3" />
                          <span className="font-medium">{theme.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language & Currency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Dil
                      </h3>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          language: e.target.value as 'tr' | 'en'
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="tr">Türkçe</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Para Birimi
                      </h3>
                      <select
                        value={preferences.currency}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          currency: e.target.value as 'USD' | 'EUR' | 'TRY'
                        })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="TRY">TRY (₺)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Bildirim Ayarları</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Bildirim Tercihleri
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'email', label: 'E-posta Bildirimleri', description: 'Rezervasyon onayları ve güncellemeler' },
                        { key: 'sms', label: 'SMS Bildirimleri', description: 'Önemli güncellemeler ve hatırlatmalar' },
                        { key: 'push', label: 'Push Bildirimleri', description: 'Anlık bildirimler' },
                        { key: 'marketing', label: 'Pazarlama E-postaları', description: 'Kampanyalar ve özel teklifler' }
                      ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{notification.label}</div>
                            <div className="text-sm text-gray-600">{notification.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.notifications[notification.key as keyof typeof preferences.notifications]}
                              onChange={(e) => setPreferences({
                                ...preferences,
                                notifications: {
                                  ...preferences.notifications,
                                  [notification.key]: e.target.checked
                                }
                              })}
                              className="sr-only"
                            />
                            <div className={`w-11 h-6 rounded-full transition-colors ${
                              preferences.notifications[notification.key as keyof typeof preferences.notifications]
                                ? 'bg-blue-600' : 'bg-gray-300'
                            }`}>
                              <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                                preferences.notifications[notification.key as keyof typeof preferences.notifications]
                                  ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Accessibility Tab */}
              {activeTab === 'accessibility' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Erişilebilirlik</h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Görsel Tercihler
                    </h3>
                    <div className="space-y-6">
                      {/* Font Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <Type className="h-4 w-4 inline mr-2" />
                          Yazı Boyutu
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 'small', label: 'Küçük' },
                            { value: 'medium', label: 'Orta' },
                            { value: 'large', label: 'Büyük' }
                          ].map((size) => (
                            <label key={size.value} className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer ${
                              preferences.accessibility.fontSize === size.value
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                              <input
                                type="radio"
                                name="fontSize"
                                value={size.value}
                                checked={preferences.accessibility.fontSize === size.value}
                                onChange={(e) => setPreferences({
                                  ...preferences,
                                  accessibility: {
                                    ...preferences.accessibility,
                                    fontSize: e.target.value as 'small' | 'medium' | 'large'
                                  }
                                })}
                                className="sr-only"
                              />
                              <span className={`font-medium ${
                                size.value === 'small' ? 'text-sm' :
                                size.value === 'large' ? 'text-lg' : 'text-base'
                              }`}>
                                {size.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Other accessibility options */}
                      <div className="space-y-4">
                        {[
                          { 
                            key: 'reducedMotion', 
                            label: 'Azaltılmış Hareket', 
                            description: 'Animasyonları ve geçişleri azalt' 
                          },
                          { 
                            key: 'highContrast', 
                            label: 'Yüksek Kontrast', 
                            description: 'Daha iyi görünürlük için kontrast artır' 
                          }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-800">{option.label}</div>
                              <div className="text-sm text-gray-600">{option.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preferences.accessibility[option.key as keyof typeof preferences.accessibility] as boolean}
                                onChange={(e) => setPreferences({
                                  ...preferences,
                                  accessibility: {
                                    ...preferences.accessibility,
                                    [option.key]: e.target.checked
                                  }
                                })}
                                className="sr-only"
                              />
                              <div className={`w-11 h-6 rounded-full transition-colors ${
                                preferences.accessibility[option.key as keyof typeof preferences.accessibility]
                                  ? 'bg-blue-600' : 'bg-gray-300'
                              }`}>
                                <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                                  preferences.accessibility[option.key as keyof typeof preferences.accessibility]
                                    ? 'translate-x-5' : 'translate-x-0'
                                }`} />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Management Tab */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800">Veri Yönetimi</h2>
                  
                  {/* Storage Statistics */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <HardDrive className="h-5 w-5 mr-2" />
                        Depolama İstatistikleri
                      </h3>
                      <button
                        onClick={refreshStorageStats}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Yenile</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{formatBytes(storageStats.usedBytes)}</div>
                        <div className="text-sm text-gray-600">Kullanılan Alan</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{storageStats.appKeys}</div>
                        <div className="text-sm text-gray-600">Uygulama Verileri</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{storageStats.totalKeys}</div>
                        <div className="text-sm text-gray-600">Toplam Anahtar</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{formatBytes(storageStats.freeSpace)}</div>
                        <div className="text-sm text-gray-600">Boş Alan</div>
                      </div>
                    </div>
                  </div>

                  {/* Data Operations */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Veri İşlemleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center space-x-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-5 w-5" />
                        <span>Verileri Dışa Aktar</span>
                      </button>
                      
                      <label className="flex items-center justify-center space-x-3 p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer">
                        <Upload className="h-5 w-5" />
                        <span>Verileri İçe Aktar</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                      
                      <button
                        onClick={handleClearData}
                        className="flex items-center justify-center space-x-3 p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Tüm Verileri Temizle</span>
                      </button>
                    </div>
                  </div>

                  {/* Data Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Veri Güvenliği</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Tüm verileriniz tarayıcınızda yerel olarak saklanır. 
                          Verilerinizi düzenli olarak yedeklemenizi öneririz.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Ayarlar otomatik olarak kaydedilir
                </div>
                <button
                  onClick={savePreferences}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  <span>Kaydet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}