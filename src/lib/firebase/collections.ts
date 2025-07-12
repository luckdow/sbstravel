import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Reservation, Driver, Vehicle, Customer, Commission, Location } from '../../types';

// Collection References
export const reservationsRef = collection(db, 'reservations');
export const driversRef = collection(db, 'drivers');
export const vehiclesRef = collection(db, 'vehicles');
export const customersRef = collection(db, 'customers');
export const commissionsRef = collection(db, 'commissions');
export const locationsRef = collection(db, 'locations');
export const settingsRef = collection(db, 'settings');

// Reservation Operations
export const createReservation = async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const docRef = await addDoc(reservationsRef, {
    ...reservationData,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateReservation = async (id: string, updates: Partial<Reservation>) => {
  const docRef = doc(reservationsRef, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const getReservation = async (id: string) => {
  const docRef = doc(reservationsRef, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Reservation;
  }
  return null;
};

export const getReservations = async (filters?: {
  status?: string;
  driverId?: string;
  customerId?: string;
  limit?: number;
}) => {
  let q = query(reservationsRef, orderBy('createdAt', 'desc'));
  
  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  if (filters?.driverId) {
    q = query(q, where('driverId', '==', filters.driverId));
  }
  
  if (filters?.customerId) {
    q = query(q, where('customerId', '==', filters.customerId));
  }
  
  if (filters?.limit) {
    q = query(q, limit(filters.limit));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Reservation[];
};

// Driver Operations
export const createDriver = async (driverData: Omit<Driver, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(driversRef, {
    ...driverData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateDriver = async (id: string, updates: Partial<Driver>) => {
  const docRef = doc(driversRef, id);
  await updateDoc(docRef, updates);
};

export const getDriver = async (id: string) => {
  const docRef = doc(driversRef, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Driver;
  }
  return null;
};

export const getAvailableDrivers = async (vehicleType?: string) => {
  let q = query(driversRef, where('isActive', '==', true), where('status', '==', 'available'));
  
  if (vehicleType) {
    q = query(q, where('vehicleType', '==', vehicleType));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Driver[];
};

// Customer Operations
export const createCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(customersRef, {
    ...customerData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getCustomerByEmail = async (email: string) => {
  const q = query(customersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Customer;
  }
  return null;
};

// Commission Operations
export const createCommission = async (
  reservationId: string,
  driverId: string,
  totalAmount: number
) => {
  const companyShare = totalAmount * 0.25; // 25% to company
  const driverShare = totalAmount * 0.75;  // 75% to driver

  const commissionData = {
    reservationId,
    driverId,
    totalAmount,
    companyShare,
    driverShare,
    status: 'pending' as const,
    createdAt: Timestamp.now()
  };

  const docRef = await addDoc(commissionsRef, commissionData);
  return docRef.id;
};

export const getDriverCommissions = async (driverId: string, status?: 'pending' | 'paid') => {
  let q = query(commissionsRef, where('driverId', '==', driverId));
  
  if (status) {
    q = query(q, where('status', '==', status));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Commission[];
};

// Real-time subscriptions
export const subscribeToReservations = (callback: (reservations: Reservation[]) => void) => {
  const q = query(reservationsRef, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Reservation[];
    callback(reservations);
  });
};

export const subscribeToDrivers = (callback: (drivers: Driver[]) => void) => {
  const q = query(driversRef, where('isActive', '==', true));
  return onSnapshot(q, (snapshot) => {
    const drivers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Driver[];
    callback(drivers);
  });
};

// Vehicle Operations
export const createVehicle = async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const docRef = await addDoc(vehiclesRef, {
    ...vehicleData,
    createdAt: now,
    updatedAt: now
  });
  return docRef.id;
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
  const docRef = doc(vehiclesRef, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const getVehicle = async (id: string) => {
  const docRef = doc(vehiclesRef, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Vehicle;
  }
  return null;
};

export const getVehicles = async (filters?: {
  status?: string;
  type?: string;
  isActive?: boolean;
  limit?: number;
}) => {
  try {
    let q = query(vehiclesRef, orderBy('createdAt', 'desc'));
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    
    if (filters?.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    
    if (filters?.limit) {
      q = query(q, limit(filters.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Vehicle[];
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};
  

export const deleteVehicle = async (id: string) => {
  const docRef = doc(vehiclesRef, id);
  await updateDoc(docRef, {
    isActive: false,
    status: 'inactive',
    updatedAt: Timestamp.now()
  });
};

export const subscribeToVehicles = (callback: (vehicles: Vehicle[]) => void) => {
  const q = query(vehiclesRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const vehicles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Vehicle[];
    callback(vehicles);
  });
};

// Location Operations
export const createLocation = async (locationData: Omit<Location, 'id'>) => {
  const docRef = await addDoc(locationsRef, locationData);
  return docRef.id;
};

export const getLocations = async () => {
  const querySnapshot = await getDocs(locationsRef);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Location[];
};

export const getLocationsByRegion = async (region: string) => {
  const q = query(locationsRef, where('region', '==', region));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Location[];
};

export const updateLocation = async (id: string, updates: Partial<Location>) => {
  const docRef = doc(locationsRef, id);
  await updateDoc(docRef, updates);
};

export const deleteLocation = async (id: string) => {
  const docRef = doc(locationsRef, id);
  await deleteDoc(docRef);
};

// Settings Operations
export const getSettings = async (key: string) => {
  const docRef = doc(settingsRef, key);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const updateSettings = async (key: string, value: any): Promise<void> => {
  const docRef = doc(settingsRef, key);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    await updateDoc(docRef, { value, updatedAt: Timestamp.now() });
  } else {
    await setDoc(docRef, { 
      key, 
      value, 
      createdAt: Timestamp.now(), 
      updatedAt: Timestamp.now() 
    });
  }
};

export const getAllSettings = async (): Promise<any> => {
  const querySnapshot = await getDocs(settingsRef);
  let settings: any = {
    pricing: { standard: 4.5, premium: 6.5, luxury: 8.5, commissionRate: 0.25 },
    company: {
      name: 'SBS TRAVEL',
      phone: '+90 242 123 45 67',
      email: 'sbstravelinfo@gmail.com',
      address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
      website: 'https://www.sbstravel.com',
      taxNumber: '1234567890',
      bankName: 'Türkiye İş Bankası',
      iban: 'TR12 0006 4000 0011 2345 6789 01'
    },
    notifications: { email: { enabled: false, provider: 'none' }, sms: { enabled: false, provider: 'none' }, whatsapp: { enabled: false } },
    payment: { paytr: { enabled: false, merchantId: '', merchantKey: '', merchantSalt: '' }, cashOnDelivery: true }
  };
  
  querySnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.key && data.value) {
      // Handle nested settings
      if (data.key.includes('.')) {
        const [category, field] = data.key.split('.');
        if (!settings[category]) settings[category] = {};
        settings[category][field] = data.value;
      } else {
        settings[data.key] = data.value;
      }
    }
  });
  
  return settings;
};

// Enhanced Driver Operations
export const getAllDrivers = async (includeInactive: boolean = false) => {
  let q = query(driversRef, orderBy('createdAt', 'desc'));
  
  if (!includeInactive) {
    q = query(q, where('isActive', '==', true));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Driver[];
};

export const deleteDriver = async (id: string) => {
  const docRef = doc(driversRef, id);
  await updateDoc(docRef, {
    isActive: false,
    status: 'offline',
    updatedAt: Timestamp.now()
  });
};

// Enhanced Customer Operations
export const getAllCustomers = async () => {
  const q = query(customersRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Customer[];
};

export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  const docRef = doc(customersRef, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteCustomer = async (id: string) => {
  const docRef = doc(customersRef, id);
  await deleteDoc(docRef);
};