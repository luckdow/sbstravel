import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageCircle, Smartphone, CheckCircle, AlertCircle, Clock, X, Monitor } from 'lucide-react';
import { useNotificationStore, notificationService } from '../../lib/services/notification-service';

export default function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'email' | 'sms' | 'whatsapp' | 'system'>('all');

  useEffect(() => {
    // Initialize demo notifications on first load
    if (notifications.length === 0) {
      notificationService.initializeDemoNotifications();
    }
  }, [notifications.length]);

  const getIcon = (type: 'email' | 'sms' | 'whatsapp' | 'system') => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'sent':
        return 'Gönderildi';
      case 'delivered':
        return 'Teslim Edildi';
      case 'read':
        return 'Okundu';
      case 'failed':
        return 'Başarısız';
      default:
        return status;
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || n.type === filter
  );

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) {
      return `${minutes} dakika önce`;
    } else if (minutes < 24 * 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} saat önce`;
    } else {
      return timestamp.toLocaleDateString('tr-TR');
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Bildirimler</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Tümünü Okundu İşaretle
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3">
              {[
                { key: 'all', label: 'Tümü', count: notifications.length },
                { key: 'email', label: 'Email', count: notifications.filter(n => n.type === 'email').length },
                { key: 'sms', label: 'SMS', count: notifications.filter(n => n.type === 'sms').length },
                { key: 'whatsapp', label: 'WhatsApp', count: notifications.filter(n => n.type === 'whatsapp').length },
                { key: 'system', label: 'Sistem', count: notifications.filter(n => n.type === 'system').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Bildirim bulunamadı
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => notification.status !== 'read' && markAsRead(notification.id)}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer ${
                    notification.status !== 'read' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Channel Icon */}
                    <div className={`p-2 rounded-full ${
                      notification.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'sms' ? 'bg-green-100 text-green-600' :
                      notification.type === 'whatsapp' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        {getStatusIcon(notification.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          notification.status === 'delivered' || notification.status === 'read'
                            ? 'bg-green-100 text-green-700'
                            : notification.status === 'sent'
                            ? 'bg-yellow-100 text-yellow-700'
                            : notification.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {getStatusText(notification.status)}
                        </span>
                      </div>

                      {/* Reservation Link */}
                      {notification.reservationId && (
                        <div className="mt-2">
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            Rezervasyon {notification.reservationId} →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <button className="text-sm text-blue-600 hover:text-blue-800 w-full text-center">
              Tüm bildirimleri görüntüle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}