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
  createDriver,
  getAllDrivers,
  deleteDriver,
  // Vehicle operations
  createVehicle,
  updateVehicle,
  getVehicles,
  deleteVehicle,
  subscribeToVehicles,
  // Customer operations
  getAllCustomers,
  updateCustomer,
  deleteCustomer
} from '../lib/firebase/collections';
import { FirebaseErrorHandler, withFirebaseErrorHandling, withTimeout } from '../lib/firebase/error-handling';
import { FirebasePersistence } from '../lib/services/persistence-service';
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
    
    // Mock drivers data with enhanced information
    const mockDrivers = [
      {
        id: 'DRV-001',
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet@sbstravel.com',
        phone: '+90 532 111 2233',
        licenseNumber: 'ABC123',
        vehicleType: 'premium' as const,
        status: 'available' as const,
        currentLocation: 'Antalya Merkez',
        rating: 4.8,
        totalEarnings: 2340, // USD
        completedTrips: 156,
        isActive: true,
        isProblemDriver: false,
        vehicleTypes: ['standard', 'premium'],
        experienceYears: 8,
        joinDate: new Date('2023-06-15'),
        financials: {
          totalEarnings: 25600,
          currentBalance: 1200,
          receivables: 800,
          payables: 200,
          lastPayment: new Date('2024-01-05'),
          pendingPayments: 3,
          monthlyEarnings: {
            '2024-01': 2340,
            '2023-12': 2100,
            '2023-11': 1950
          }
        },
        createdAt: new Date('2023-01-15')
      },
      {
        id: 'DRV-002',
        firstName: 'Ali',
        lastName: 'Kaya',
        email: 'ali@sbstravel.com',
        phone: '+90 533 222 3344',
        licenseNumber: 'DEF456',
        vehicleType: 'luxury' as const,
        status: 'busy' as const,
        currentLocation: 'Kemer',
        rating: 4.9,
        totalEarnings: 3120, // USD
        completedTrips: 203,
        isActive: true,
        isProblemDriver: false,
        vehicleTypes: ['luxury', 'VIP'],
        experienceYears: 12,
        joinDate: new Date('2023-03-20'),
        financials: {
          totalEarnings: 38400,
          currentBalance: 2100,
          receivables: 1200,
          payables: 0,
          lastPayment: new Date('2024-01-08'),
          pendingPayments: 1,
          monthlyEarnings: {
            '2024-01': 3120,
            '2023-12': 2800,
            '2023-11': 2900
          }
        },
        createdAt: new Date('2023-01-01')
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
        completedTrips: 89,
        isActive: true,
        isProblemDriver: true,
        problemNotes: 'Müşteri şikayeti - geç gelme problemi',
        vehicleTypes: ['standard'],
        experienceYears: 5,
        joinDate: new Date('2023-09-10'),
        financials: {
          totalEarnings: 15200,
          currentBalance: -300,
          receivables: 500,
          payables: 800,
          lastPayment: new Date('2023-12-28'),
          pendingPayments: 2,
          monthlyEarnings: {
            '2024-01': 1890,
            '2023-12': 1650,
            '2023-11': 1400
          }
        },
        createdAt: new Date('2023-06-01')
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
        totalEarnings: 2560, // USD
        completedTrips: 134,
        isActive: true,
        isProblemDriver: false,
        vehicleTypes: ['premium', 'minibus'],
        experienceYears: 7,
        joinDate: new Date('2023-07-05'),
        financials: {
          totalEarnings: 22800,
          currentBalance: 950,
          receivables: 600,
          payables: 150,
          lastPayment: new Date('2024-01-03'),
          pendingPayments: 2,
          monthlyEarnings: {
            '2024-01': 2560,
            '2023-12': 2200,
            '2023-11': 2000
          }
        },
        createdAt: new Date('2023-02-15')
      }
    ];
    
    // Mock customers data
    const mockCustomers = [
      {
        id: 'CUST-001',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@email.com',
        phone: '+90 532 123 4567',
        totalReservations: 3,
        totalSpent: 310.00,
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
        totalSpent: 120.00,
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
        totalSpent: 165.00,
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
    
    // Enhanced mock reservations
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
        totalPrice: 95.00, // USD
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
        totalPrice: 120.00, // USD
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
        totalPrice: 105.00, // USD
        status: 'completed' as const,
        driverId: 'DRV-002',
        qrCode: 'QR-003',
        paymentStatus: 'completed' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'RES-004',
        customerId: 'CUST-001',
        customerName: 'Ahmet Yılmaz',
        customerEmail: 'ahmet@email.com',
        customerPhone: '+90 532 123 4567',
        transferType: 'hotel-airport' as const,
        pickupLocation: 'Kemer - Club Med Palmiye',
        dropoffLocation: 'Antalya Havalimanı (AYT)',
        pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        pickupTime: '10:00',
        passengerCount: 4,
        baggageCount: 3,
        vehicleType: 'premium' as const,
        distance: 45,
        basePrice: 85.00, // USD
        additionalServices: [],
        totalPrice: 95.00, // USD
        status: 'confirmed' as const,
        driverId: 'DRV-003',
        qrCode: 'QR-004',
        paymentStatus: 'completed' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'RES-005',
        customerId: 'CUST-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@email.com',
        customerPhone: '+1 555 123 4567',
        transferType: 'airport-hotel' as const,
        pickupLocation: 'Antalya Havalimanı (AYT)',
        dropoffLocation: 'Belek - Regnum Carya',
        pickupDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        pickupTime: '15:30',
        passengerCount: 2,
        baggageCount: 2,
        vehicleType: 'luxury' as const,
        distance: 35,
        basePrice: 110.00, // USD
        additionalServices: [],
        totalPrice: 120.00, // USD
        status: 'pending' as const,
        qrCode: 'QR-005',
        paymentStatus: 'completed' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    set(state => ({
      drivers: mockDrivers,
      customers: mockCustomers,
      vehicles: mockVehicles,
      reservations: mockReservations
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
          totalReservations: 0,
          totalSpent: 0,
          lastActivity: new Date(),
          lastReservationDate: new Date(),
          status: 'active' as const,
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add customer to local state
        set(state => ({
          customers: [customer!, ...state.customers]
        }));
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
    set({ loading: true });
    
    try {
      console.log('Fetching drivers from Firebase...');
      
      const drivers = await withFirebaseErrorHandling(
        () => withTimeout(getAllDrivers(false), 10000, 'Driver fetch timed out'),
        { maxRetries: 2, baseDelay: 1000 },
        'Driver fetch'
      );
      
      console.log('Successfully fetched drivers from Firebase:', drivers?.length || 0);
      
      // Ensure drivers is always an array
      const validDrivers = Array.isArray(drivers) ? drivers : [];
      
      // Save to cache for offline use
      FirebasePersistence.saveDrivers(validDrivers);
      FirebasePersistence.updateLastSync();
      
      set({ drivers: validDrivers });
      
    } catch (error) {
      console.error('Error fetching drivers from Firebase:', error);
      
      // Try to load from cache
      const cachedDrivers = FirebasePersistence.getDrivers();
      const validCachedDrivers = Array.isArray(cachedDrivers) ? cachedDrivers : [];
      if (validCachedDrivers.length > 0) {
        console.log('Using cached drivers:', validCachedDrivers.length);
        set({ drivers: validCachedDrivers });
        toast.error('Firebase bağlantısı başarısız, önbellek veriler kullanılıyor');
      } else {
        console.warn('No cached drivers available, using mock data');
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
        toast.error('Şoför verileri yüklenemedi. Örnek veriler gösteriliyor.');
      }
    } finally {
      set({ loading: false });
    }
  },

  // Add Driver
  addDriver: async (driverData) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Şoför ekleniyor...');
    
    try {
      console.log('Adding driver to Firebase...', driverData);
      
      const driverId = await withFirebaseErrorHandling(
        () => withTimeout(createDriver(driverData), 15000, 'Driver creation timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Driver creation'
      );
      
      const newDriver = { 
        id: driverId, 
        ...driverData, 
        createdAt: new Date()
      };
      
      // Update local state
      set(state => ({
        drivers: [newDriver, ...state.drivers]
      }));
      
      // Update cache
      const currentDrivers = get().drivers;
      FirebasePersistence.saveDrivers(currentDrivers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Şoför başarıyla eklendi!', 'success');
      return driverId;
      
    } catch (error) {
      console.error('Error adding driver:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        const tempId = `temp-${Date.now()}`;
        const newDriver = { 
          id: tempId, 
          ...driverData, 
          createdAt: new Date()
        };
        
        set(state => ({
          drivers: [newDriver, ...state.drivers]
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'create',
          entity: 'driver',
          data: driverData,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Şoför çevrimdışı olarak eklendi, bağlantı kurulduğunda senkronize edilecek', 'success');
        return tempId;
      }
      
      FirebaseErrorHandler.updateToast(toastId, 'Şoför eklenirken hata oluştu', 'error');
      return null;
    }
  },

  // Edit Driver
  editDriver: async (id, updates) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Şoför güncelleniyor...');
    
    try {
      console.log('Updating driver in Firebase...', id, updates);
      
      await withFirebaseErrorHandling(
        () => withTimeout(updateDriver(id, updates), 15000, 'Driver update timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Driver update'
      );
      
      // Update local state
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, ...updates } : driver
        )
      }));
      
      // Update cache
      const currentDrivers = get().drivers;
      FirebasePersistence.saveDrivers(currentDrivers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Şoför başarıyla güncellendi!', 'success');
      
    } catch (error) {
      console.error('Error editing driver:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          drivers: state.drivers.map(driver =>
            driver.id === id ? { ...driver, ...updates } : driver
          )
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'update',
          entity: 'driver',
          data: updates,
          id,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Şoför çevrimdışı olarak güncellendi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Şoför güncellenirken hata oluştu', 'error');
      }
    }
  },

  // Delete Driver
  deleteDriver: async (id) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Şoför siliniyor...');
    
    try {
      console.log('Deleting driver from Firebase...', id);
      
      await withFirebaseErrorHandling(
        () => withTimeout(deleteDriver(id), 15000, 'Driver deletion timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Driver deletion'
      );
      
      // Update local state
      set(state => ({
        drivers: state.drivers.filter(driver => driver.id !== id)
      }));
      
      // Update cache
      const currentDrivers = get().drivers;
      FirebasePersistence.saveDrivers(currentDrivers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Şoför başarıyla silindi!', 'success');
      
    } catch (error) {
      console.error('Error deleting driver:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          drivers: state.drivers.filter(driver => driver.id !== id)
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'delete',
          entity: 'driver',
          id,
          data: null,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Şoför çevrimdışı olarak silindi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Şoför silinirken hata oluştu', 'error');
      }
    }
  },

  // Set Current Driver
  setCurrentDriver: (driver) => {
    set({ currentDriver: driver });
    localStorage.setItem('currentDriver', JSON.stringify(driver));
  },

  // Update Driver Status
  updateDriverStatus: async (id, status) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Şoför durumu güncelleniyor...');
    
    try {
      await withFirebaseErrorHandling(
        () => withTimeout(updateDriver(id, { status }), 10000, 'Driver status update timed out'),
        { maxRetries: 1, baseDelay: 1000 },
        'Driver status update'
      );
      
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, status } : driver
        )
      }));
      
      FirebaseErrorHandler.updateToast(toastId, 'Şoför durumu güncellendi!', 'success');
    } catch (error) {
      console.error('Error updating driver status:', error);
      FirebaseErrorHandler.updateToast(toastId, 'Şoför durumu güncellenirken hata oluştu', 'error');
    }
  },

  // Fetch Customers
  fetchCustomers: async () => {
    set({ loading: true });
    
    try {
      console.log('Fetching customers from Firebase...');
      
      const customers = await withFirebaseErrorHandling(
        () => withTimeout(getAllCustomers(), 10000, 'Customer fetch timed out'),
        { maxRetries: 2, baseDelay: 1000 },
        'Customer fetch'
      );
      
      console.log('Successfully fetched customers from Firebase:', customers.length);
      
      // Save to cache for offline use
      FirebasePersistence.saveCustomers(customers);
      FirebasePersistence.updateLastSync();
      
      set({ customers });
      
    } catch (error) {
      console.error('Error fetching customers from Firebase:', error);
      
      // Try to load from cache
      const cachedCustomers = FirebasePersistence.getCustomers();
      if (cachedCustomers.length > 0) {
        console.log('Using cached customers:', cachedCustomers.length);
        set({ customers: cachedCustomers });
        toast.error('Firebase bağlantısı başarısız, önbellek veriler kullanılıyor');
      } else {
        console.warn('No cached customers available, initializing mock data');
        const state = get();
        
        // If no customers exist, initialize mock data
        if (state.customers.length === 0) {
          get().initializeMockData();
        }
        
        set({ customers: state.customers });
        toast.error('Müşteri verileri yüklenemedi. Örnek veriler gösteriliyor.');
      }
    } finally {
      set({ loading: false });
    }
  },

  // Add Customer
  addCustomer: async (customerData) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Müşteri ekleniyor...');
    
    try {
      console.log('Adding customer to Firebase...', customerData);
      
      const customerId = await withFirebaseErrorHandling(
        () => withTimeout(createCustomer(customerData), 15000, 'Customer creation timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Customer creation'
      );
      
      const newCustomer = { 
        id: customerId, 
        ...customerData, 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        customers: [newCustomer, ...state.customers]
      }));
      
      // Update cache
      const currentCustomers = get().customers;
      FirebasePersistence.saveCustomers(currentCustomers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Müşteri başarıyla eklendi!', 'success');
      return customerId;
      
    } catch (error) {
      console.error('Error adding customer:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        const tempId = `temp-${Date.now()}`;
        const newCustomer = { 
          id: tempId, 
          ...customerData, 
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          customers: [newCustomer, ...state.customers]
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'create',
          entity: 'customer',
          data: customerData,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Müşteri çevrimdışı olarak eklendi, bağlantı kurulduğunda senkronize edilecek', 'success');
        return tempId;
      }
      
      FirebaseErrorHandler.updateToast(toastId, 'Müşteri eklenirken hata oluştu', 'error');
      return null;
    }
  },

  // Edit Customer
  editCustomer: async (id, updates) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Müşteri güncelleniyor...');
    
    try {
      console.log('Updating customer in Firebase...', id, updates);
      
      await withFirebaseErrorHandling(
        () => withTimeout(updateCustomer(id, updates), 15000, 'Customer update timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Customer update'
      );
      
      // Update local state
      set(state => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates, updatedAt: new Date() } : customer
        )
      }));
      
      // Update cache
      const currentCustomers = get().customers;
      FirebasePersistence.saveCustomers(currentCustomers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Müşteri başarıyla güncellendi!', 'success');
      
    } catch (error) {
      console.error('Error editing customer:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          customers: state.customers.map(customer =>
            customer.id === id ? { ...customer, ...updates, updatedAt: new Date() } : customer
          )
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'update',
          entity: 'customer',
          data: updates,
          id,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Müşteri çevrimdışı olarak güncellendi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Müşteri güncellenirken hata oluştu', 'error');
      }
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Müşteri siliniyor...');
    
    try {
      console.log('Deleting customer from Firebase...', id);
      
      await withFirebaseErrorHandling(
        () => withTimeout(deleteCustomer(id), 15000, 'Customer deletion timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Customer deletion'
      );
      
      // Update local state
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id)
      }));
      
      // Update cache
      const currentCustomers = get().customers;
      FirebasePersistence.saveCustomers(currentCustomers);
      
      FirebaseErrorHandler.updateToast(toastId, 'Müşteri başarıyla silindi!', 'success');
      
    } catch (error) {
      console.error('Error deleting customer:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          customers: state.customers.filter(customer => customer.id !== id)
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'delete',
          entity: 'customer',
          id,
          data: null,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Müşteri çevrimdışı olarak silindi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Müşteri silinirken hata oluştu', 'error');
      }
    }
  },

  // Vehicle management
  fetchVehicles: async () => {
    const state = get();
    set({ loading: true });
    
    try {
      console.log('Fetching vehicles from Firebase...');
      
      // Simplify the fetch to avoid nested function calls
      const vehicles = await getVehicles();
      
      console.log('Successfully fetched vehicles from Firebase:', vehicles.length);
      
      // Save to cache for offline use
      FirebasePersistence.saveVehicles(vehicles);
      FirebasePersistence.updateLastSync();
      
      set({ vehicles });
      
    } catch (error) {
      console.error('Error fetching vehicles from Firebase:', error);
      
      // Try to load from cache
      const cachedVehicles = FirebasePersistence.getVehicles();
      if (cachedVehicles.length > 0) {
        console.log('Using cached vehicles:', cachedVehicles.length);
        set({ vehicles: cachedVehicles });
        toast.error('Firebase bağlantısı başarısız, önbellek veriler kullanılıyor');
      } else {
        console.warn('No cached vehicles available, using mock data');
        // Initialize mock data only if no cache exists
        if (state.vehicles.length === 0) {
          get().initializeMockData();
        }
        toast.error('Araç verileri yüklenemedi. Örnek veriler gösteriliyor.');
      }
    } finally {
      set({ loading: false });
    }
  },

  addVehicle: async (vehicleData) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Araç ekleniyor...');
    
    try {
      console.log('Adding vehicle to Firebase...', vehicleData);
      
      const vehicleId = await withFirebaseErrorHandling(
        () => withTimeout(createVehicle(vehicleData), 15000, 'Vehicle creation timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Vehicle creation'
      );
      
      const newVehicle = { 
        id: vehicleId, 
        ...vehicleData, 
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        vehicles: [newVehicle, ...state.vehicles]
      }));
      
      // Update cache
      const currentVehicles = get().vehicles;
      FirebasePersistence.saveVehicles(currentVehicles);
      
      FirebaseErrorHandler.updateToast(toastId, 'Araç başarıyla eklendi!', 'success');
      return vehicleId;
      
    } catch (error) {
      console.error('Error adding vehicle:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        const tempId = `temp-${Date.now()}`;
        const newVehicle = { 
          id: tempId, 
          ...vehicleData, 
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          vehicles: [newVehicle, ...state.vehicles]
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'create',
          entity: 'vehicle',
          data: vehicleData,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Araç çevrimdışı olarak eklendi, bağlantı kurulduğunda senkronize edilecek', 'success');
        return tempId;
      }
      
      FirebaseErrorHandler.updateToast(toastId, 'Araç eklenirken hata oluştu', 'error');
      return null;
    }
  },

  editVehicle: async (id, updates) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Araç güncelleniyor...');
    
    try {
      console.log('Updating vehicle in Firebase...', id, updates);
      
      await withFirebaseErrorHandling(
        () => withTimeout(updateVehicle(id, updates), 15000, 'Vehicle update timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Vehicle update'
      );
      
      // Update local state
      set(state => ({
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === id ? { ...vehicle, ...updates, updatedAt: new Date() } : vehicle
        )
      }));
      
      // Update cache
      const currentVehicles = get().vehicles;
      FirebasePersistence.saveVehicles(currentVehicles);
      
      FirebaseErrorHandler.updateToast(toastId, 'Araç başarıyla güncellendi!', 'success');
      
    } catch (error) {
      console.error('Error editing vehicle:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          vehicles: state.vehicles.map(vehicle =>
            vehicle.id === id ? { ...vehicle, ...updates, updatedAt: new Date() } : vehicle
          )
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'update',
          entity: 'vehicle',
          data: updates,
          id,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Araç çevrimdışı olarak güncellendi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Araç güncellenirken hata oluştu', 'error');
      }
    }
  },

  deleteVehicle: async (id) => {
    const toastId = FirebaseErrorHandler.createLoadingToast('Araç siliniyor...');
    
    try {
      console.log('Deleting vehicle from Firebase...', id);
      
      await withFirebaseErrorHandling(
        () => withTimeout(deleteVehicle(id), 15000, 'Vehicle deletion timed out'),
        { maxRetries: 2, baseDelay: 1500 },
        'Vehicle deletion'
      );
      
      // Update local state
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
      }));
      
      // Update cache
      const currentVehicles = get().vehicles;
      FirebasePersistence.saveVehicles(currentVehicles);
      
      FirebaseErrorHandler.updateToast(toastId, 'Araç başarıyla silindi!', 'success');
      
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      
      // Add to offline changes if this is a connectivity issue
      if (error.message?.includes('timeout') || error.message?.includes('network')) {
        // Update local state optimistically
        set(state => ({
          vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
        }));
        
        FirebasePersistence.addOfflineChange({
          type: 'delete',
          entity: 'vehicle',
          id,
          data: null,
          timestamp: new Date()
        });
        
        FirebaseErrorHandler.updateToast(toastId, 'Araç çevrimdışı olarak silindi, bağlantı kurulduğunda senkronize edilecek', 'success');
      } else {
        FirebaseErrorHandler.updateToast(toastId, 'Araç silinirken hata oluştu', 'error');
      }
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
    let unsubscribeVehicles: (() => void) | null = null;
    
    try {
      unsubscribeReservations = subscribeToReservations((reservations) => {
        console.log('Real-time reservations update:', reservations.length);
        set({ reservations });
        // Don't save reservations to cache in real-time to avoid conflicts
      });

      unsubscribeDrivers = subscribeToDrivers((drivers) => {
        console.log('Real-time drivers update:', drivers.length);
        set({ drivers });
        FirebasePersistence.saveDrivers(drivers);
      });

      unsubscribeVehicles = subscribeToVehicles((vehicles) => {
        console.log('Real-time vehicles update:', vehicles.length);
        set({ vehicles });
        FirebasePersistence.saveVehicles(vehicles);
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
        if (unsubscribeVehicles) unsubscribeVehicles();
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