import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { locationsRef } from './collections';
import { Location } from '../../types';

// Predefined locations for Antalya region
export const ANTALYA_LOCATIONS: Omit<Location, 'id'>[] = [
  {
    name: 'Antalya Havalimanı (AYT)',
    coordinates: { lat: 36.8987, lng: 30.7854 },
    type: 'airport',
    region: 'Antalya'
  },
  {
    name: 'Kemer',
    coordinates: { lat: 36.6048, lng: 30.5606 },
    type: 'city',
    region: 'Kemer'
  },
  {
    name: 'Belek',
    coordinates: { lat: 36.8625, lng: 31.0556 },
    type: 'city',
    region: 'Belek'
  },
  {
    name: 'Side',
    coordinates: { lat: 36.7673, lng: 31.3890 },
    type: 'city',
    region: 'Side'
  },
  {
    name: 'Alanya',
    coordinates: { lat: 36.5444, lng: 32.0000 },
    type: 'city',
    region: 'Alanya'
  },
  {
    name: 'Kaş',
    coordinates: { lat: 36.2020, lng: 29.6414 },
    type: 'city',
    region: 'Kaş'
  },
  {
    name: 'Kalkan',
    coordinates: { lat: 36.2667, lng: 29.4167 },
    type: 'city',
    region: 'Kalkan'
  },
  {
    name: 'Olympos',
    coordinates: { lat: 36.4167, lng: 30.4667 },
    type: 'city',
    region: 'Olympos'
  }
];

export const initializeLocations = async () => {
  try {
    // Check if locations already exist
    const existingLocations = await getDocs(locationsRef);
    
    if (existingLocations.empty) {
      // Add all predefined locations
      for (const location of ANTALYA_LOCATIONS) {
        await addDoc(locationsRef, location);
      }
      console.log('Locations initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing locations:', error);
  }
};

export const getLocationsByRegion = async (region: string) => {
  const q = query(locationsRef, where('region', '==', region));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Location[];
};

export const getAllLocations = async () => {
  const querySnapshot = await getDocs(locationsRef);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Location[];
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};