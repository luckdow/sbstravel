import { create } from 'zustand';

export interface NotificationData {
  id: string;
  type: 'email' | 'sms' | 'whatsapp' | 'system';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  timestamp: Date;
  customerId?: string;
  reservationId?: string;
  metadata?: Record<string, any>;
}

interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateStatus: (id: string, status: NotificationData['status']) => void;
  getNotificationsByType: (type: string) => NotificationData[];
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notificationData) =>
    set((state) => {
      const newNotification: NotificationData = {
        ...notificationData,
        id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      const updatedNotifications = [newNotification, ...state.notifications];
      const unreadCount = updatedNotifications.filter(n => n.status !== 'read').length;

      return {
        notifications: updatedNotifications,
        unreadCount
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, status: 'read' as const } : n
      );
      const unreadCount = updatedNotifications.filter(n => n.status !== 'read').length;

      return {
        notifications: updatedNotifications,
        unreadCount
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, status: 'read' as const })),
      unreadCount: 0
    })),

  deleteNotification: (id) =>
    set((state) => {
      const updatedNotifications = state.notifications.filter(n => n.id !== id);
      const unreadCount = updatedNotifications.filter(n => n.status !== 'read').length;

      return {
        notifications: updatedNotifications,
        unreadCount
      };
    }),

  updateStatus: (id, status) =>
    set((state) => {
      const updatedNotifications = state.notifications.map(n =>
        n.id === id ? { ...n, status } : n
      );
      const unreadCount = updatedNotifications.filter(n => n.status !== 'read').length;

      return {
        notifications: updatedNotifications,
        unreadCount
      };
    }),

  getNotificationsByType: (type) => {
    const { notifications } = get();
    return notifications.filter(n => n.type === type);
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));

// Notification Service Class
export class NotificationService {
  private store = useNotificationStore;

  // Create different types of notifications
  async sendReservationConfirmation(reservationId: string, customerId: string, customerEmail: string) {
    this.store.getState().addNotification({
      type: 'email',
      title: 'Rezervasyon Onayı Gönderildi',
      message: `Rezervasyon ${reservationId} için onay emaili ${customerEmail} adresine gönderildi`,
      status: 'sent',
      customerId,
      reservationId,
      metadata: { email: customerEmail }
    });

    // Simulate async email sending
    setTimeout(() => {
      this.store.getState().updateStatus(
        this.store.getState().notifications[0]?.id,
        Math.random() > 0.1 ? 'delivered' : 'failed'
      );
    }, 2000);
  }

  async sendDriverAssignmentSMS(reservationId: string, customerId: string, driverName: string, customerPhone: string) {
    this.store.getState().addNotification({
      type: 'sms',
      title: 'Şoför Atama SMS Gönderildi',
      message: `${driverName} şoförü ${reservationId} rezervasyonuna atandı. SMS ${customerPhone} numarasına gönderildi`,
      status: 'sent',
      customerId,
      reservationId,
      metadata: { phone: customerPhone, driverName }
    });

    setTimeout(() => {
      this.store.getState().updateStatus(
        this.store.getState().notifications[0]?.id,
        Math.random() > 0.05 ? 'delivered' : 'failed'
      );
    }, 1500);
  }

  async sendQRCodeWhatsApp(reservationId: string, customerId: string, customerPhone: string) {
    this.store.getState().addNotification({
      type: 'whatsapp',
      title: 'QR Kod WhatsApp ile Gönderildi',
      message: `Rezervasyon ${reservationId} QR kodu WhatsApp ile ${customerPhone} numarasına gönderildi`,
      status: 'sent',
      customerId,
      reservationId,
      metadata: { phone: customerPhone }
    });

    setTimeout(() => {
      this.store.getState().updateStatus(
        this.store.getState().notifications[0]?.id,
        'delivered'
      );
    }, 1000);
  }

  async sendPaymentConfirmation(reservationId: string, customerId: string, amount: number, method: string) {
    this.store.getState().addNotification({
      type: 'email',
      title: 'Ödeme Onayı Gönderildi',
      message: `${amount}$ tutarındaki ödeme onayı (${method}) rezervasyon ${reservationId} için gönderildi`,
      status: 'sent',
      customerId,
      reservationId,
      metadata: { amount, method }
    });

    setTimeout(() => {
      this.store.getState().updateStatus(
        this.store.getState().notifications[0]?.id,
        'delivered'
      );
    }, 1200);
  }

  async sendTransferReminder(reservationId: string, customerId: string, pickupTime: string) {
    this.store.getState().addNotification({
      type: 'sms',
      title: 'Transfer Hatırlatıcı Gönderildi',
      message: `${pickupTime} transfer hatırlatıcısı rezervasyon ${reservationId} için gönderildi`,
      status: 'sent',
      customerId,
      reservationId,
      metadata: { pickupTime }
    });

    setTimeout(() => {
      this.store.getState().updateStatus(
        this.store.getState().notifications[0]?.id,
        'delivered'
      );
    }, 1000);
  }

  async sendNewReservationAlert(reservationId: string, customerName: string) {
    this.store.getState().addNotification({
      type: 'system',
      title: 'Yeni Rezervasyon',
      message: `${customerName} tarafından yeni rezervasyon oluşturuldu: ${reservationId}`,
      status: 'delivered',
      reservationId,
      metadata: { customerName }
    });
  }

  async sendDriverStatusUpdate(driverId: string, driverName: string, status: string) {
    this.store.getState().addNotification({
      type: 'system',
      title: 'Şoför Durum Güncellendi',
      message: `${driverName} şoförünün durumu ${status} olarak güncellendi`,
      status: 'delivered',
      metadata: { driverId, driverName, status }
    });
  }

  // Initialize with some demo notifications
  initializeDemoNotifications() {
    const demoNotifications = [
      {
        type: 'email' as const,
        title: 'Rezervasyon Onayı Gönderildi',
        message: 'Müşteri Ali Demir için rezervasyon onay emaili gönderildi',
        status: 'delivered' as const,
        customerId: 'customer1',
        reservationId: 'RES001'
      },
      {
        type: 'sms' as const,
        title: 'Transfer Hatırlatıcı SMS',
        message: 'Yarın 14:30 transferi için hatırlatıcı SMS gönderildi',
        status: 'sent' as const,
        customerId: 'customer2',
        reservationId: 'RES002'
      },
      {
        type: 'whatsapp' as const,
        title: 'QR Kod Gönderildi',
        message: 'Müşteriye WhatsApp ile QR kod paylaşıldı',
        status: 'read' as const,
        customerId: 'customer3',
        reservationId: 'RES003'
      },
      {
        type: 'system' as const,
        title: 'Yeni Rezervasyon',
        message: 'Elena Popov tarafından yeni rezervasyon oluşturuldu',
        status: 'delivered' as const,
        reservationId: 'RES004'
      }
    ];

    // Add demo notifications with slight delays to simulate real-time
    demoNotifications.forEach((notification, index) => {
      setTimeout(() => {
        this.store.getState().addNotification(notification);
      }, index * 500);
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();