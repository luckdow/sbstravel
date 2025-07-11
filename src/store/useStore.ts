import { create } from 'zustand';
import { 
  Reservation, 
  Driver, 
  Customer, 
  Vehicle,
  Commission,
  BookingFormData 
} from '../types';
import {
  createReservation,
  updateReservation,
  getReservations,
  getAvailableDrivers,
  createCustomer,
  getCustomerByEmail,
  createCommission,
  subscribeToReservations,
  subscribeToDrivers
} from '../lib/firebase/collections';
import { generateQRCode } from '../lib/utils/qr-code';
import { calculateTotalPrice } from '../lib/utils/pricing';
import { googleMapsService } from '../lib/google-maps';
import toast from 'react-hot-toast';

interface StoreState {
  // Data
  reservations: Reservation[];
  drivers: Driver[];
  customers: Customer[];
  vehicles: Vehicle[];
  commissions: Commission[];
  currentDriver: Driver | null;
  loading: boolean;
  
  // Actions
  fetchReservations: () => Promise<void>;
  createNewReservation: (data: BookingFormData & { distance: number; totalPrice: number }) => Promise<string | null>;
  updateReservationStatus: (id: string, status: string, driverId?: string) => Promise<void>;
  
  fetchDrivers: () => Promise<void>;
  setCurrentDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: string) => Promise<void>;
  
  fetchCustomers: () => Promise<void>;
  
  // Real-time subscriptions
  subscribeToRealtimeUpdates: () => () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  reservations: [],
  drivers: [],
  customers: [],
  vehicles: [],
  commissions: [],
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
      // Generate QR code
      const qrCode = generateQRCode();
      
      // Check if customer exists, if not create one
      let customer = await getCustomerByEmail(reservationData.customerInfo.email);
      if (!customer) {
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
          totalReservations: 0
        };
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
          : reservationData.destination,
        dropoffLocation: reservationData.transferType === 'airport-hotel' 
          ? reservationData.destination 
          : 'Antalya Havalimanı (AYT)',
        pickupDate: reservationData.pickupDate,
        pickupTime: reservationData.pickupTime,
        passengerCount: reservationData.passengerCount,
        baggageCount: reservationData.baggageCount,
        vehicleType: reservationData.vehicleType,
        distance: reservationData.distance,
        basePrice: reservationData.totalPrice,
        additionalServices: [],
        totalPrice: reservationData.totalPrice,
        status: 'pending',
        qrCode,
        paymentStatus: 'completed' // Assuming payment is completed
      };

      const reservationId = await createReservation(reservation);
      
      // Update local state
      const newReservation = { 
        id: reservationId, 
        ...reservation,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        reservations: [newReservation, ...state.reservations]
      }));
      
      toast.success('Rezervasyon başarıyla oluşturuldu!');
      return reservationId;
      
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Rezervasyon oluşturulurken hata oluştu');
      return null;
    }
  },

  // Update Reservation Status
  updateReservationStatus: async (id, status, driverId) => {
    try {
      const updates: any = { status };
      
      if (driverId) {
        updates.driverId = driverId;
        
        // Create commission record when driver is assigned
        const reservation = get().reservations.find(r => r.id === id);
        if (reservation) {
          await createCommission(id, driverId, reservation.totalPrice);
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
        toast.success('Şoför başarıyla atandı!');
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
      const drivers = await getAvailableDrivers();
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