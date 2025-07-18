import { create } from 'zustand';
import { 
  Reservation, 
  Driver, 
  Customer,
  Vehicle,
  BookingFormData,
  ExtraService,
  Location,
  BankAccount
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
  getFirestore,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateQRCode } from '../utils/qrCode';
import toast from 'react-hot-toast';

// Use localStorage to track initialization
const isInitialized = () => localStorage.getItem('sbs_initialized') === 'true';
const setInitialized = () => localStorage.setItem('sbs_initialized', 'true');

// Collection references
const reservationsRef = collection(db, 'reservations');
const driversRef = collection(db, 'drivers');
const customersRef = collection(db, 'customers');
const vehiclesRef = collection(db, 'vehicles');
const extraServicesRef = collection(db, 'extraServices');
const locationsRef = collection(db, 'locations');
const commissionsRef = collection(db, 'commissions');
const bankAccountsRef = collection(db, 'bankAccounts');

interface StoreState {
  // Data
  reservations: Reservation[];
  drivers: Driver[];
  customers: Customer[];
  vehicles: Vehicle[];
  extraServices: ExtraService[];
  locations: Location[];
  bankAccounts: BankAccount[];
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
  fetchActiveVehicles: () => Promise<void>;
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

  // Bank Accounts
  fetchBankAccounts: () => Promise<void>;
  addBankAccount: (account: Partial<BankAccount>) => Promise<string | null>;
  editBankAccount: (id: string, updates: Partial<BankAccount>) => Promise<void>;
  deleteBankAccount: (id: string) => Promise<void>;
  setPrimaryBankAccount: (id: string) => Promise<void>;

  // Commissions
  fetchCommissions: () => Promise<void>;
  calculateCommission: (reservationId: string, amount: number) => Promise<void>;
  getDriverFinancials: (driverId: string) => Promise<DriverFinancials>;
  markCommissionAsPaid: (commissionId: string) => Promise<void>;
  
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
  settings: SystemSettings | null;
  fetchSettings: () => Promise<void>;
}

interface DriverFinancials {
  totalEarnings: number;
  pendingPayments: number;
  completedTrips: number;
  averageRating: number;
}

interface SystemSettings {
  pricing: {
    standard: number;
    premium: number;
    luxury: number;
    commissionRate: number;
  };
  company: {
    name: string;
    phone: string;
    email: string;
    address: string;
    bankName?: string;
    iban?: string;
  };
  payment?: {
    paytr?: {
      enabled: boolean;
    };
  };
}

export const useStore = create<StoreState>((set, get) => ({
  reservations: [],
  drivers: [],
  customers: [],
  vehicles: [],
  extraServices: [],
  locations: [],
  bankAccounts: [],
  currentDriver: null,
  loading: false,
  settings: null,

  // Reservations
  fetchReservations: async () => {
    set({ loading: true });
    try {
      const reservationsSnapshot = await getDocs(reservationsRef);
      const reservations = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      set({ reservations, loading: false });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      set({ loading: false });
    }
  },

  createNewReservation: async (data) => {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(reservationsRef, {
        ...data,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      });
      toast.success('Rezervasyon başarıyla oluşturuldu');
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Rezervasyon oluşturulurken hata oluştu');
      return null;
    }
  },

  updateReservationStatus: async (id, status, driverId) => {
    try {
      const docRef = doc(reservationsRef, id);
      await updateDoc(docRef, {
        status,
        driverId,
        updatedAt: Timestamp.now()
      });
      toast.success('Rezervasyon durumu güncellendi');
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Rezervasyon güncellenirken hata oluştu');
    }
  },

  deleteReservation: async (id) => {
    try {
      const docRef = doc(reservationsRef, id);
      await deleteDoc(docRef);
      // Update local state to remove the reservation
      set((state) => ({
        reservations: state.reservations.filter(reservation => reservation.id !== id)
      }));
      toast.success('Rezervasyon silindi');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Rezervasyon silinirken hata oluştu');
    }
  },

  // Drivers
  fetchDrivers: async () => {
    set({ loading: true });
    try {
      const driversSnapshot = await getDocs(driversRef);
      const drivers = driversSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Driver[];
      set({ drivers, loading: false });
    } catch (error) {
      console.error('Error fetching drivers:', error);
      set({ loading: false });
    }
  },

  addDriver: async (driver) => {
    try {
      const docRef = await addDoc(driversRef, {
        ...driver,
        createdAt: Timestamp.now()
      });
      toast.success('Şoför başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding driver:', error);
      toast.error('Şoför eklenirken hata oluştu');
      return null;
    }
  },

  editDriver: async (id, updates) => {
    try {
      const docRef = doc(driversRef, id);
      await updateDoc(docRef, updates);
      toast.success('Şoför bilgileri güncellendi');
    } catch (error) {
      console.error('Error updating driver:', error);
      toast.error('Şoför güncellenirken hata oluştu');
    }
  },

  deleteDriver: async (id) => {
    try {
      const docRef = doc(driversRef, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
      toast.success('Şoför silindi');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Şoför silinirken hata oluştu');
    }
  },

  setCurrentDriver: (driver) => {
    set({ currentDriver: driver });
  },

  // Customers
  fetchCustomers: async () => {
    set({ loading: true });
    try {
      const customersSnapshot = await getDocs(customersRef);
      const customers = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[];
      set({ customers, loading: false });
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ loading: false });
    }
  },

  addCustomer: async (customer) => {
    try {
      // Check if customer already exists by email
      if (customer.email) {
        const { customers } = get();
        const existingCustomer = customers.find(c => c.email === customer.email);
        
        if (existingCustomer) {
          console.log('Customer already exists:', existingCustomer.id);
          toast.success('Müşteri bilgileri kullanıldı');
          return existingCustomer.id!;
        }
      }

      const docRef = await addDoc(customersRef, {
        ...customer,
        createdAt: Timestamp.now()
      });
      
      // Update local state immediately to prevent duplicate creation
      const newCustomer = {
        id: docRef.id,
        ...customer,
        createdAt: Timestamp.now()
      };
      set(state => ({
        customers: [...state.customers, newCustomer]
      }));
      
      toast.success('Müşteri başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Müşteri eklenirken hata oluştu');
      return null;
    }
  },

  editCustomer: async (id, updates) => {
    try {
      const docRef = doc(customersRef, id);
      await updateDoc(docRef, updates);
      toast.success('Müşteri bilgileri güncellendi');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Müşteri güncellenirken hata oluştu');
    }
  },

  deleteCustomer: async (id) => {
    try {
      const docRef = doc(customersRef, id);
      await deleteDoc(docRef);
      toast.success('Müşteri silindi');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Müşteri silinirken hata oluştu');
    }
  },

  // Vehicles
  fetchVehicles: async () => {
    set({ loading: true });
    try {
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const vehicles = vehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      // Only update vehicles if we got results, preserve existing ones if fetch fails/empty
      if (vehicles.length > 0) {
        console.log('Fetched vehicles from Firestore:', vehicles.length);
        set({ vehicles, loading: false });
      } else {
        console.log('No vehicles fetched from Firestore, keeping existing vehicles');
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      console.log('Fetch failed, keeping existing vehicles');
      set({ loading: false });
    }
  },

  fetchActiveVehicles: async () => {
    set({ loading: true });
    try {
      const vehiclesSnapshot = await getDocs(vehiclesRef);
      const allVehicles = vehiclesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vehicle[];
      
      // Filter only active vehicles for booking screen
      const activeVehicles = allVehicles.filter(vehicle => vehicle.isActive === true);
      
      // Only update vehicles if we got results from Firestore
      if (allVehicles.length > 0) {
        console.log('Fetched vehicles from Firestore:', allVehicles.length, 'Active:', activeVehicles.length);
        set({ vehicles: activeVehicles, loading: false });
      } else {
        // If no Firestore data, use existing vehicles but filter for active ones
        const currentState = get();
        const existingActiveVehicles = currentState.vehicles.filter(vehicle => vehicle.isActive === true);
        console.log('No vehicles fetched from Firestore, using existing active vehicles:', existingActiveVehicles.length);
        set({ vehicles: existingActiveVehicles, loading: false });
      }
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      // On error, use existing vehicles but filter for active ones
      const currentState = get();
      const existingActiveVehicles = currentState.vehicles.filter(vehicle => vehicle.isActive === true);
      console.log('Fetch failed, using existing active vehicles:', existingActiveVehicles.length);
      set({ vehicles: existingActiveVehicles, loading: false });
    }
  },

  addVehicle: async (vehicle) => {
    try {
      const docRef = await addDoc(vehiclesRef, {
        ...vehicle,
        isActive: vehicle.isActive !== undefined ? vehicle.isActive : true, // Default to true if not specified
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      toast.success('Araç başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Araç eklenirken hata oluştu');
      return null;
    }
  },

  editVehicle: async (id, updates) => {
    try {
      const docRef = doc(vehiclesRef, id);
      await updateDoc(docRef, {
        ...updates,
        isActive: updates.isActive !== undefined ? updates.isActive : true, // Preserve or default to true
        updatedAt: Timestamp.now()
      });
      toast.success('Araç bilgileri güncellendi');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Araç güncellenirken hata oluştu');
    }
  },

  deleteVehicle: async (id) => {
    try {
      const docRef = doc(vehiclesRef, id);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: Timestamp.now()
      });
      toast.success('Araç silindi');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Araç silinirken hata oluştu');
    }
  },

  // Extra Services
  fetchExtraServices: async () => {
    set({ loading: true });
    try {
      const servicesSnapshot = await getDocs(extraServicesRef);
      const extraServices = servicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ExtraService[];
      
      // Only update services if we got results, preserve existing ones if fetch fails/empty
      if (extraServices.length > 0) {
        console.log('Fetched extra services from Firestore:', extraServices.length);
        set({ extraServices, loading: false });
      } else {
        console.log('No extra services fetched from Firestore, keeping existing services');
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error fetching extra services:', error);
      console.log('Fetch failed, keeping existing extra services');
      set({ loading: false });
    }
  },

  addExtraService: async (service) => {
    try {
      const docRef = await addDoc(extraServicesRef, service);
      toast.success('Ek hizmet başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding extra service:', error);
      toast.error('Ek hizmet eklenirken hata oluştu');
      return null;
    }
  },

  editExtraService: async (id, updates) => {
    try {
      const docRef = doc(extraServicesRef, id);
      await updateDoc(docRef, updates);
      toast.success('Ek hizmet güncellendi');
    } catch (error) {
      console.error('Error updating extra service:', error);
      toast.error('Ek hizmet güncellenirken hata oluştu');
    }
  },

  deleteExtraService: async (id) => {
    try {
      const docRef = doc(extraServicesRef, id);
      await deleteDoc(docRef);
      toast.success('Ek hizmet silindi');
    } catch (error) {
      console.error('Error deleting extra service:', error);
      toast.error('Ek hizmet silinirken hata oluştu');
    }
  },

  // Locations
  fetchLocations: async () => {
    set({ loading: true });
    try {
      const locationsSnapshot = await getDocs(locationsRef);
      const locations = locationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Location[];
      set({ locations, loading: false });
    } catch (error) {
      console.error('Error fetching locations:', error);
      set({ loading: false });
    }
  },

  addLocation: async (location) => {
    try {
      const docRef = await addDoc(locationsRef, location);
      toast.success('Lokasyon başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding location:', error);
      toast.error('Lokasyon eklenirken hata oluştu');
      return null;
    }
  },

  editLocation: async (id, updates) => {
    try {
      const docRef = doc(locationsRef, id);
      await updateDoc(docRef, updates);
      toast.success('Lokasyon güncellendi');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Lokasyon güncellenirken hata oluştu');
    }
  },

  deleteLocation: async (id) => {
    try {
      const docRef = doc(locationsRef, id);
      await deleteDoc(docRef);
      toast.success('Lokasyon silindi');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Lokasyon silinirken hata oluştu');
    }
  },

  // Bank Accounts
  fetchBankAccounts: async () => {
    set({ loading: true });
    try {
      const bankAccountsSnapshot = await getDocs(bankAccountsRef);
      const bankAccounts = bankAccountsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BankAccount[];
      set({ bankAccounts, loading: false });
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      set({ loading: false });
    }
  },

  addBankAccount: async (account) => {
    try {
      const docRef = await addDoc(bankAccountsRef, {
        ...account,
        createdAt: Timestamp.now()
      });
      toast.success('Banka hesabı başarıyla eklendi');
      return docRef.id;
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast.error('Banka hesabı eklenirken hata oluştu');
      return null;
    }
  },

  editBankAccount: async (id, updates) => {
    try {
      const docRef = doc(bankAccountsRef, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      toast.success('Banka hesabı güncellendi');
    } catch (error) {
      console.error('Error updating bank account:', error);
      toast.error('Banka hesabı güncellenirken hata oluştu');
    }
  },

  deleteBankAccount: async (id) => {
    try {
      const docRef = doc(bankAccountsRef, id);
      await deleteDoc(docRef);
      toast.success('Banka hesabı silindi');
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast.error('Banka hesabı silinirken hata oluştu');
    }
  },

  setPrimaryBankAccount: async (id) => {
    try {
      const { bankAccounts } = get();
      
      // Set all accounts to non-primary
      const updatePromises = bankAccounts.map(account => {
        if (account.id) {
          const docRef = doc(bankAccountsRef, account.id);
          return updateDoc(docRef, { isPrimary: false });
        }
        return Promise.resolve();
      });
      
      await Promise.all(updatePromises);
      
      // Set the selected account as primary
      const docRef = doc(bankAccountsRef, id);
      await updateDoc(docRef, { 
        isPrimary: true,
        updatedAt: Timestamp.now()
      });
      
      toast.success('Birincil banka hesabı güncellendi');
    } catch (error) {
      console.error('Error setting primary bank account:', error);
      toast.error('Birincil hesap ayarlanırken hata oluştu');
    }
  },

  // Commissions
  fetchCommissions: async () => {
    // Basic implementation
    console.log('Fetching commissions...');
  },

  calculateCommission: async (reservationId, amount) => {
    try {
      const docRef = await addDoc(commissionsRef, {
        reservationId,
        amount,
        createdAt: Timestamp.now()
      });
      console.log('Commission calculated:', docRef.id);
    } catch (error) {
      console.error('Error calculating commission:', error);
    }
  },

  getDriverFinancials: async (driverId) => {
    // Basic implementation
    return {
      totalEarnings: 0,
      pendingPayments: 0,
      completedTrips: 0,
      averageRating: 0
    };
  },

  markCommissionAsPaid: async (commissionId) => {
    try {
      const docRef = doc(commissionsRef, commissionId);
      await updateDoc(docRef, {
        status: 'paid',
        paidAt: Timestamp.now()
      });
      toast.success('Komisyon ödendi olarak işaretlendi');
    } catch (error) {
      console.error('Error marking commission as paid:', error);
      toast.error('Komisyon güncellenirken hata oluştu');
    }
  },

  // Utility functions
  getStats: () => {
    const { reservations, drivers, vehicles } = get();
    const today = new Date().toDateString();
    
    return {
      todayReservations: reservations.filter(r => 
        new Date(r.createdAt?.toDate?.() || r.createdAt).toDateString() === today
      ).length,
      totalRevenue: reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
      activeDrivers: drivers.filter(d => d.isActive && d.status === 'available').length,
      vehiclesInUse: vehicles.filter(v => v.status === 'in-use').length,
      pendingReservations: reservations.filter(r => r.status === 'pending').length
    };
  },

  // Settings
  fetchSettings: async () => {
    try {
      // Initialize default settings if not present
      const defaultSettings: SystemSettings = {
        pricing: {
          standard: 3.5,
          premium: 5.0,
          luxury: 8.0,
          commissionRate: 0.25
        },
        company: {
          name: 'SBS TRAVEL Ltd. Şti.',
          phone: '+90 242 123 45 67',
          email: 'info@sbstravel.com',
          address: 'Antalya, Turkey',
          bankName: 'Türkiye İş Bankası',
          iban: 'TR12 0006 4000 0011 2345 6789 01'
        },
        payment: {
          paytr: {
            enabled: false
          }
        }
      };
      
      set({ settings: defaultSettings });
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Set default settings even if fetch fails
      const defaultSettings: SystemSettings = {
        pricing: {
          standard: 3.5,
          premium: 5.0,
          luxury: 8.0,
          commissionRate: 0.25
        },
        company: {
          name: 'SBS TRAVEL Ltd. Şti.',
          phone: '+90 242 123 45 67',
          email: 'info@sbstravel.com',
          address: 'Antalya, Turkey',
          bankName: 'Türkiye İş Bankası',
          iban: 'TR12 0006 4000 0011 2345 6789 01'
        },
        payment: {
          paytr: {
            enabled: false
          }
        }
      };
      set({ settings: defaultSettings });
    }
  },

  // Mock data initialization
  initializeMockData: () => {
    // Check if already initialized to prevent reset during form interactions
    if (isInitialized()) return;
    
    console.log('Initializing mock data for first time...');
    
    // Initialize with demo vehicles for testing the booking flow fixes
    const demoVehicles = [
      {
        id: '1',
        type: 'standard',
        name: 'Ekonomik Transfer',
        model: 'Volkswagen Caddy',
        image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
        passengerCapacity: 4,
        baggageCapacity: 4,
        pricePerKm: 3.5,
        features: ['Klima', 'Müzik Sistemi', 'Temiz Araç'],
        isActive: true,
        status: 'active'
      },
      {
        id: '2',
        type: 'premium',
        name: 'Konfor Transfer',
        model: 'Mercedes Vito',
        image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
        passengerCapacity: 8,
        baggageCapacity: 8,
        pricePerKm: 5.0,
        features: ['Premium İç Mekan', 'Wi-Fi', 'Su İkramı'],
        isActive: true,
        status: 'active'
      },
      {
        id: '3',
        type: 'luxury',
        name: 'VIP Transfer',
        model: 'Mercedes V-Class',
        image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
        passengerCapacity: 6,
        baggageCapacity: 6,
        pricePerKm: 8.0,
        features: ['Lüks Deri Döşeme', 'VIP Karşılama', 'Soğuk İçecek'],
        isActive: true,
        status: 'active'
      }
    ];

    const demoExtraServices = [
      {
        id: '1',
        name: 'Havalimanı Karşılama',
        description: 'Tabelali karşılama hizmeti',
        price: 15,
        category: 'assistance',
        isActive: true,
        applicableVehicleTypes: ['standard', 'premium', 'luxury']
      },
      {
        id: '2',
        name: 'İçecek İkramı',
        description: 'Su ve meşrubat ikramı',
        price: 10,
        category: 'comfort',
        isActive: true,
        applicableVehicleTypes: ['premium', 'luxury']
      }
    ];
    
    // Initialize with demo data
    set({
      reservations: [],
      drivers: [],
      customers: [],
      vehicles: demoVehicles,
      extraServices: demoExtraServices,
      locations: []
    });
    
    setInitialized();
  }

}));