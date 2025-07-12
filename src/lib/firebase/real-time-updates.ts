import { onSnapshot, query, orderBy, limit, where } from 'firebase/firestore';
import { reservationsRef } from './collections';
import { Reservation } from '../../types';
import { useNotificationStore } from '../services/notification-service';

export interface RealtimeUpdateCallbacks {
  onNewReservation?: (reservation: Reservation) => void;
  onReservationUpdate?: (reservation: Reservation) => void;
  onError?: (error: Error) => void;
}

export class RealtimeUpdatesService {
  private static instance: RealtimeUpdatesService;
  private unsubscribers: Map<string, () => void> = new Map();
  private lastSeenTimestamp: Date = new Date();

  public static getInstance(): RealtimeUpdatesService {
    if (!RealtimeUpdatesService.instance) {
      RealtimeUpdatesService.instance = new RealtimeUpdatesService();
    }
    return RealtimeUpdatesService.instance;
  }

  // Listen for new reservations in real-time
  subscribeToNewReservations(callbacks: RealtimeUpdateCallbacks) {
    const q = query(
      reservationsRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const reservation = {
            id: change.doc.id,
            ...change.doc.data()
          } as Reservation;

          if (change.type === 'added') {
            // Check if this is a genuinely new reservation (after our last seen timestamp)
            const reservationCreatedAt = reservation.createdAt?.toDate?.() || new Date(reservation.createdAt || 0);
            
            if (reservationCreatedAt > this.lastSeenTimestamp) {
              console.log('New reservation detected:', reservation.id);
              
              // Add to notification store
              const { addNotification } = useNotificationStore.getState();
              addNotification({
                type: 'system',
                title: 'Yeni Rezervasyon',
                message: `${reservation.customerName} tarafından yeni rezervasyon oluşturuldu`,
                status: 'pending',
                customerId: reservation.customerId,
                reservationId: reservation.id,
                metadata: {
                  route: `${reservation.pickupLocation} → ${reservation.dropoffLocation}`,
                  totalPrice: reservation.totalPrice,
                  vehicleType: reservation.vehicleType
                }
              });

              // Call callback if provided
              if (callbacks.onNewReservation) {
                callbacks.onNewReservation(reservation);
              }

              // Show browser notification if supported and permitted
              this.showBrowserNotification(reservation);
            }
          } else if (change.type === 'modified') {
            console.log('Reservation updated:', reservation.id);
            if (callbacks.onReservationUpdate) {
              callbacks.onReservationUpdate(reservation);
            }
          }
        });
      },
      (error) => {
        console.error('Error listening for reservations:', error);
        if (callbacks.onError) {
          callbacks.onError(error);
        }
      }
    );

    this.unsubscribers.set('reservations', unsubscribe);
    return unsubscribe;
  }

  // Listen for reservation status updates
  subscribeToReservationUpdates(reservationId: string, callback: (reservation: Reservation) => void) {
    const q = query(reservationsRef, where('id', '==', reservationId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        const reservation = {
          id: doc.id,
          ...doc.data()
        } as Reservation;
        callback(reservation);
      });
    });

    this.unsubscribers.set(`reservation-${reservationId}`, unsubscribe);
    return unsubscribe;
  }

  // Listen for pending payments
  subscribeToPendingPayments(callback: (reservations: Reservation[]) => void) {
    const q = query(
      reservationsRef,
      where('paymentStatus', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reservations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      
      callback(reservations);
    });

    this.unsubscribers.set('pending-payments', unsubscribe);
    return unsubscribe;
  }

  // Show browser notification for new reservations
  private async showBrowserNotification(reservation: Reservation) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Yeni Rezervasyon!', {
          body: `${reservation.customerName} - ${reservation.pickupLocation} → ${reservation.dropoffLocation}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `reservation-${reservation.id}`,
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'Görüntüle'
            }
          ]
        });
      } catch (error) {
        console.warn('Failed to show notification:', error);
      }
    } else if ('Notification' in window && Notification.permission === 'default') {
      // Request permission for future notifications
      Notification.requestPermission();
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Update last seen timestamp
  updateLastSeenTimestamp() {
    this.lastSeenTimestamp = new Date();
  }

  // Unsubscribe from a specific listener
  unsubscribeFrom(key: string) {
    const unsubscribe = this.unsubscribers.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(key);
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.unsubscribers.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.unsubscribers.clear();
  }
}

// Export singleton instance
export const realtimeUpdatesService = RealtimeUpdatesService.getInstance();