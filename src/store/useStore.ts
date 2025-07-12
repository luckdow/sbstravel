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

export const useStore = create<StoreState>((set, get) => ({
  reservations: [],
  drivers: [],
  customers: [],
  vehicles: [],
  extraServices: [],
  locations: [],
  currentDriver: null,
  loading: false,

  // Fetch Reservations
  fetchReservations: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ reservations: mockReservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Rezervasyonlar yüklenirken hata oluştu');
      // Fallback to mock data
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
      
      // Create reservation
      const newReservation: Reservation = {
        id: `RES-${Date.now().toString().slice(-6)}`,
        customerId: `CUST-${Date.now().toString().slice(-6)}`,
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
        additionalServices: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        reservations: [newReservation, ...state.reservations]
      }));
      
      toast.success('Rezervasyon başarıyla oluşturuldu!');
      return newReservation.id;
      
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
      }

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
      // Remove from local state
      set(state => ({
        reservations: state.reservations.filter(res => res.id !== id)
      }));
      
      toast.success('Rezervasyon başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Rezervasyon silinirken hata oluştu');
    }
  },

  // Fetch Drivers
  fetchDrivers: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ drivers: mockDrivers });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Şoförler yüklenirken hata oluştu');
      // Fallback to mock data
      set({ drivers: mockDrivers });
    } finally {
      set({ loading: false });
    }
  },

  // Add Driver
  addDriver: async (driverData) => {
    try {
      const newDriver: Driver = {
        id: `DRV-${Date.now().toString().slice(-6)}`,
        firstName: driverData.firstName || '',
        lastName: driverData.lastName || '',
        email: driverData.email || '',
        phone: driverData.phone || '',
        licenseNumber: driverData.licenseNumber || '',
        vehicleType: driverData.vehicleType || 'standard',
        status: driverData.status || 'available',
        currentLocation: driverData.currentLocation,
        rating: driverData.rating || 5.0,
        totalEarnings: driverData.totalEarnings || 0,
        completedTrips: driverData.completedTrips || 0,
        isActive: driverData.isActive !== undefined ? driverData.isActive : true,
        createdAt: new Date()
      };
      
      // Update local state
      set(state => ({
        drivers: [...state.drivers, newDriver]
      }));
      
      toast.success('Şoför başarıyla eklendi!');
      return newDriver.id;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Şoför eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Driver
  editDriver: async (id, updates) => {
    try {
      // Update local state
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, ...updates } : driver
        )
      }));
      
      toast.success('Şoför bilgileri güncellendi!');
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Şoför güncellenirken hata oluştu');
    }
  },

  // Delete Driver
  deleteDriver: async (id) => {
    try {
      // Remove from local state
      set(state => ({
        drivers: state.drivers.filter(driver => driver.id !== id)
      }));
      
      toast.success('Şoför başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Şoför silinirken hata oluştu');
    }
  },

  // Set Current Driver
  setCurrentDriver: (driver) => {
    set({ currentDriver: driver });
    localStorage.setItem('currentDriver', JSON.stringify(driver));
  },

  // Fetch Customers
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ customers: mockCustomers });
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Müşteriler yüklenirken hata oluştu');
      // Fallback to mock data
      set({ customers: mockCustomers });
    } finally {
      set({ loading: false });
    }
  },

  // Add Customer
  addCustomer: async (customerData) => {
    try {
      const newCustomer: Customer = {
        id: `CUST-${Date.now().toString().slice(-6)}`,
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        totalReservations: customerData.totalReservations || 0,
        createdAt: new Date()
      };
      
      // Update local state
      set(state => ({
        customers: [...state.customers, newCustomer]
      }));
      
      toast.success('Müşteri başarıyla eklendi!');
      return newCustomer.id;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Müşteri eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Customer
  editCustomer: async (id, updates) => {
    try {
      // Update local state
      set(state => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      }));
      
      toast.success('Müşteri bilgileri güncellendi!');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Müşteri güncellenirken hata oluştu');
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    try {
      // Remove from local state
      set(state => ({
        customers: state.customers.filter(customer => customer.id !== id)
      }));
      
      toast.success('Müşteri başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Müşteri silinirken hata oluştu');
    }
  },

  // Fetch Vehicles
  fetchVehicles: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ vehicles: mockVehicles });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Araçlar yüklenirken hata oluştu');
      // Fallback to mock data
      set({ vehicles: mockVehicles });
    } finally {
      set({ loading: false });
    }
  },

  // Add Vehicle
  addVehicle: async (vehicleData) => {
    try {
      const newVehicle: Vehicle = {
        id: `VEH-${Date.now().toString().slice(-6)}`,
        type: vehicleData.type || 'standard',
        name: vehicleData.name || '',
        model: vehicleData.model || '',
        image: vehicleData.image || '',
        licensePlate: vehicleData.licensePlate,
        passengerCapacity: vehicleData.passengerCapacity || 4,
        baggageCapacity: vehicleData.baggageCapacity || 4,
        pricePerKm: vehicleData.pricePerKm || 4.5,
        features: vehicleData.features || [],
        status: vehicleData.status || 'active',
        isActive: vehicleData.isActive !== undefined ? vehicleData.isActive : true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        vehicles: [...state.vehicles, newVehicle]
      }));
      
      toast.success('Araç başarıyla eklendi!');
      return newVehicle.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Araç eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Vehicle
  editVehicle: async (id, updates) => {
    try {
      // Update local state
      set(state => ({
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === id ? { ...vehicle, ...updates, updatedAt: new Date() } : vehicle
        )
      }));
      
      toast.success('Araç bilgileri güncellendi!');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    }
  },

  // Delete Vehicle
  deleteVehicle: async (id) => {
    try {
      // Remove from local state
      set(state => ({
        vehicles: state.vehicles.filter(vehicle => vehicle.id !== id)
      }));
      
      toast.success('Araç başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Araç silinirken hata oluştu');
    }
  },

  // Fetch Extra Services
  fetchExtraServices: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ extraServices: mockExtraServices });
    } catch (error) {
      console.error('Error fetching extra services:', error);
      toast.error('Ek hizmetler yüklenirken hata oluştu');
      // Fallback to mock data
      set({ extraServices: mockExtraServices });
    } finally {
      set({ loading: false });
    }
  },

  // Add Extra Service
  addExtraService: async (serviceData) => {
    try {
      const newService: ExtraService = {
        id: `SVC-${Date.now().toString().slice(-6)}`,
        name: serviceData.name || '',
        description: serviceData.description || '',
        price: serviceData.price || 0,
        category: serviceData.category || 'comfort',
        isActive: serviceData.isActive !== undefined ? serviceData.isActive : true,
        applicableVehicleTypes: serviceData.applicableVehicleTypes || ['standard', 'premium', 'luxury'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      set(state => ({
        extraServices: [...state.extraServices, newService]
      }));
      
      toast.success('Ek hizmet başarıyla eklendi!');
      return newService.id;
    } catch (error) {
      console.error('Error adding extra service:', error);
      toast.error('Ek hizmet eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Extra Service
  editExtraService: async (id, updates) => {
    try {
      // Update local state
      set(state => ({
        extraServices: state.extraServices.map(service =>
          service.id === id ? { ...service, ...updates, updatedAt: new Date() } : service
        )
      }));
      
      toast.success('Ek hizmet bilgileri güncellendi!');
    } catch (error) {
      console.error('Error updating extra service:', error);
      toast.error('Ek hizmet güncellenirken hata oluştu');
    }
  },

  // Delete Extra Service
  deleteExtraService: async (id) => {
    try {
      // Remove from local state
      set(state => ({
        extraServices: state.extraServices.filter(service => service.id !== id)
      }));
      
      toast.success('Ek hizmet başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting extra service:', error);
      toast.error('Ek hizmet silinirken hata oluştu');
    }
  },

  // Fetch Locations
  fetchLocations: async () => {
    set({ loading: true });
    try {
      // In a real implementation, this would fetch from Firebase
      // For now, use mock data
      set({ locations: mockLocations });
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Lokasyonlar yüklenirken hata oluştu');
      // Fallback to mock data
      set({ locations: mockLocations });
    } finally {
      set({ loading: false });
    }
  },

  // Add Location
  addLocation: async (locationData) => {
    try {
      const newLocation: Location = {
        id: `LOC-${Date.now().toString().slice(-6)}`,
        name: locationData.name || '',
        lat: locationData.lat || 0,
        lng: locationData.lng || 0,
        distance: locationData.distance || 0,
        region: locationData.region
      };
      
      // Update local state
      set(state => ({
        locations: [...state.locations, newLocation]
      }));
      
      toast.success('Lokasyon başarıyla eklendi!');
      return newLocation.id;
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Lokasyon eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Location
  editLocation: async (id, updates) => {
    try {
      // Update local state
      set(state => ({
        locations: state.locations.map(location =>
          location.id === id ? { ...location, ...updates } : location
        )
      }));
      
      toast.success('Lokasyon bilgileri güncellendi!');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Lokasyon güncellenirken hata oluştu');
    }
  },

  // Delete Location
  deleteLocation: async (id) => {
    try {
      // Remove from local state
      set(state => ({
        locations: state.locations.filter(location => location.id !== id)
      }));
      
      toast.success('Lokasyon başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Lokasyon silinirken hata oluştu');
    }
  },

  // Get Stats
  getStats: () => {
    const { reservations, drivers } = get();
    
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate stats
    const todayReservations = reservations.filter(r => {
      const reservationDate = new Date(r.createdAt || 0);
      reservationDate.setHours(0, 0, 0, 0);
      return reservationDate.getTime() === today.getTime();
    }).length;
    
    const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
    
    const activeDrivers = drivers.filter(d => d.status === 'available' || d.status === 'busy').length;
    
    const vehiclesInUse = reservations.filter(r => 
      r.status === 'assigned' || r.status === 'started'
    ).length;
    
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    
    return {
      todayReservations,
      totalRevenue,
      activeDrivers,
      vehiclesInUse,
      pendingReservations
    };
  },

  // Initialize Mock Data
  initializeMockData: () => {
    const state = get();
    
    // Only initialize if data is empty
    if (state.reservations.length === 0) {
      set({ reservations: mockReservations });
    }
    
    if (state.drivers.length === 0) {
      set({ drivers: mockDrivers });
    }
    
    if (state.customers.length === 0) {
      set({ customers: mockCustomers });
    }
    
    if (state.vehicles.length === 0) {
      set({ vehicles: mockVehicles });
    }
    
    if (state.extraServices.length === 0) {
      set({ extraServices: mockExtraServices });
    }
    
    if (state.locations.length === 0) {
      set({ locations: mockLocations });
    }
  }
}));