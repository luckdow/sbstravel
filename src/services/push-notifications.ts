import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { messaging } from '../config/firebase';

export class PushNotificationService {
  private static instance: PushNotificationService | null = null;
  // Düzeltilmiş VAPID key formatı (base64url formatında olmalı)
  private vapidKey = 'BH1_lA-YjKcN6S_6tKO9d5PpU8KvJ5e5_kHr0_2pKJxDwG_8mZKtUBNxgCqFZQl4YV=';

  static getInstance(): PushNotificationService {
    if (!this.instance) {
      this.instance = new PushNotificationService();
    }
    return this.instance;
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      if (!messaging) {
        console.warn('Firebase messaging not supported');
        return null;
      }

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Notification permission not granted');
        return null;
      }

      // Geçici olarak token almayı devre dışı bırakalım
      // const token = await getToken(messaging, {
      //   vapidKey: this.vapidKey
      // });
      
      // Simüle edilmiş token
      const token = "simulated-fcm-token-" + Date.now();

      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  setupMessageListener(): void {
    if (!messaging) {
      console.warn('Firebase messaging not supported');
      return;
    }

    onMessage(messaging, (payload: MessagePayload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification
      if (payload.notification) {
        this.showNotification(
          payload.notification.title || 'Bildirim',
          {
            body: payload.notification.body || '',
            icon: payload.notification.icon || '/favicon.ico',
            badge: '/favicon.ico',
            tag: payload.data?.tag || 'general'
          }
        );
      }
    });
  }

  private showNotification(title: string, options: NotificationOptions): void {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    } else {
      new Notification(title, options);
    }
  }

  async sendTestNotification(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No FCM token available');
      }

      // This would typically be sent from your backend
      // For demo purposes, we'll show a local notification
      this.showNotification('Test Bildirimi', {
        body: 'Push notification sistemi çalışıyor!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test'
      });

      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  async subscribeToBookingUpdates(customerId: string): Promise<void> {
    try {
      const token = await this.getToken();
      if (token) {
        // Store token for this customer in your backend
        console.log(`Subscribing customer ${customerId} with token:`, token);
        
        // Here you would typically send this to your backend:
        // await api.post('/notifications/subscribe', { customerId, token });
      }
    } catch (error) {
      console.error('Error subscribing to booking updates:', error);
    }
  }
}

export const pushNotificationService = PushNotificationService.getInstance();