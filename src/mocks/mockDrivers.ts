import { Driver } from '../types';

export const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@ayttransfer.com',
    phone: '+90 532 111 2233',
    licenseNumber: 'ABC123456',
    vehicleType: 'premium',
    status: 'busy',
    currentLocation: 'Kemer - Club Med Palmiye',
    rating: 4.8,
    totalEarnings: 2340,
    completedTrips: 156,
    isActive: true,
    isProblemDriver: false,
    lastActivityDate: new Date('2024-01-15T14:30:00Z'),
    joinDate: new Date('2023-03-15T10:00:00Z'),
    vehicleIds: ['VEH-001'],
    financials: {
      totalEarnings: 2340,
      currentBalance: 850,
      receivables: 320,
      payables: 150,
      lastPayment: new Date('2024-01-10T12:00:00Z'),
      pendingPayments: 180,
      monthlyEarnings: {
        '2024-01': 420,
        '2023-12': 380,
        '2023-11': 360
      }
    },
    createdAt: new Date('2023-03-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'DRV-002',
    firstName: 'Ali',
    lastName: 'Kaya',
    email: 'ali.kaya@ayttransfer.com',
    phone: '+90 533 222 3344',
    licenseNumber: 'DEF789012',
    vehicleType: 'luxury',
    status: 'available',
    currentLocation: 'Antalya Merkez',
    rating: 4.9,
    totalEarnings: 3120,
    completedTrips: 203,
    isActive: true,
    isProblemDriver: false,
    lastActivityDate: new Date('2024-01-15T16:00:00Z'),
    joinDate: new Date('2023-01-10T09:00:00Z'),
    vehicleIds: ['VEH-002'],
    financials: {
      totalEarnings: 3120,
      currentBalance: 1250,
      receivables: 480,
      payables: 0,
      lastPayment: new Date('2024-01-12T15:00:00Z'),
      pendingPayments: 0,
      monthlyEarnings: {
        '2024-01': 580,
        '2023-12': 520,
        '2023-11': 490
      }
    },
    createdAt: new Date('2023-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-15T16:00:00Z')
  },
  {
    id: 'DRV-003',
    firstName: 'Osman',
    lastName: 'Çelik',
    email: 'osman.celik@ayttransfer.com',
    phone: '+90 534 333 4455',
    licenseNumber: 'GHI345678',
    vehicleType: 'standard',
    status: 'available',
    currentLocation: 'Belek',
    rating: 4.7,
    totalEarnings: 1890,
    completedTrips: 124,
    isActive: true,
    isProblemDriver: false,
    lastActivityDate: new Date('2024-01-15T12:15:00Z'),
    joinDate: new Date('2023-05-20T14:30:00Z'),
    vehicleIds: ['VEH-003'],
    financials: {
      totalEarnings: 1890,
      currentBalance: 620,
      receivables: 240,
      payables: 80,
      lastPayment: new Date('2024-01-08T10:30:00Z'),
      pendingPayments: 120,
      monthlyEarnings: {
        '2024-01': 290,
        '2023-12': 310,
        '2023-11': 275
      }
    },
    createdAt: new Date('2023-05-20T14:30:00Z'),
    updatedAt: new Date('2024-01-15T12:15:00Z')
  },
  {
    id: 'DRV-004',
    firstName: 'Emre',
    lastName: 'Yıldız',
    email: 'emre.yildiz@ayttransfer.com',
    phone: '+90 535 444 5566',
    licenseNumber: 'JKL901234',
    vehicleType: 'premium',
    status: 'offline',
    currentLocation: 'Side',
    rating: 4.6,
    totalEarnings: 2150,
    completedTrips: 178,
    isActive: true,
    isProblemDriver: false,
    lastActivityDate: new Date('2024-01-14T18:45:00Z'),
    joinDate: new Date('2023-02-28T11:15:00Z'),
    vehicleIds: ['VEH-004'],
    financials: {
      totalEarnings: 2150,
      currentBalance: 780,
      receivables: 290,
      payables: 50,
      lastPayment: new Date('2024-01-05T14:20:00Z'),
      pendingPayments: 160,
      monthlyEarnings: {
        '2024-01': 350,
        '2023-12': 320,
        '2023-11': 380
      }
    },
    createdAt: new Date('2023-02-28T11:15:00Z'),
    updatedAt: new Date('2024-01-14T18:45:00Z')
  },
  {
    id: 'DRV-005',
    firstName: 'Hasan',
    lastName: 'Öztürk',
    email: 'hasan.ozturk@ayttransfer.com',
    phone: '+90 536 555 6677',
    licenseNumber: 'MNO567890',
    vehicleType: 'luxury',
    status: 'busy',
    currentLocation: 'Alanya - Eftalia Ocean Resort',
    rating: 4.9,
    totalEarnings: 2890,
    completedTrips: 189,
    isActive: true,
    isProblemDriver: false,
    lastActivityDate: new Date('2024-01-15T19:00:00Z'),
    joinDate: new Date('2023-04-12T13:00:00Z'),
    vehicleIds: ['VEH-005'],
    financials: {
      totalEarnings: 2890,
      currentBalance: 1120,
      receivables: 420,
      payables: 0,
      lastPayment: new Date('2024-01-11T16:30:00Z'),
      pendingPayments: 0,
      monthlyEarnings: {
        '2024-01': 480,
        '2023-12': 450,
        '2023-11': 425
      }
    },
    createdAt: new Date('2023-04-12T13:00:00Z'),
    updatedAt: new Date('2024-01-15T19:00:00Z')
  },
  {
    id: 'DRV-006',
    firstName: 'Serkan',
    lastName: 'Avcı',
    email: 'serkan.avci@ayttransfer.com',
    phone: '+90 537 666 7788',
    licenseNumber: 'PQR123789',
    vehicleType: 'standard',
    status: 'available',
    currentLocation: 'Antalya Havalimanı',
    rating: 4.5,
    totalEarnings: 1650,
    completedTrips: 98,
    isActive: true,
    isProblemDriver: true,
    problemNotes: 'Müşteri şikayetleri var - geç kalma eğilimi',
    lastActivityDate: new Date('2024-01-15T11:30:00Z'),
    joinDate: new Date('2023-08-05T15:45:00Z'),
    vehicleIds: ['VEH-006'],
    financials: {
      totalEarnings: 1650,
      currentBalance: 480,
      receivables: 180,
      payables: 120,
      lastPayment: new Date('2024-01-03T09:15:00Z'),
      pendingPayments: 200,
      monthlyEarnings: {
        '2024-01': 220,
        '2023-12': 250,
        '2023-11': 210
      }
    },
    createdAt: new Date('2023-08-05T15:45:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z')
  }
];

// Function to get mock drivers with optional filters
export const getMockDrivers = (filters?: {
  status?: 'available' | 'busy' | 'offline';
  vehicleType?: 'standard' | 'premium' | 'luxury';
  isActive?: boolean;
  searchTerm?: string;
}): Driver[] => {
  let filteredDrivers = [...mockDrivers];

  if (filters?.status && filters.status !== 'all') {
    filteredDrivers = filteredDrivers.filter(driver => driver.status === filters.status);
  }

  if (filters?.vehicleType && filters.vehicleType !== 'all') {
    filteredDrivers = filteredDrivers.filter(driver => driver.vehicleType === filters.vehicleType);
  }

  if (filters?.isActive !== undefined) {
    filteredDrivers = filteredDrivers.filter(driver => driver.isActive === filters.isActive);
  }

  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredDrivers = filteredDrivers.filter(driver =>
      driver.firstName?.toLowerCase().includes(searchLower) ||
      driver.lastName?.toLowerCase().includes(searchLower) ||
      driver.email?.toLowerCase().includes(searchLower) ||
      driver.phone?.includes(filters.searchTerm) ||
      driver.licenseNumber?.toLowerCase().includes(searchLower)
    );
  }

  return filteredDrivers;
};

// Function to get available drivers for assignment
export const getAvailableMockDrivers = (): Driver[] => {
  return mockDrivers.filter(driver => 
    driver.isActive && 
    driver.status === 'available'
  );
};