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
  createCustomer,
  getCustomerByEmail,
  createCommission,
  subscribeToReservations,
  subscribeToDrivers,
  getAvailableDrivers,
  updateDriver,
  createDriver
} from '../lib/firebase/collections';
import { generateQRCode } from '../lib/utils/qr-code';
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
  deleteReservation: (id: string) => Promise<void>;
  
  fetchDrivers: () => Promise<void>;
  setCurrentDriver: (driver: Driver) => void;
  updateDriverStatus: (id: string, status: string) => Promise<void>;
  addDriver: (driverData: Omit<Driver, 'id' | 'createdAt'>) => Promise<string | null>;
  editDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  
  fetchCustomers: () => Promise<void>;
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt'>) => Promise<string | null>;
  editCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Vehicle management
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<string | null>;
  editVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Real-time subscriptions
  subscribeToRealtimeUpdates: () => () => void;
  
  // Statistics
  getStats: () => {
    todayReservations: number;
    totalRevenue: number;
    activeDrivers: number;
    vehiclesInUse: number;
    pendingReservations: number;
  };
}

export const useStore = create<StoreState>((set, get) => ({
  reservations: [],
  drivers: [],
  customers: [],
  vehicles: [],
  commissions: [],
  currentDriver: null,
  loading: false,

  // Fetch Reservations from Firebase
  fetchReservations: async () => {
    set({ loading: true });
    try {
      console.log('Fetching reservations from Firebase...');
      const reservations = await getReservations();
      console.log('Fetched reservations:', reservations.length);
      set({ reservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Rezervasyonlar yüklenirken hata oluştu');
      
      // Fallback to mock data if Firebase fails
      const mockReservations = [
        {
          id: 'RES-001',
          customerId: 'CUST-001',
          customerName: 'Ahmet Yılmaz',
          customerEmail: 'ahmet@email.com',
          customerPhone: '+90 532 123 4567',
          transferType: 'airport-hotel' as const,
          pickupLocation: 'Antalya Havalimanı (AYT)',
          dropoffLocation: 'Kemer - Club Med Palmiye',
          pickupDate: '2024-01-15',
          pickupTime: '14:30',
          passengerCount: 4,
          baggageCount: 3,
          vehicleType: 'premium' as const,
          distance: 45,
          basePrice: 72.03,
          additionalServices: [],
          totalPrice: 85,
          status: 'pending' as const,
          qrCode: 'QR-001',
          paymentStatus: 'completed' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'RES-002',
          customerId: 'CUST-002',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@email.com',
          customerPhone: '+1 555 123 4567',
          transferType: 'hotel-airport' as const,
          pickupLocation: 'Belek - Regnum Carya',
          dropoffLocation: 'Antalya Havalimanı (AYT)',
          pickupDate: '2024-01-15',
          pickupTime: '16:00',
          passengerCount: 2,
          baggageCount: 2,
          vehicleType: 'luxury' as const,
          distance: 35,
          basePrice: 101.69,
          additionalServices: [],
          totalPrice: 120,
          status: 'assigned' as const,
          driverId: 'DRV-001',
          qrCode: 'QR-002',
          paymentStatus: 'completed' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      set({ reservations: mockReservations });
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
        customerName: `${reservationData.customerInfo?.firstName} ${reservationData.customerInfo?.lastName}`,
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
        distance: reservationData.distance,
        basePrice: reservationData.totalPrice / 1.18, // Remove tax for base price
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
      const updates: Partial<Reservation> = { status };
      
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

  // Delete Reservation
  deleteReservation: async (id) => {
    try {
      // In a real implementation, you'd have a deleteReservation function
      // For now, we'll just update the status to cancelled
      await updateReservation(id, { status: 'cancelled' });
      
      set(state => ({
        reservations: state.reservations.map(res =>
          res.id === id ? { ...res, status: 'cancelled', updatedAt: new Date() } : res
        )
      }));
      
      toast.success('Rezervasyon iptal edildi!');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Rezervasyon silinirken hata oluştu');
    }
  },

  // Fetch Drivers
  fetchDrivers: async () => {
    try {
      console.log('Fetching drivers...');
      const availableDrivers = await getAvailableDrivers();
      console.log('Fetched drivers:', availableDrivers.length);
      set({ drivers: availableDrivers });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Şoförler yüklenirken hata oluştu');
      
      // Fallback to mock data
      const mockDrivers = [
        {
          id: 'DRV-001',
          firstName: 'Mehmet',
          lastName: 'Demir',
          email: 'mehmet@ayttransfer.com',
          phone: '+90 532 111 2233',
          licenseNumber: 'ABC123',
          vehicleType: 'premium' as const,
          status: 'available' as const,
          currentLocation: 'Antalya Merkez',
          rating: 4.8,
          totalEarnings: 2340,
          completedTrips: 156,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'DRV-002',
          firstName: 'Ali',
          lastName: 'Kaya',
          email: 'ali@ayttransfer.com',
          phone: '+90 533 222 3344',
          licenseNumber: 'DEF456',
          vehicleType: 'luxury' as const,
          status: 'busy' as const,
          currentLocation: 'Kemer',
          rating: 4.9,
          totalEarnings: 3120,
          completedTrips: 203,
          isActive: true,
          createdAt: new Date()
        }
      ];
      set({ drivers: mockDrivers });
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
      await updateDriver(id, { status });
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, status } : driver
        )
      }));
      toast.success('Şoför durumu güncellendi!');
    } catch (error) {
      console.error('Error updating driver status:', error);
      toast.error('Şoför durumu güncellenirken hata oluştu');
    }
  },

  // Add Driver
  addDriver: async (driverData) => {
    try {
      const driverId = await createDriver(driverData);
      const newDriver = { id: driverId, ...driverData, createdAt: new Date() };
      
      set(state => ({
        drivers: [newDriver, ...state.drivers]
      }));
      
      toast.success('Şoför başarıyla eklendi!');
      return driverId;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Şoför eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Driver
  editDriver: async (id, updates) => {
    try {
      await updateDriver(id, updates);
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, ...updates } : driver
        )
      }));
      toast.success('Şoför bilgileri güncellendi!');
    } catch (error) {
      console.error('Error editing driver:', error);
      toast.error('Şoför güncellenirken hata oluştu');
    }
  },

  // Delete Driver
  deleteDriver: async (id) => {
    try {
      await updateDriver(id, { isActive: false });
      set(state => ({
        drivers: state.drivers.filter(driver => driver.id !== id)
      }));
      toast.success('Şoför silindi!');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Şoför silinirken hata oluştu');
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

  // Add Customer
  addCustomer: async (customerData) => {
    try {
      const customerId = await createCustomer(customerData);
      const newCustomer = { id: customerId, ...customerData, createdAt: new Date() };
      
      set(state => ({
        customers: [newCustomer, ...state.customers]
      }));
      
      toast.success('Müşteri başarıyla eklendi!');
      return customerId;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Müşteri eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Customer
  editCustomer: async (id, updates) => {
    try {
      // Implement updateCustomer function
      set(state => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      }));
      toast.success('Müşteri bilgileri güncellendi!');
    } catch (error) {
      console.error('Error editing customer:', error);
      toast.error('Müşteri güncellenirken hata oluştu');
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    try {
      // Implement deleteCustomer function
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id)
      }));
      toast.success('Müşteri silindi!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Müşteri silinirken hata oluştu');
    }
  },

  // Vehicle management
  addVehicle: async (vehicleData) => {
    try {
      // Implement createVehicle function
      const newVehicle = { id: `VEH-${Date.now()}`, ...vehicleData, createdAt: new Date() };
      
      set(state => ({
        vehicles: [newVehicle, ...state.vehicles]
      }));
      
      toast.success('Araç başarıyla eklendi!');
      return newVehicle.id!;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Araç eklenirken hata oluştu');
      return null;
    }
  },

  editVehicle: async (id, updates) => {
    try {
      set(state => ({
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === id ? { ...vehicle, ...updates } : vehicle
        )
      }));
      toast.success('Araç bilgileri güncellendi!');
    } catch (error) {
      console.error('Error editing vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    }
  },

  deleteVehicle: async (id) => {
    try {
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
      }));
      toast.success('Araç silindi!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Araç silinirken hata oluştu');
    }
  },

  // Subscribe to Real-time Updates
  subscribeToRealtimeUpdates: () => {
    console.log('Subscribing to real-time updates...');
    
    const unsubscribeReservations = subscribeToReservations((reservations) => {
      console.log('Real-time reservations update:', reservations.length);
      set({ reservations });
    });

    const unsubscribeDrivers = subscribeToDrivers((drivers) => {
      console.log('Real-time drivers update:', drivers.length);
      set({ drivers });
    });

    // Return cleanup function
    return () => {
      unsubscribeReservations();
      unsubscribeDrivers();
    };
  },

  // Get Statistics
  getStats: () => {
    const state = get();
    const today = new Date().toDateString();
    
    const todayReservations = state.reservations.filter(r => 
      new Date(r.createdAt || Date.now()).toDateString() === today
    ).length;

    const totalRevenue = state.reservations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.totalPrice, 0);

    const activeDrivers = state.drivers.filter(d => 
      d.status === 'available' || d.status === 'busy'
    ).length;

    const vehiclesInUse = state.drivers.filter(d => d.status === 'busy').length;

    const pendingReservations = state.reservations.filter(r => 
      r.status === 'pending'
    ).length;

    return {
      todayReservations,
      totalRevenue,
      activeDrivers,
      vehiclesInUse,
      pendingReservations
    };
  }
}));