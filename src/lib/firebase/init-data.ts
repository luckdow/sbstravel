import { 
  createLocation, 
  createVehicle, 
  updateSettings, 
  getSettings 
} from './collections';
import { Location, Vehicle } from '../types';

// Default locations for Antalya region
const DEFAULT_LOCATIONS: Omit<Location, 'id'>[] = [
  {
    name: 'Antalya Havalimanı (AYT)',
    lat: 36.8987,
    lng: 30.7854,
    region: 'Antalya',
    distance: 0
  },
  {
    name: 'Kemer',
    lat: 36.6048,
    lng: 30.5606,
    region: 'Kemer',
    distance: 45
  },
  {
    name: 'Belek',
    lat: 36.8625,
    lng: 31.0556,
    region: 'Belek',
    distance: 35
  },
  {
    name: 'Side',
    lat: 36.7673,
    lng: 31.3890,
    region: 'Side',
    distance: 65
  },
  {
    name: 'Alanya',
    lat: 36.5444,
    lng: 32.0000,
    region: 'Alanya',
    distance: 120
  },
  {
    name: 'Kaş',
    lat: 36.2020,
    lng: 29.6414,
    region: 'Kaş',
    distance: 180
  },
  {
    name: 'Kalkan',
    lat: 36.2667,
    lng: 29.4167,
    region: 'Kalkan',
    distance: 200
  },
  {
    name: 'Olympos',
    lat: 36.4167,
    lng: 30.4667,
    region: 'Olympos',
    distance: 80
  },
  {
    name: 'Çıralı',
    lat: 36.4167,
    lng: 30.4667,
    region: 'Çıralı',
    distance: 85
  }
];

// Default vehicle types
const DEFAULT_VEHICLES: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>[] = [
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
    lastMaintenance: new Date(),
    totalKilometers: 45000
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
    lastMaintenance: new Date(),
    totalKilometers: 32000
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
    lastMaintenance: new Date(),
    totalKilometers: 25000
  }
];

// Default system settings
const DEFAULT_SETTINGS = {
  pricing: {
    standard: 4.5,
    premium: 6.5,
    luxury: 8.5,
    commissionRate: 0.25 // 25% to company, 75% to driver
  },
  company: {
    name: 'SBS TRAVEL',
    phone: '+90 242 123 45 67',
    email: 'sbstravelinfo@gmail.com',
    address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
    website: 'https://www.sbstravel.com',
    taxNumber: '1234567890'
  },
  notifications: {
    email: {
      enabled: false,
      provider: 'none' // none, gmail, sendgrid, ses
    },
    sms: {
      enabled: false,
      provider: 'none' // none, netgsm, twilio
    },
    whatsapp: {
      enabled: false
    }
  },
  payment: {
    paytr: {
      enabled: false,
      merchantId: '',
      merchantKey: '',
      merchantSalt: ''
    },
    cashOnDelivery: true
  }
};

// Initialize default data
export const initializeDefaultData = async () => {
  try {
    // Check if initialization has already been done
    const initialized = await getSettings('system_initialized');
    if (initialized) {
      console.log('System already initialized');
      return;
    }

    console.log('Initializing default data...');

    // Initialize locations
    for (const location of DEFAULT_LOCATIONS) {
      await createLocation(location);
    }

    // Initialize vehicles
    for (const vehicle of DEFAULT_VEHICLES) {
      await createVehicle(vehicle);
    }

    // Initialize settings
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await updateSettings(key, value);
    }

    // Mark system as initialized
    await updateSettings('system_initialized', {
      value: true,
      timestamp: new Date().toISOString()
    });

    console.log('Default data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing default data:', error);
    throw error;
  }
};