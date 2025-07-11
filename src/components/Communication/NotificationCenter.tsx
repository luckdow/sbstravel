import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageCircle, Smartphone, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { notificationService } from '../../services/communication';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  timestamp: Date;
  customerId?: string;
  reservationId?: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'email' | 'sms' | 'whatsapp'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications (mock data for demo)
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'email',
        title: 'Rezervasyon Onayı Gönderildi',
        message: 'Müşteri Ali Demir için rezervasyon onay emaili gönderildi',
        status: 'delivered',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        customerId: 'customer1',
        reservationId: 'RES001'
      },
      {
        id: '2',
        type: 'sms',
        title: 'Transfer Hatırlatıcı SMS',
        message: 'Yarın 14:30 transferi için hatırlatıcı SMS gönderildi',
        status: 'sent',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        customerId: 'customer2',
        reservationId: 'RES002'
      },
      {
        id: '3',
        type: 'whatsapp',
        title: 'QR Kod Gönderildi',
        message: 'Müşteriye WhatsApp ile QR kod paylaşıldı',
        status: 'read',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        customerId: 'customer3',
        reservationId: 'RES003'
      },
      {
        id: '4',
        type: 'email',
        title: 'Ödeme Başarılı Bildirimi',
        message: 'Ödeme onayı emaili gönderildi',
        status: 'failed',
        timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
        customerId: 'customer4',
        reservationId: 'RES004'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => n.status !== 'read').length);
  }, []);

  const getIcon = (type: 'email' | 'sms' | 'whatsapp') => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
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
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3">
              {[
                { key: 'all', label: 'Tümü', count: notifications.length },
                { key: 'email', label: 'Email', count: notifications.filter(n => n.type === 'email').length },
                { key: 'sms', label: 'SMS', count: notifications.filter(n => n.type === 'sms').length },
                { key: 'whatsapp', label: 'WhatsApp', count: notifications.filter(n => n.type === 'whatsapp').length }
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
                  className="p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    {/* Channel Icon */}
                    <div className={`p-2 rounded-full ${
                      notification.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'sms' ? 'bg-green-100 text-green-600' :
                      'bg-green-100 text-green-600'
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