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
  settings: null,

  // ... rest of the implementation ...

}));