import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Send,
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Edit,
  TestTube,
  RefreshCw
} from 'lucide-react';
import { notificationService, testCommunicationServices } from '../../services/communication';
import NotificationCenter from '../../components/Communication/NotificationCenter';
import EmailPreview from '../../components/Communication/EmailPreview';
import SMSComposer from '../../components/Communication/SMSComposer';
import WhatsAppChat from '../../components/Communication/WhatsAppChat';

export default function AdminNotificationManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'send' | 'templates' | 'settings' | 'analytics'>('dashboard');
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showSMSComposer, setShowSMSComposer] = useState(false);
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);

  useEffect(() => {
    loadServiceStatus();
  }, []);

  const loadServiceStatus = async () => {
    setLoading(true);
    try {
      const status = await notificationService.getServiceStatus();
      const verification = await notificationService.verifyAllServices();
      setServiceStatus(status);
      setVerification(verification);
    } catch (error) {
      console.error('Failed to load service status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testServices = async () => {
    setLoading(true);
    try {
      await testCommunicationServices();
      await loadServiceStatus();
    } catch (error) {
      console.error('Service test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const result = await notificationService.sendBookingConfirmation(
        'test-customer',
        'TEST123',
        {
          customerName: 'Test Müşteri',
          customerEmail: 'test@example.com',
          customerPhone: '+905551234567',
          bookingId: 'TEST123',
          transferType: 'Havalimanı → Otel',
          pickupLocation: 'Antalya Havalimanı',
          dropoffLocation: 'Kemer Otel',
          pickupDate: '2024-01-15',
          pickupTime: '14:30',
          passengerCount: '2',
          vehicleType: 'Standard',
          totalPrice: '250',
          qrCode: 'TEST-QR-123'
        }
      );
      
      if (result.success) {
        alert('Test bildirimi başarıyla gönderildi!');
      } else {
        alert(`Test bildirimi gönderilemedi: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      alert('Test bildirimi sırasında hata oluştu');
    }
  };

  const ServiceStatusCard = ({ service, status, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{service}</h3>
            <p className="text-sm text-gray-600">
              {status.available ? 'Aktif' : 'Devre Dışı'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {status.available ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>
      
      {status.providers && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Provider'lar:</p>
          <div className="space-y-1">
            {status.providers.map((provider: string) => (
              <div key={provider} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">{provider}</span>
                {verification && verification[`${service.toLowerCase()}_${provider}`] !== undefined ? (
                  verification[`${service.toLowerCase()}_${provider}`] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Service Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Servis Durumu</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={testServices}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    {loading ? 'Test Ediliyor...' : 'Test Et'}
                  </button>
                  <button
                    onClick={loadServiceStatus}
                    disabled={loading}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                  </button>
                </div>
              </div>

              {serviceStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ServiceStatusCard
                    service="Email"
                    status={serviceStatus.email}
                    icon={Mail}
                    color="bg-blue-100 text-blue-600"
                  />
                  <ServiceStatusCard
                    service="SMS"
                    status={serviceStatus.sms}
                    icon={Smartphone}
                    color="bg-green-100 text-green-600"
                  />
                  <ServiceStatusCard
                    service="WhatsApp"
                    status={serviceStatus.whatsapp}
                    icon={MessageSquare}
                    color="bg-green-100 text-green-600"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setShowEmailPreview(true)}
                  className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium">Email Önizleme</span>
                </button>
                
                <button
                  onClick={() => setShowSMSComposer(true)}
                  className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Send className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium">SMS Gönder</span>
                </button>
                
                <button
                  onClick={() => setShowWhatsAppChat(true)}
                  className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-green-600 mr-3" />
                  <span className="font-medium">WhatsApp Chat</span>
                </button>
                
                <button
                  onClick={sendTestNotification}
                  className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TestTube className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="font-medium">Test Bildirimi</span>
                </button>
              </div>
            </div>

            {/* Recent Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Bildirimler</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zaman
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { type: 'email', recipient: 'ahmet@example.com', template: 'Rezervasyon Onayı', status: 'delivered', time: '2 dk önce' },
                      { type: 'sms', recipient: '+90 555 123 4567', template: 'Transfer Hatırlatıcı', status: 'sent', time: '5 dk önce' },
                      { type: 'whatsapp', recipient: '+90 555 987 6543', template: 'QR Kod', status: 'read', time: '8 dk önce' },
                      { type: 'email', recipient: 'fatma@example.com', template: 'Ödeme Başarılı', status: 'failed', time: '12 dk önce' }
                    ].map((notification, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {notification.type === 'email' && <Mail className="w-4 h-4 text-blue-600 mr-2" />}
                            {notification.type === 'sms' && <Smartphone className="w-4 h-4 text-green-600 mr-2" />}
                            {notification.type === 'whatsapp' && <MessageSquare className="w-4 h-4 text-green-600 mr-2" />}
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {notification.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.recipient}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {notification.template}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.status === 'delivered' || notification.status === 'read'
                              ? 'bg-green-100 text-green-800'
                              : notification.status === 'sent'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {notification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {notification.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Bildirim Analitikleri</h3>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Toplam Gönderilen', value: '1,234', change: '+12%', color: 'text-blue-600' },
                { title: 'Teslim Edildi', value: '1,156', change: '+8%', color: 'text-green-600' },
                { title: 'Açılma Oranı', value: '87.5%', change: '+3%', color: 'text-purple-600' },
                { title: 'Başarısız', value: '78', change: '-15%', color: 'text-red-600' }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-600">{stat.title}</h4>
                  <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change} geçen haftaya göre</p>
                </div>
              ))}
            </div>

            {/* Channel Performance */}
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Kanal Performansı</h4>
              <div className="space-y-4">
                {[
                  { channel: 'Email', sent: 456, delivered: 423, rate: '92.8%', color: 'bg-blue-500' },
                  { channel: 'SMS', sent: 389, delivered: 378, rate: '97.2%', color: 'bg-green-500' },
                  { channel: 'WhatsApp', sent: 389, delivered: 355, rate: '91.3%', color: 'bg-green-600' }
                ].map((channel) => (
                  <div key={channel.channel} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${channel.color}`}></div>
                      <span className="font-medium text-gray-900">{channel.channel}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Gönderilen: {channel.sent}</span>
                      <span>Teslim: {channel.delivered}</span>
                      <span className="font-semibold text-gray-900">{channel.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Bu sekme henüz geliştirilme aşamasında...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Bildirim Yönetimi</h1>
              <p className="text-sm text-gray-600">Email, SMS ve WhatsApp bildirimleri yönetimi</p>
            </div>
            <NotificationCenter />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'send', label: 'Gönder', icon: Send },
              { key: 'templates', label: 'Template\'ler', icon: Edit },
              { key: 'settings', label: 'Ayarlar', icon: Settings },
              { key: 'analytics', label: 'Analitikler', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <TabContent />
      </div>

      {/* Modals */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-auto">
            <EmailPreview onClose={() => setShowEmailPreview(false)} />
          </div>
        </div>
      )}

      {showSMSComposer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <SMSComposer onClose={() => setShowSMSComposer(false)} />
          </div>
        </div>
      )}

      {showWhatsAppChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <WhatsAppChat onClose={() => setShowWhatsAppChat(false)} />
        </div>
      )}
    </div>
  );
}