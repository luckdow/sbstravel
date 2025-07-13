import { create } from 'zustand';
import { 
  Reservation, 
  Driver, 
  Customer,
  BookingFormData
} from '../types';
import {
  createReservation,
  updateReservation,
  getReservations,
  getActiveDrivers,
  createCustomer,
  getCustomerByEmail,
  createCommission,
  subscribeToReservations,
  subscribeToDrivers
} from '../lib/firebase/collections';
import { generateQRCode } from '../utils/qrCode';
import toast from 'react-hot-toast';

interface FirebaseState {
  // Data
  reservations: Reservation[];
  drivers: Driver[];
  customers: Customer[];
  currentDriver: Driver | null;
  loading: boolean;
  
  // Actions
  fetchReservations: () => Promise<void>;
  createNewReservation: (data: BookingFormData & { distance?: number; totalPrice?: number }) => Promise<string | null>;
  updateReservationStatus: (id: string, status: string, driverId?: string) => Promise<void>;
  
  fetchDrivers: () => Promise<void>;
  setCurrentDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: string) => Promise<void>;
  
  fetchCustomers: () => Promise<void>;
  
  // Real-time subscriptions
  subscribeToRealtimeUpdates: () => () => void;
}

export const useFirebaseStore = create<FirebaseState>((set, get) => ({
  reservations: [],
  drivers: [],
  customers: [],
  currentDriver: null,
  loading: false,

  // Fetch Reservations
  fetchReservations: async () => {
    set({ loading: true });
    try {
      const reservations = await getReservations();
      set({ reservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Rezervasyonlar yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Create New Reservation
  createNewReservation: async (reservationData) => {
    try {
      console.log('Creating new reservation with data:', reservationData);
      
      // Generate QR code
      const qrCode = generateQRCode();
      console.log('Generated QR code:', qrCode);
      
      // Check if customer exists, if not create one
      let customer = await getCustomerByEmail(reservationData.customerInfo.email);
      if (!customer) {
        console.log('Creating new customer...');
        const customerId = await createCustomer({
          firstName: reservationData.customerInfo.firstName,
          lastName: reservationData.customerInfo.lastName,
          email: reservationData.customerInfo.email,
          phone: reservationData.customerInfo.phone,
          totalReservations: 0
        });
        customer = { 
          id: customerId, 
          ...reservationData.customerInfo,
          totalReservations: 0,
          createdAt: new Date()
        };
        console.log('Customer created successfully:', customerId);
      } else {
        console.log('Existing customer found:', customer.id);
        // Update customer's total reservations
        customer.totalReservations = (customer.totalReservations || 0) + 1;
      }

      // Create reservation
      const reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
        customerId: customer.id!,
        customerName: `${reservationData.customerInfo.firstName} ${reservationData.customerInfo.lastName}`,
        customerEmail: reservationData.customerInfo.email,
        customerPhone: reservationData.customerInfo.phone,
        transferType: reservationData.transferType,
        pickupLocation: reservationData.transferType === 'airport-hotel' 
          ? 'Antalya Havalimanı (AYT)' 
          : reservationData.destination.name,
        dropoffLocation: reservationData.transferType === 'airport-hotel' 
          ? reservationData.destination.name 
          : 'Antalya Havalimanı (AYT)',
        pickupDate: reservationData.pickupDate,
        pickupTime: reservationData.pickupTime,
        passengerCount: reservationData.passengerCount,
        baggageCount: reservationData.baggageCount,
        vehicleType: reservationData.vehicleType,
        distance: reservationData.distance || 45, // Default distance
        basePrice: (reservationData.totalPrice || 0) / 1.18, // Remove tax for base price
        totalPrice: reservationData.totalPrice || 0,
        status: 'pending',
        qrCode,
        paymentStatus: 'completed', // Assuming payment is completed
        additionalServices: reservationData.additionalServices || []
      };

      console.log('Creating reservation in Firebase...');
      const reservationId = await createReservation(reservation);
      console.log('Reservation created with ID:', reservationId);
      
      // Create full reservation object for notifications
      const newReservation: Reservation = { 
        id: reservationId, 
        ...reservation,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        reservations: [newReservation, ...state.reservations]
      }));

      try {
        // Send automated email notification with QR code
        console.log('Sending email notification...');
        const { emailService } = await import('../lib/email-service');
        const emailSent = await emailService.sendReservationConfirmation(newReservation, qrCode);
        
        if (emailSent) {
          console.log('✅ Email notification sent successfully');
          toast.success('Rezervasyon oluşturuldu! Onay e-postası gönderildi.');
        } else {
          console.warn('⚠️ Email notification failed');
          toast.success('Rezervasyon oluşturuldu!');
        }
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        toast.success('Rezervasyon oluşturuldu!');
      }
      
      return reservationId;
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Rezervasyon oluşturulurken hata oluştu';
      toast.error(errorMessage);
      return null;
    }
  },

  // Update Reservation Status
  updateReservationStatus: async (id, status, driverId) => {
    try {
      const updates: Partial<Reservation> = { status };
      
      if (driverId) {
        updates.driverId = driverId;
        
        // Create commission record when driver is assigned
        const reservation = get().reservations.find(r => r.id === id);
        if (reservation) {
          await createCommission(id, driverId, reservation.totalPrice);
          
          // Send driver notification with QR code
          try {
            console.log('Sending driver notification...');
            const { emailService } = await import('../lib/email-service');
            const emailSent = await emailService.sendDriverNotification(driverId, reservation, reservation.qrCode);
            
            if (emailSent) {
              console.log('✅ Driver notification sent successfully');
            } else {
              console.warn('⚠️ Driver notification failed');
            }
          } catch (emailError) {
            console.error('Driver notification error:', emailError);
          }
        }
      }

      await updateReservation(id, updates);
      
      // Update local state
      set(state => ({
        reservations: state.reservations.map(res =>
          res.id === id ? { ...res, ...updates, updatedAt: new Date() } : res
        )
      }));

      if (driverId && status === 'assigned') {
        toast.success('Şoför başarıyla atandı ve bilgilendirildi!');
      } else {
        toast.success('Rezervasyon durumu güncellendi!');
      }

    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Rezervasyon güncellenirken hata oluştu');
    }
  },

  // Fetch Drivers
  fetchDrivers: async () => {
    try {
      const drivers = await getActiveDrivers();
      set({ drivers });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Şoförler yüklenirken hata oluştu');
    }
  },

  // Set Current Driver
  setCurrentDriver: (driver) => {
    set({ currentDriver: driver });
    localStorage.setItem('currentDriver', JSON.stringify(driver));
  },

  // Update Driver Status
  updateDriverStatus: async (id, status) => {
    try {
      // This would be implemented with updateDriver function
      // For now, just update local state
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, status } : driver
        )
      }));
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  },

  // Fetch Customers
  fetchCustomers: async () => {
    try {
      // This would fetch all customers - implement as needed
      set({ customers: [] });
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  },

  // Subscribe to Real-time Updates
  subscribeToRealtimeUpdates: () => {
    const unsubscribeReservations = subscribeToReservations((reservations) => {
      set({ reservations });
    });

    const unsubscribeDrivers = subscribeToDrivers((drivers) => {
      set({ drivers });
    });

    // Return cleanup function
    return () => {
      unsubscribeReservations();
      unsubscribeDrivers();
    };
  }
}));