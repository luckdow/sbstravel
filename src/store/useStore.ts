import { create } from 'zustand';
import { 
  Reservation, 
  Driver, 
  Customer,
  Vehicle,
  BookingFormData,
  ExtraService,
  Location
} from '../types';
import { persist } from 'zustand/middleware';
import { generateQRCode } from '../utils/qrCode';
import toast from 'react-hot-toast';

// Mock data for development
const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    customerId: 'CUST-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet@email.com',
    customerPhone: '+90 532 123 4567',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Kemer - Club Med Palmiye',
    pickupDate: '2024-01-15',
    pickupTime: '14:30',
    passengerCount: 4,
    baggageCount: 3,
    vehicleType: 'premium',
    distance: 45,
    basePrice: 85,
    totalPrice: 85,
    status: 'pending',
    qrCode: 'QR-001',
    paymentStatus: 'completed',
    additionalServices: [],
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'RES-002',
    customerId: 'CUST-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@email.com',
    customerPhone: '+1 555 123 4567',
    transferType: 'hotel-airport',
    pickupLocation: 'Belek - Regnum Carya',
    dropoffLocation: 'Antalya Havalimanı (AYT)',
    pickupDate: '2024-01-16',
    pickupTime: '16:00',
    passengerCount: 2,
    baggageCount: 2,
    vehicleType: 'luxury',
    distance: 35,
    basePrice: 120,
    totalPrice: 120,
    status: 'assigned',
    driverId: 'DRV-001',
    qrCode: 'QR-002',
    paymentStatus: 'completed',
    additionalServices: [],
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: 'RES-003',
    customerId: 'CUST-003',
    customerName: 'Hans Mueller',
    customerEmail: 'hans@email.com',
    customerPhone: '+49 123 456 7890',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Side - Manavgat Hotel',
    pickupDate: '2024-01-16',
    pickupTime: '18:15',
    passengerCount: 3,
    baggageCount: 3,
    vehicleType: 'standard',
    distance: 65,
    basePrice: 95,
    totalPrice: 95,
    status: 'confirmed',
    qrCode: 'QR-003',
    paymentStatus: 'completed',
    additionalServices: [],
    createdAt: new Date('2024-01-15T12:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z')
  }
];

const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@sbstravel.com',
    phone: '+90 532 123 4567',
    licenseNumber: 'TR12345678',
    vehicleType: 'premium',
    status: 'available',
    currentLocation: 'Antalya Merkez',
    rating: 4.8,
    totalEarnings: 2340,
    completedTrips: 156,
    isActive: true,
    createdAt: new Date('2023-06-15')
  },
  {
    id: 'DRV-002',
    firstName: 'Ali',
    lastName: 'Kaya',
    email: 'ali.kaya@sbstravel.com',
    phone: '+90 533 234 5678',
    licenseNumber: 'TR23456789',
    vehicleType: 'luxury',
    status: 'busy',
    currentLocation: 'Kemer',
    rating: 4.9,
    totalEarnings: 3120,
    completedTrips: 203,
    isActive: true,
    createdAt: new Date('2023-03-20')
  },
  {
    id: 'DRV-003',
    firstName: 'Osman',
    lastName: 'Çelik',
    email: 'osman.celik@sbstravel.com',
    phone: '+90 534 345 6789',
    licenseNumber: 'TR34567890',
    vehicleType: 'standard',
    status: 'available',
    currentLocation: 'Belek',
    rating: 4.7,
    totalEarnings: 1890,
    completedTrips: 89,
    isActive: true,
    createdAt: new Date('2023-09-10')
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@email.com',
    phone: '+90 532 123 4567',
    totalReservations: 3,
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'CUST-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@email.com',
    phone: '+1 555 123 4567',
    totalReservations: 1,
    createdAt: new Date('2024-01-12')
  },
  {
    id: 'CUST-003',
    firstName: 'Hans',
    lastName: 'Mueller',
    email: 'hans@email.com',
    phone: '+49 123 456 7890',
    totalReservations: 1,
    createdAt: new Date('2024-01-14')
  }
];

const mockVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    type: 'standard',
    name: 'Standart Transfer Aracı',
    model: 'Volkswagen Caddy / Ford Tourneo',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    licensePlate: '07 ABC 123',
    passengerCapacity: 4,
    baggageCapacity: 4,
    pricePerKm: 4.5,
    features: ['Klima', 'Müzik Sistemi', 'Güvenli Sürüş', 'Temiz Araç'],
    status: 'active',
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'VEH-002',
    type: 'premium',
    name: 'Premium Transfer Aracı',
    model: 'Mercedes Vito / Volkswagen Caravelle',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    licensePlate: '07 DEF 456',
    passengerCapacity: 8,
    baggageCapacity: 8,
    pricePerKm: 6.5,
    features: ['Premium İç Mekan', 'Wi-Fi', 'Su İkramı', 'Profesyonel Şoför'],
    status: 'active',
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'VEH-003',
    type: 'luxury',
    name: 'Lüks & VIP Transfer',
    model: 'Mercedes V-Class / BMW X7',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    licensePlate: '07 GHI 789',
    passengerCapacity: 6,
    baggageCapacity: 6,
    pricePerKm: 8.5,
    features: ['Lüks Deri Döşeme', 'VIP Karşılama', 'Soğuk İçecek', 'Özel Şoför'],
    status: 'active',
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  }
];

const mockExtraServices: ExtraService[] = [
  {
    id: 'SVC-001',
    name: 'Bebek Koltuğu',
    description: 'Bebekler için güvenli koltuk',
    price: 10,
    category: 'comfort',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'SVC-002',
    name: 'Yükseltici Koltuk',
    description: 'Çocuklar için yükseltici koltuk',
    price: 8,
    category: 'comfort',
    isActive: true,
    applicableVehicleTypes: ['standard', 'premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'SVC-003',
    name: 'Karşılama Tabelası',
    description: 'İsminizle karşılama tabelası',
    price: 15,
    category: 'assistance',
    isActive: true,
    applicableVehicleTypes: ['premium', 'luxury'],
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01')
  }
];

const mockLocations: Location[] = [
  {
    id: 'LOC-001',
    name: 'Antalya Havalimanı (AYT)',
    lat: 36.8987,
    lng: 30.7854,
    distance: 0,
    region: 'Antalya'
  },
  {
    id: 'LOC-002',
    name: 'Kemer - Club Med Palmiye',
    lat: 36.6048,
    lng: 30.5606,
    distance: 45,
    region: 'Kemer'
  },
  {
    id: 'LOC-003',
    name: 'Belek - Regnum Carya',
    lat: 36.8625,
    lng: 31.0556,
    distance: 35,
    region: 'Belek'
  },
  {
    id: 'LOC-004',
    name: 'Side - Manavgat Resort',
    lat: 36.7673,
    lng: 31.3890,
    distance: 65,
    region: 'Side'
  }
];

interface StoreState {
  // Data
  reservations: Reservation[];
  drivers: Driver[];
  customers: Customer[];
  vehicles: Vehicle[];
  extraServices: ExtraService[];
  locations: Location[];
  currentDriver: Driver | null;
  loading: boolean;
  
  // Actions
  fetchReservations: () => Promise<void>;
  createNewReservation: (data: BookingFormData & { distance?: number; totalPrice?: number }) => Promise<string | null>;
  updateReservationStatus: (id: string, status: string, driverId?: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  
  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Partial<Driver>) => Promise<string | null>;
  editDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  setCurrentDriver: (driver: Driver) => void;
  
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<string | null>;
  editCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<string | null>;
  editVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  fetchExtraServices: () => Promise<void>;
  addExtraService: (service: Partial<ExtraService>) => Promise<string | null>;
  editExtraService: (id: string, updates: Partial<ExtraService>) => Promise<void>;
  deleteExtraService: (id: string) => Promise<void>;
  
  fetchLocations: () => Promise<void>;
  addLocation: (location: Partial<Location>) => Promise<string | null>;
  editLocation: (id: string, updates: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  
  // Utility functions
  getStats: () => {
    todayReservations: number;
    totalRevenue: number;
    activeDrivers: number;
    vehiclesInUse: number;
    pendingReservations: number;
  };
  
  // Mock data initialization
  initializeMockData: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      reservations: [],
      drivers: [],
      customers: [],
      vehicles: [],
      extraServices: [],
      locations: [],
      currentDriver: null,
      loading: false,

      // ... all the implementation functions ...

    }),
    {
      name: 'sbs-travel-store',
      partialize: (state) => ({
        reservations: state.reservations,
        drivers: state.drivers,
        customers: state.customers,
        vehicles: state.vehicles,
        extraServices: state.extraServices,
        locations: state.locations
      }),
    }
  )
);