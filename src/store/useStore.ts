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
import { getLocationString } from '../lib/utils/location';
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
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<string | null>;
  editVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Demo data management
  saveDemoDataToFirebase: () => Promise<void>;
  clearAllDemoData: () => Promise<void>;
  initializeMockData: () => void;
  
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

  // Initialize mock data for all entities
  initializeMockData: () => {
    console.log('Initializing mock data for all entities...');
    
    // Mock customers data
    const mockCustomers = [
      {
        id: 'CUST-001',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@email.com',
        phone: '+90 532 123 4567',
        totalReservations: 3,
        totalSpent: 310,
        lastActivity: new Date(),
        lastReservationDate: new Date(),
        status: 'active' as const,
        notes: 'VIP müşteri, özel ilgi gösterilmeli',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'CUST-002',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@email.com',
        phone: '+1 555 123 4567',
        totalReservations: 1,
        totalSpent: 120,
        lastActivity: new Date(),
        lastReservationDate: new Date(),
        status: 'active' as const,
        notes: 'İngilizce konuşuyor, turist',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'CUST-003',
        firstName: 'Mustafa',
        lastName: 'Demir',
        email: 'mustafa@email.com',
        phone: '+90 533 987 6543',
        totalReservations: 2,
        totalSpent: 165,
        lastActivity: new Date(),
        lastReservationDate: new Date(),
        status: 'active' as const,
        notes: 'Düzenli müşteri',
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date()
      }
    ];

    // Mock vehicles data with USD pricing
    const mockVehicles = [
      {
        id: 'VEH-001',
        type: 'premium' as const,
        name: 'Mercedes Vito Premium',
        model: 'Mercedes Vito 2023',
        image: '/api/placeholder/300/200',
        images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
        licensePlate: '07 ABC 123',
        passengerCapacity: 8,
        baggageCapacity: 8,
        pricePerKm: 2.5, // USD
        features: ['Wi-Fi', 'Klima', 'Premium İç Dizayn', 'USB Şarj'],
        extraServices: ['wifi', 'water', 'magazines'],
        status: 'active' as const,
        isActive: true,
        lastMaintenance: new Date('2024-01-01'),
        totalKilometers: 45000,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'VEH-002',
        type: 'luxury' as const,
        name: 'BMW X7 Luxury',
        model: 'BMW X7 2024',
        image: '/api/placeholder/300/200',
        images: ['/api/placeholder/300/200'],
        licensePlate: '07 DEF 456',
        passengerCapacity: 6,
        baggageCapacity: 6,
        pricePerKm: 3.5, // USD
        features: ['VIP İç Dizayn', 'Premium Ses Sistemi', 'Deri Koltuk', 'Mini Bar'],
        extraServices: ['vip-service', 'refreshments', 'wifi'],
        status: 'active' as const,
        isActive: true,
        lastMaintenance: new Date('2023-12-15'),
        totalKilometers: 32000,
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date()
      },
      {
        id: 'VEH-003',
        type: 'standard' as const,
        name: 'Volkswagen Caddy',
        model: 'Volkswagen Caddy 2022',
        image: '/api/placeholder/300/200',
        images: ['/api/placeholder/300/200'],
        licensePlate: '07 GHI 789',
        passengerCapacity: 4,
        baggageCapacity: 4,
        pricePerKm: 1.8, // USD
        features: ['Klima', 'Müzik Sistemi', 'Temiz İç Mekan'],
        extraServices: ['basic-comfort'],
        status: 'maintenance' as const,
        isActive: true,
        lastMaintenance: new Date('2024-01-10'),
        totalKilometers: 67000,
        createdAt: new Date('2022-06-01'),
        updatedAt: new Date()
      }
    ];

    set(state => ({
      customers: mockCustomers,
      vehicles: mockVehicles
    }));
  },

  // Fetch Reservations from Firebase
  fetchReservations: async () => {
    set({ loading: true });
    try {
      console.log('Fetching reservations from Firebase...');
      
      // Add timeout for Firebase requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Firebase connection timeout')), 5000);
      });
      
      const reservations = await Promise.race([
        getReservations(),
        timeoutPromise
      ]);
      
      console.log('Fetched reservations:', reservations.length);
      
      // If Firebase returns empty results, use mock data for demo
      if (reservations.length === 0) {
        console.warn('Firebase returned empty results, using mock data for demo');
        throw new Error('Empty results, using mock data');
      }
      
      set({ reservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      console.warn('Using fallback mock data for reservations');
      
      // Enhanced mock data with more realistic data for demo
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
          pickupDate: new Date().toISOString().split('T')[0], // Today's date
          pickupTime: '14:30',
          passengerCount: 4,
          baggageCount: 3,
          vehicleType: 'premium' as const,
          distance: 45,
          basePrice: 85.00, // USD
          additionalServices: [],
          totalPrice: 95, // USD
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
          pickupDate: new Date().toISOString().split('T')[0], // Today's date
          pickupTime: '16:00',
          passengerCount: 2,
          baggageCount: 2,
          vehicleType: 'luxury' as const,
          distance: 35,
          basePrice: 110.00, // USD
          additionalServices: [],
          totalPrice: 120, // USD
          status: 'assigned' as const,
          driverId: 'DRV-001',
          qrCode: 'QR-002',
          paymentStatus: 'completed' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'RES-003',
          customerId: 'CUST-003',
          customerName: 'Mustafa Demir',
          customerEmail: 'mustafa@email.com',
          customerPhone: '+90 533 987 6543',
          transferType: 'airport-hotel' as const,
          pickupLocation: 'Antalya Havalimanı (AYT)',
          dropoffLocation: 'Side - Manavgat Resort',
          pickupDate: new Date().toISOString().split('T')[0], // Today's date
          pickupTime: '19:00',
          passengerCount: 3,
          baggageCount: 4,
          vehicleType: 'premium' as const,
          distance: 60,
          basePrice: 98.00, // USD
          additionalServices: [],
          totalPrice: 105, // USD
          status: 'completed' as const,
          driverId: 'DRV-002',
          qrCode: 'QR-003',
          paymentStatus: 'completed' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        // Add a test case with potentially problematic location data to test our safety measures
        {
          id: 'RES-004',
          customerId: 'CUST-004',
          customerName: 'Test Safety',
          customerEmail: 'test@email.com',
          customerPhone: '+90 534 000 0000',
          transferType: 'airport-hotel' as const,
          // Simulate edge cases that might come from Firebase/API
          pickupLocation: getLocationString('Antalya Havalimanı (AYT)'), // Ensure it's always a string
          dropoffLocation: getLocationString('Test Hotel'), // Ensure it's always a string
          pickupDate: new Date().toISOString().split('T')[0],
          pickupTime: '10:00',
          passengerCount: 2,
          baggageCount: 1,
          vehicleType: 'standard' as const,
          distance: 25,
          basePrice: 55.00, // USD
          additionalServices: [],
          totalPrice: 60, // USD
          status: 'pending' as const,
          qrCode: 'QR-004',
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
          : getLocationString(reservationData.destination),
        dropoffLocation: reservationData.transferType === 'airport-hotel' 
          ? getLocationString(reservationData.destination)
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
      
      // Add timeout for Firebase requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Firebase connection timeout')), 5000);
      });
      
      const availableDrivers = await Promise.race([
        getAvailableDrivers(),
        timeoutPromise
      ]);
      
      console.log('Fetched drivers:', availableDrivers.length);
      
      // If Firebase returns empty results, use mock data for demo
      if (availableDrivers.length === 0) {
        console.warn('Firebase returned empty driver results, using mock data for demo');
        throw new Error('Empty results, using mock data');
      }
      
      set({ drivers: availableDrivers });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      console.warn('Using fallback mock data for drivers');
      
      // Enhanced mock data for drivers with USD earnings
      const mockDrivers = [
        {
          id: 'DRV-001',
          firstName: 'Mehmet',
          lastName: 'Demir',
          email: 'mehmet@sbstravel.com',
          phone: '+90 532 111 2233',
          licenseNumber: 'ABC123',
          vehicleType: 'premium' as const,
          status: 'busy' as const,
          currentLocation: 'Kemer - Club Med Palmiye',
          rating: 4.8,
          totalEarnings: 2340, // USD
          completedTrips: 156,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'DRV-002',
          firstName: 'Ali',
          lastName: 'Kaya',
          email: 'ali@sbstravel.com',
          phone: '+90 533 222 3344',
          licenseNumber: 'DEF456',
          vehicleType: 'luxury' as const,
          status: 'available' as const,
          currentLocation: 'Antalya Merkez',
          rating: 4.9,
          totalEarnings: 3120, // USD
          completedTrips: 203,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'DRV-003',
          firstName: 'Osman',
          lastName: 'Çelik',
          email: 'osman@sbstravel.com',
          phone: '+90 534 333 4455',
          licenseNumber: 'GHI789',
          vehicleType: 'standard' as const,
          status: 'available' as const,
          currentLocation: 'Belek',
          rating: 4.7,
          totalEarnings: 1890, // USD
          completedTrips: 124,
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'DRV-004',
          firstName: 'Fatih',
          lastName: 'Özkan',
          email: 'fatih@sbstravel.com',
          phone: '+90 535 444 5566',
          licenseNumber: 'JKL012',
          vehicleType: 'premium' as const,
          status: 'offline' as const,
          currentLocation: 'Side',
          rating: 4.6,
          totalEarnings: 1560, // USD
          completedTrips: 98,
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
      console.log('Fetching customers...');
      const state = get();
      
      // If no customers exist, initialize mock data
      if (state.customers.length === 0) {
        console.warn('No customers found, initializing mock data');
        get().initializeMockData();
      }
      
      set({ customers: state.customers });
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Initialize mock data as fallback
      get().initializeMockData();
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
  fetchVehicles: async () => {
    try {
      console.log('Fetching vehicles...');
      const state = get();
      
      // If no vehicles exist, initialize mock data
      if (state.vehicles.length === 0) {
        console.warn('No vehicles found, initializing mock data');
        get().initializeMockData();
      }
      
      set({ vehicles: state.vehicles });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Initialize mock data as fallback
      get().initializeMockData();
    }
  },

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

  // Demo data management
  saveDemoDataToFirebase: async () => {
    try {
      set({ loading: true });
      console.log('Saving demo data to Firebase...');
      
      const state = get();
      let savedCount = 0;
      
      // Save reservations
      for (const reservation of state.reservations) {
        try {
          const { id, createdAt, updatedAt, ...reservationData } = reservation;
          await createReservation(reservationData);
          savedCount++;
        } catch (error) {
          console.error('Error saving reservation:', reservation.id, error);
        }
      }
      
      // Save drivers
      for (const driver of state.drivers) {
        try {
          const { id, createdAt, ...driverData } = driver;
          await createDriver(driverData);
          savedCount++;
        } catch (error) {
          console.error('Error saving driver:', driver.id, error);
        }
      }
      
      // Save customers
      for (const customer of state.customers) {
        try {
          const { id, createdAt, updatedAt, ...customerData } = customer;
          await createCustomer(customerData);
          savedCount++;
        } catch (error) {
          console.error('Error saving customer:', customer.id, error);
        }
      }
      
      // Note: Vehicles would also be saved here if we had a createVehicle function
      
      toast.success(`${savedCount} demo veri Firebase'e başarıyla kaydedildi!`);
      console.log(`Successfully saved ${savedCount} demo records to Firebase`);
      
    } catch (error) {
      console.error('Error saving demo data to Firebase:', error);
      toast.error('Demo veriler kaydedilirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  clearAllDemoData: async () => {
    try {
      set({ 
        reservations: [],
        drivers: [],
        customers: [],
        vehicles: [],
        commissions: []
      });
      toast.success('Tüm demo veriler temizlendi!');
    } catch (error) {
      console.error('Error clearing demo data:', error);
      toast.error('Demo veriler temizlenirken hata oluştu');
    }
  },

  // Subscribe to Real-time Updates
  subscribeToRealtimeUpdates: () => {
    console.log('Subscribing to real-time updates...');
    
    let unsubscribeReservations: (() => void) | null = null;
    let unsubscribeDrivers: (() => void) | null = null;
    
    try {
      unsubscribeReservations = subscribeToReservations((reservations) => {
        console.log('Real-time reservations update:', reservations.length);
        set({ reservations });
      });

      unsubscribeDrivers = subscribeToDrivers((drivers) => {
        console.log('Real-time drivers update:', drivers.length);
        set({ drivers });
      });
    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error);
      console.warn('Real-time updates not available, using manual refresh');
    }

    // Return cleanup function
    return () => {
      try {
        if (unsubscribeReservations) unsubscribeReservations();
        if (unsubscribeDrivers) unsubscribeDrivers();
      } catch (error) {
        console.error('Error cleaning up subscriptions:', error);
      }
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