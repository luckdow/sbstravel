import { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    type: 'premium',
    name: 'Mercedes Vito',
    model: 'Vito 119 CDI',
    image: '/images/vehicles/mercedes-vito.jpg',
    images: [
      '/images/vehicles/mercedes-vito-1.jpg',
      '/images/vehicles/mercedes-vito-2.jpg',
      '/images/vehicles/mercedes-vito-3.jpg'
    ],
    licensePlate: '07 AYT 123',
    passengerCapacity: 8,
    baggageCapacity: 6,
    pricePerKm: 2.5,
    features: [
      'Klima',
      'Wi-Fi',
      'USB Şarj',
      'Deri Koltuk',
      'Bagaj Alanı',
      'Güvenlik Kemeri'
    ],
    extraServices: ['child-seat', 'wifi', 'water'],
    status: 'active',
    isActive: true,
    lastMaintenance: new Date('2023-12-15T10:00:00Z'),
    totalKilometers: 85420,
    createdAt: new Date('2023-03-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'VEH-002',
    type: 'luxury',
    name: 'Mercedes S-Class',
    model: 'S 350 d',
    image: '/images/vehicles/mercedes-s-class.jpg',
    images: [
      '/images/vehicles/mercedes-s-class-1.jpg',
      '/images/vehicles/mercedes-s-class-2.jpg',
      '/images/vehicles/mercedes-s-class-3.jpg'
    ],
    licensePlate: '07 LUX 001',
    passengerCapacity: 4,
    baggageCapacity: 3,
    pricePerKm: 4.0,
    features: [
      'Premium Klima',
      'Wi-Fi',
      'USB & Wireless Şarj',
      'Masaj Koltuğu',
      'Premium Ses Sistemi',
      'Mini Bar',
      'Gizli Cam',
      'Deri İç Döşeme'
    ],
    extraServices: ['vip-service', 'champagne', 'wifi', 'newspaper'],
    status: 'active',
    isActive: true,
    lastMaintenance: new Date('2024-01-05T09:00:00Z'),
    totalKilometers: 42350,
    createdAt: new Date('2023-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-15T16:00:00Z')
  },
  {
    id: 'VEH-003',
    type: 'standard',
    name: 'Ford Transit',
    model: 'Transit 350M',
    image: '/images/vehicles/ford-transit.jpg',
    images: [
      '/images/vehicles/ford-transit-1.jpg',
      '/images/vehicles/ford-transit-2.jpg'
    ],
    licensePlate: '07 STD 234',
    passengerCapacity: 12,
    baggageCapacity: 8,
    pricePerKm: 1.8,
    features: [
      'Klima',
      'Güvenlik Kemeri',
      'Bagaj Alanı',
      'USB Şarj'
    ],
    extraServices: ['child-seat', 'water'],
    status: 'active',
    isActive: true,
    lastMaintenance: new Date('2024-01-02T14:00:00Z'),
    totalKilometers: 128740,
    createdAt: new Date('2023-05-20T14:30:00Z'),
    updatedAt: new Date('2024-01-15T12:15:00Z')
  },
  {
    id: 'VEH-004',
    type: 'premium',
    name: 'Volkswagen Crafter',
    model: 'Crafter 35',
    image: '/images/vehicles/vw-crafter.jpg',
    images: [
      '/images/vehicles/vw-crafter-1.jpg',
      '/images/vehicles/vw-crafter-2.jpg'
    ],
    licensePlate: '07 PRM 345',
    passengerCapacity: 9,
    baggageCapacity: 7,
    pricePerKm: 2.3,
    features: [
      'Klima',
      'Wi-Fi',
      'USB Şarj',
      'Kumaş Koltuk',
      'Geniş Bagaj',
      'LED Aydınlatma'
    ],
    extraServices: ['wifi', 'water', 'magazine'],
    status: 'maintenance',
    isActive: true,
    lastMaintenance: new Date('2024-01-14T08:00:00Z'),
    totalKilometers: 76890,
    createdAt: new Date('2023-02-28T11:15:00Z'),
    updatedAt: new Date('2024-01-14T18:45:00Z')
  },
  {
    id: 'VEH-005',
    type: 'luxury',
    name: 'BMW 7 Series',
    model: '740d xDrive',
    image: '/images/vehicles/bmw-7-series.jpg',
    images: [
      '/images/vehicles/bmw-7-series-1.jpg',
      '/images/vehicles/bmw-7-series-2.jpg',
      '/images/vehicles/bmw-7-series-3.jpg'
    ],
    licensePlate: '07 BMW 777',
    passengerCapacity: 4,
    baggageCapacity: 3,
    pricePerKm: 3.8,
    features: [
      'Premium Klima',
      'Wi-Fi',
      'Wireless Şarj',
      'Ventilasyonlu Koltuk',
      'Harman Kardon Ses',
      'Gece Görüş',
      'Gesture Control',
      'Deri İç Döşeme'
    ],
    extraServices: ['vip-service', 'wifi', 'water', 'newspaper'],
    status: 'active',
    isActive: true,
    lastMaintenance: new Date('2023-12-20T15:30:00Z'),
    totalKilometers: 35680,
    createdAt: new Date('2023-04-12T13:00:00Z'),
    updatedAt: new Date('2024-01-15T19:00:00Z')
  },
  {
    id: 'VEH-006',
    type: 'standard',
    name: 'Fiat Ducato',
    model: 'Ducato Maxi',
    image: '/images/vehicles/fiat-ducato.jpg',
    images: [
      '/images/vehicles/fiat-ducato-1.jpg'
    ],
    licensePlate: '07 FİAT 456',
    passengerCapacity: 15,
    baggageCapacity: 10,
    pricePerKm: 1.6,
    features: [
      'Klima',
      'Güvenlik Kemeri',
      'Geniş Bagaj Alanı'
    ],
    extraServices: ['water'],
    status: 'active',
    isActive: true,
    lastMaintenance: new Date('2023-11-28T13:45:00Z'),
    totalKilometers: 156230,
    createdAt: new Date('2023-08-05T15:45:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z')
  },
  {
    id: 'VEH-007',
    type: 'premium',
    name: 'Mercedes Sprinter',
    model: 'Sprinter 519 CDI',
    image: '/images/vehicles/mercedes-sprinter.jpg',
    images: [
      '/images/vehicles/mercedes-sprinter-1.jpg',
      '/images/vehicles/mercedes-sprinter-2.jpg'
    ],
    licensePlate: '07 SPR 789',
    passengerCapacity: 16,
    baggageCapacity: 12,
    pricePerKm: 2.8,
    features: [
      'Klima',
      'Wi-Fi',
      'USB Şarj',
      'Kumaş Koltuk',
      'Geniş Bagaj',
      'Ses Sistemi',
      'Televizyon'
    ],
    extraServices: ['wifi', 'water', 'tv', 'magazine'],
    status: 'inactive',
    isActive: false,
    lastMaintenance: new Date('2023-10-15T10:00:00Z'),
    totalKilometers: 201450,
    createdAt: new Date('2022-12-01T09:00:00Z'),
    updatedAt: new Date('2023-11-20T14:00:00Z')
  }
];

// Function to get mock vehicles with optional filters
export const getMockVehicles = (filters?: {
  type?: 'standard' | 'premium' | 'luxury';
  status?: 'active' | 'maintenance' | 'inactive';
  isActive?: boolean;
  searchTerm?: string;
}): Vehicle[] => {
  let filteredVehicles = [...mockVehicles];

  if (filters?.type && filters.type !== 'all') {
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === filters.type);
  }

  if (filters?.status && filters.status !== 'all') {
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === filters.status);
  }

  if (filters?.isActive !== undefined) {
    filteredVehicles = filteredVehicles.filter(vehicle => vehicle.isActive === filters.isActive);
  }

  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredVehicles = filteredVehicles.filter(vehicle =>
      vehicle.name?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.licensePlate?.toLowerCase().includes(searchLower)
    );
  }

  return filteredVehicles;
};

// Function to get active vehicles for assignments
export const getActiveMockVehicles = (): Vehicle[] => {
  return mockVehicles.filter(vehicle => 
    vehicle.isActive && 
    vehicle.status === 'active'
  );
};

// Function to get vehicles by type
export const getMockVehiclesByType = (type: 'standard' | 'premium' | 'luxury'): Vehicle[] => {
  return mockVehicles.filter(vehicle => 
    vehicle.type === type && 
    vehicle.isActive && 
    vehicle.status === 'active'
  );
};