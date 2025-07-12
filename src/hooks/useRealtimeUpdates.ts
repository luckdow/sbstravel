import { useEffect, useState } from 'react';
import { realtimeUpdatesService } from '../lib/firebase/real-time-updates';
import { Reservation } from '../types';
import toast from 'react-hot-toast';

export interface UseRealtimeReservationsOptions {
  enableNotifications?: boolean;
  enableBrowserNotifications?: boolean;
  onNewReservation?: (reservation: Reservation) => void;
}

export const useRealtimeReservations = (options: UseRealtimeReservationsOptions = {}) => {
  const [newReservationsCount, setNewReservationsCount] = useState(0);
  const [pendingPayments, setPendingPayments] = useState<Reservation[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    // Request notification permission if enabled
    if (options.enableBrowserNotifications) {
      realtimeUpdatesService.requestNotificationPermission();
    }

    // Subscribe to new reservations
    const unsubscribeReservations = realtimeUpdatesService.subscribeToNewReservations({
      onNewReservation: (reservation) => {
        setNewReservationsCount(prev => prev + 1);
        
        // Show toast notification
        if (options.enableNotifications) {
          toast.success(
            `Yeni rezervasyon: ${reservation.customerName}`,
            {
              duration: 5000,
              position: 'top-right',
              icon: '🚗'
            }
          );
        }

        // Call custom callback
        if (options.onNewReservation) {
          options.onNewReservation(reservation);
        }
      },
      onError: (error) => {
        console.error('Real-time updates error:', error);
        toast.error('Gerçek zamanlı güncellemeler bağlantısında sorun oluştu');
      }
    });

    // Subscribe to pending payments
    const unsubscribePendingPayments = realtimeUpdatesService.subscribeToPendingPayments(
      (reservations) => {
        setPendingPayments(reservations);
      }
    );

    // Update last seen timestamp when component mounts
    realtimeUpdatesService.updateLastSeenTimestamp();

    // Cleanup on unmount
    return () => {
      unsubscribeReservations();
      unsubscribePendingPayments();
    };
  }, [isListening, options.enableNotifications, options.enableBrowserNotifications, options.onNewReservation]);

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
    realtimeUpdatesService.unsubscribeAll();
  };

  const resetNewReservationsCount = () => {
    setNewReservationsCount(0);
    realtimeUpdatesService.updateLastSeenTimestamp();
  };

  return {
    newReservationsCount,
    pendingPayments,
    isListening,
    startListening,
    stopListening,
    resetNewReservationsCount
  };
};

// Hook for specific reservation updates
export const useReservationUpdates = (reservationId: string | null) => {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!reservationId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = realtimeUpdatesService.subscribeToReservationUpdates(
      reservationId,
      (updatedReservation) => {
        setReservation(updatedReservation);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [reservationId]);

  return {
    reservation,
    isLoading
  };
};