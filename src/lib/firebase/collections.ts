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
import { Reservation, Driver, Vehicle, Customer, Commission } from '../../types';

// Collection References
export const reservationsRef = collection(db, 'reservations');
export const driversRef = collection(db, 'drivers');
export const vehiclesRef = collection(db, 'vehicles');
export const customersRef = collection(db, 'customers');
export const commissionsRef = collection(db, 'commissions');

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