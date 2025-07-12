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
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  Timestamp,
  getFirestore
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateQRCode } from '../utils/qrCode';
import toast from 'react-hot-toast';

// Collection references
const reservationsRef = collection(db, 'reservations');
const driversRef = collection(db, 'drivers');
const customersRef = collection(db, 'customers');
const vehiclesRef = collection(db, 'vehicles');
const extraServicesRef = collection(db, 'extraServices');
const locationsRef = collection(db, 'locations');

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
  
  // Reservations
  fetchReservations: () => Promise<void>;
  createNewReservation: (data: BookingFormData & { distance?: number; totalPrice?: number }) => Promise<string | null>;
  updateReservationStatus: (id: string, status: string, driverId?: string) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  
  // Drivers
  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Partial<Driver>) => Promise<string | null>;
  editDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  setCurrentDriver: (driver: Driver) => void;
  
  // Customers
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<string | null>;
  editCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  
  // Vehicles
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Partial<Vehicle>) => Promise<string | null>;
  editVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  
  // Extra Services
  fetchExtraServices: () => Promise<void>;
  addExtraService: (service: Partial<ExtraService>) => Promise<string | null>;
  editExtraService: (id: string, updates: Partial<ExtraService>) => Promise<void>;
  deleteExtraService: (id: string) => Promise<void>;
  
  // Locations
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
      const querySnapshot = await getDocs(reservationsRef);
      const reservations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      
      set({ reservations });
      console.log('Fetched reservations:', reservations.length);
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
      
      // Create reservation data
      const reservation = {
        customerId: 'CUST-' + Date.now(),
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Add to Firestore
      const docRef = await addDoc(reservationsRef, reservation);
      const reservationId = docRef.id;
      
      // Add to local state
      const newReservation: Reservation = { 
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
      const updates: Partial<Reservation> = { 
        status,
        updatedAt: Timestamp.now()
      };
      
      if (driverId) {
        updates.driverId = driverId;
      }

      // Update in Firestore
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, updates);
      
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
      // Delete from Firestore
      const docRef = doc(db, 'reservations', id);
      await deleteDoc(docRef);
      
      // Update local state
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
      const querySnapshot = await getDocs(driversRef);
      const drivers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Driver[];
      
      set({ drivers });
      console.log('Fetched drivers:', drivers.length);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Şoförler yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Add Driver
  addDriver: async (driverData) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(driversRef, {
        ...driverData,
        createdAt: Timestamp.now()
      });
      
      const driverId = docRef.id;
      
      // Add to local state
      const newDriver: Driver = {
        id: driverId,
        ...driverData as Driver,
        createdAt: new Date()
      };
      
      set(state => ({
        drivers: [...state.drivers, newDriver]
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
      // Update in Firestore
      const docRef = doc(db, 'drivers', id);
      await updateDoc(docRef, updates);
      
      // Update local state
      set(state => ({
        drivers: state.drivers.map(driver =>
          driver.id === id ? { ...driver, ...updates } : driver
        )
      }));
      
      toast.success('Şoför başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing driver:', error);
      toast.error('Şoför güncellenirken hata oluştu');
    }
  },

  // Delete Driver
  deleteDriver: async (id) => {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'drivers', id);
      await deleteDoc(docRef);
      
      // Update local state
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
  },

  // Fetch Customers
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(customersRef);
      const customers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      
      set({ customers });
      console.log('Fetched customers:', customers.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Müşteriler yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Add Customer
  addCustomer: async (customerData) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(customersRef, {
        ...customerData,
        createdAt: Timestamp.now()
      });
      
      const customerId = docRef.id;
      
      // Add to local state
      const newCustomer: Customer = {
        id: customerId,
        ...customerData as Customer,
        createdAt: new Date()
      };
      
      set(state => ({
        customers: [...state.customers, newCustomer]
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
      // Update in Firestore
      const docRef = doc(db, 'customers', id);
      await updateDoc(docRef, updates);
      
      // Update local state
      set(state => ({
        customers: state.customers.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      }));
      
      toast.success('Müşteri başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing customer:', error);
      toast.error('Müşteri güncellenirken hata oluştu');
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'customers', id);
      await deleteDoc(docRef);
      
      // Update local state
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
      const querySnapshot = await getDocs(vehiclesRef);
      const vehicles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      set({ vehicles });
      console.log('Fetched vehicles:', vehicles.length);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Araçlar yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Add Vehicle
  addVehicle: async (vehicleData) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(vehiclesRef, {
        ...vehicleData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const vehicleId = docRef.id;
      
      // Add to local state
      const newVehicle: Vehicle = {
        id: vehicleId,
        ...vehicleData as Vehicle,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        vehicles: [...state.vehicles, newVehicle]
      }));
      
      toast.success('Araç başarıyla eklendi!');
      return vehicleId;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Araç eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Vehicle
  editVehicle: async (id, updates) => {
    try {
      // Update in Firestore
      const docRef = doc(db, 'vehicles', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === id ? { ...vehicle, ...updates, updatedAt: new Date() } : vehicle
        )
      }));
      
      toast.success('Araç başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    }
  },

  // Delete Vehicle
  deleteVehicle: async (id) => {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'vehicles', id);
      await deleteDoc(docRef);
      
      // Update local state
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
      const querySnapshot = await getDocs(extraServicesRef);
      const extraServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExtraService[];
      
      set({ extraServices });
      console.log('Fetched extra services:', extraServices.length);
    } catch (error) {
      console.error('Error fetching extra services:', error);
      toast.error('Ek hizmetler yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Add Extra Service
  addExtraService: async (serviceData) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(extraServicesRef, {
        ...serviceData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const serviceId = docRef.id;
      
      // Add to local state
      const newService: ExtraService = {
        id: serviceId,
        ...serviceData as ExtraService,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({
        extraServices: [...state.extraServices, newService]
      }));
      
      toast.success('Ek hizmet başarıyla eklendi!');
      return serviceId;
    } catch (error) {
      console.error('Error adding extra service:', error);
      toast.error('Ek hizmet eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Extra Service
  editExtraService: async (id, updates) => {
    try {
      // Update in Firestore
      const docRef = doc(db, 'extraServices', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      // Update local state
      set(state => ({
        extraServices: state.extraServices.map(service =>
          service.id === id ? { ...service, ...updates, updatedAt: new Date() } : service
        )
      }));
      
      toast.success('Ek hizmet başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing extra service:', error);
      toast.error('Ek hizmet güncellenirken hata oluştu');
    }
  },

  // Delete Extra Service
  deleteExtraService: async (id) => {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'extraServices', id);
      await deleteDoc(docRef);
      
      // Update local state
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
      const querySnapshot = await getDocs(locationsRef);
      const locations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
      
      set({ locations });
      console.log('Fetched locations:', locations.length);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Lokasyonlar yüklenirken hata oluştu');
    } finally {
      set({ loading: false });
    }
  },

  // Add Location
  addLocation: async (locationData) => {
    try {
      // Add to Firestore
      const docRef = await addDoc(locationsRef, locationData);
      const locationId = docRef.id;
      
      // Add to local state
      const newLocation: Location = {
        id: locationId,
        ...locationData as Location
      };
      
      set(state => ({
        locations: [...state.locations, newLocation]
      }));
      
      toast.success('Lokasyon başarıyla eklendi!');
      return locationId;
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Lokasyon eklenirken hata oluştu');
      return null;
    }
  },

  // Edit Location
  editLocation: async (id, updates) => {
    try {
      // Update in Firestore
      const docRef = doc(db, 'locations', id);
      await updateDoc(docRef, updates);
      
      // Update local state
      set(state => ({
        locations: state.locations.map(location =>
          location.id === id ? { ...location, ...updates } : location
        )
      }));
      
      toast.success('Lokasyon başarıyla güncellendi!');
    } catch (error) {
      console.error('Error editing location:', error);
      toast.error('Lokasyon güncellenirken hata oluştu');
    }
  },

  // Delete Location
  deleteLocation: async (id) => {
    try {
      // Delete from Firestore
      const docRef = doc(db, 'locations', id);
      await deleteDoc(docRef);
      
      // Update local state
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
    
    // Today's date
    const today = new Date().toDateString();
    
    // Calculate stats
    const todayReservations = reservations.filter(r => 
      new Date(r.createdAt || Date.now()).toDateString() === today
    ).length;
    
    const totalRevenue = reservations.reduce((sum, r) => sum + r.totalPrice, 0);
    
    const activeDrivers = drivers.filter(d => d.status === 'available' || d.status === 'busy').length;
    
    const vehiclesInUse = drivers.filter(d => d.status === 'busy').length;
    
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
  initializeMockData: async () => {
    const { reservations, drivers, customers, vehicles, extraServices, locations } = get();
    
    // Only initialize if collections are empty
    if (reservations.length === 0) {
      try {
        // Add mock reservations to Firestore
        const mockReservations = [
          {
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
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
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
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
        ];
        
        for (const reservation of mockReservations) {
          await addDoc(reservationsRef, reservation);
        }
        
        console.log('Added mock reservations to Firestore');
      } catch (error) {
        console.error('Error initializing mock reservations:', error);
      }
    }
    
    if (drivers.length === 0) {
      try {
        // Add mock drivers to Firestore
        const mockDrivers = [
          {
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
            createdAt: Timestamp.now()
          },
          {
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
            createdAt: Timestamp.now()
          }
        ];
        
        for (const driver of mockDrivers) {
          await addDoc(driversRef, driver);
        }
        
        console.log('Added mock drivers to Firestore');
      } catch (error) {
        console.error('Error initializing mock drivers:', error);
      }
    }
    
    if (vehicles.length === 0) {
      try {
        // Add mock vehicles to Firestore
        const mockVehicles = [
          {
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
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
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
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
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
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
        ];
        
        for (const vehicle of mockVehicles) {
          await addDoc(vehiclesRef, vehicle);
        }
        
        console.log('Added mock vehicles to Firestore');
      } catch (error) {
        console.error('Error initializing mock vehicles:', error);
      }
    }
    
    if (locations.length === 0) {
      try {
        // Add mock locations to Firestore
        const mockLocations = [
          {
            name: 'Antalya Havalimanı (AYT)',
            lat: 36.8987,
            lng: 30.7854,
            distance: 0,
            region: 'Antalya'
          },
          {
            name: 'Kemer - Club Med Palmiye',
            lat: 36.6048,
            lng: 30.5606,
            distance: 45,
            region: 'Kemer'
          },
          {
            name: 'Belek - Regnum Carya',
            lat: 36.8625,
            lng: 31.0556,
            distance: 35,
            region: 'Belek'
          },
          {
            name: 'Side - Manavgat Resort',
            lat: 36.7673,
            lng: 31.3890,
            distance: 65,
            region: 'Side'
          }
        ];
        
        for (const location of mockLocations) {
          await addDoc(locationsRef, location);
        }
        
        console.log('Added mock locations to Firestore');
      } catch (error) {
        console.error('Error initializing mock locations:', error);
      }
    }
    
    if (extraServices.length === 0) {
      try {
        // Add mock extra services to Firestore
        const mockExtraServices = [
          {
            name: 'Bebek Koltuğu',
            description: 'Bebekler için güvenli koltuk',
            price: 10,
            category: 'comfort',
            isActive: true,
            applicableVehicleTypes: ['standard', 'premium', 'luxury'],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
            name: 'Yükseltici Koltuk',
            description: 'Çocuklar için yükseltici koltuk',
            price: 8,
            category: 'comfort',
            isActive: true,
            applicableVehicleTypes: ['standard', 'premium', 'luxury'],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          },
          {
            name: 'Karşılama Tabelası',
            description: 'İsminizle karşılama tabelası',
            price: 15,
            category: 'assistance',
            isActive: true,
            applicableVehicleTypes: ['premium', 'luxury'],
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          }
        ];
        
        for (const service of mockExtraServices) {
          await addDoc(extraServicesRef, service);
        }
        
        console.log('Added mock extra services to Firestore');
      } catch (error) {
        console.error('Error initializing mock extra services:', error);
      }
    }
    
    // Fetch all data after initialization
    get().fetchReservations();
    get().fetchDrivers();
    get().fetchCustomers();
    get().fetchVehicles();
    get().fetchExtraServices();
    get().fetchLocations();
  }
}));