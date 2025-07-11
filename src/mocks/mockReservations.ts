import { Reservation } from '../types';

export const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    customerId: 'CUST-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet.yilmaz@email.com',
    customerPhone: '+90 532 123 4567',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Kemer - Club Med Palmiye',
    pickupDate: new Date().toISOString().split('T')[0], // Today's date
    pickupTime: '14:30',
    passengerCount: 4,
    baggageCount: 3,
    vehicleType: 'premium',
    distance: 45,
    basePrice: 72.03,
    additionalServices: [
      {
        id: 'child-seat',
        name: 'Çocuk Koltuğu',
        price: 10
      }
    ],
    totalPrice: 85,
    status: 'pending',
    qrCode: 'QR-001-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'RES-002',
    customerId: 'CUST-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+1 555 123 4567',
    transferType: 'hotel-airport',
    pickupLocation: 'Belek - Regnum Carya',
    dropoffLocation: 'Antalya Havalimanı (AYT)',
    pickupDate: new Date().toISOString().split('T')[0], // Today's date
    pickupTime: '16:00',
    passengerCount: 2,
    baggageCount: 2,
    vehicleType: 'luxury',
    distance: 35,
    basePrice: 101.69,
    additionalServices: [
      {
        id: 'wifi',
        name: 'Wi-Fi',
        price: 5
      },
      {
        id: 'water',
        name: 'Su',
        price: 3
      }
    ],
    totalPrice: 120,
    status: 'assigned',
    driverId: 'DRV-001',
    driverName: 'Mehmet Demir',
    qrCode: 'QR-002-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-15T11:00:00Z'),
    updatedAt: new Date('2024-01-15T11:30:00Z')
  },
  {
    id: 'RES-003',
    customerId: 'CUST-003',
    customerName: 'Mustafa Demir',
    customerEmail: 'mustafa.demir@email.com',
    customerPhone: '+90 533 987 6543',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Side - Manavgat Resort',
    pickupDate: new Date().toISOString().split('T')[0], // Today's date
    pickupTime: '19:00',
    passengerCount: 3,
    baggageCount: 4,
    vehicleType: 'premium',
    distance: 60,
    basePrice: 89.55,
    additionalServices: [],
    totalPrice: 105,
    status: 'completed',
    driverId: 'DRV-002',
    driverName: 'Ali Kaya',
    qrCode: 'QR-003-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-15T21:30:00Z')
  },
  {
    id: 'RES-004',
    customerId: 'CUST-004',
    customerName: 'Elena Petrova',
    customerEmail: 'elena.petrova@email.com',
    customerPhone: '+7 916 555 1234',
    transferType: 'hotel-airport',
    pickupLocation: 'Alanya - Eftalia Ocean Resort',
    dropoffLocation: 'Antalya Havalimanı (AYT)',
    pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    pickupTime: '11:15',
    passengerCount: 2,
    baggageCount: 2,
    vehicleType: 'standard',
    distance: 125,
    basePrice: 80.25,
    additionalServices: [
      {
        id: 'water',
        name: 'Su',
        price: 3
      }
    ],
    totalPrice: 95,
    status: 'confirmed',
    driverId: 'DRV-003',
    driverName: 'Osman Çelik',
    qrCode: 'QR-004-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-14T15:20:00Z'),
    updatedAt: new Date('2024-01-14T16:00:00Z')
  },
  {
    id: 'RES-005',
    customerId: 'CUST-005',
    customerName: 'Hans Müller',
    customerEmail: 'hans.mueller@email.com',
    customerPhone: '+49 30 1234 5678',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Belek - Gloria Golf Resort',
    pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    pickupTime: '13:45',
    passengerCount: 4,
    baggageCount: 3,
    vehicleType: 'luxury',
    distance: 40,
    basePrice: 118.64,
    additionalServices: [
      {
        id: 'vip-service',
        name: 'VIP Hizmet',
        price: 25
      },
      {
        id: 'wifi',
        name: 'Wi-Fi',
        price: 5
      }
    ],
    totalPrice: 150,
    status: 'pending',
    qrCode: 'QR-005-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-13T09:30:00Z'),
    updatedAt: new Date('2024-01-13T09:30:00Z')
  },
  {
    id: 'RES-006',
    customerId: 'CUST-006',
    customerName: 'Fatma Kaya',
    customerEmail: 'fatma.kaya@email.com',
    customerPhone: '+90 535 444 5566',
    transferType: 'hotel-airport',
    pickupLocation: 'Kemer - Rixos Premium Tekirova',
    dropoffLocation: 'Antalya Havalimanı (AYT)',
    pickupDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    pickupTime: '08:30',
    passengerCount: 1,
    baggageCount: 1,
    vehicleType: 'standard',
    distance: 50,
    basePrice: 63.56,
    additionalServices: [],
    totalPrice: 75,
    status: 'completed',
    driverId: 'DRV-006',
    driverName: 'Serkan Avcı',
    qrCode: 'QR-006-2024',
    paymentStatus: 'completed',
    createdAt: new Date('2024-01-14T07:00:00Z'),
    updatedAt: new Date('2024-01-14T10:45:00Z')
  },
  {
    id: 'RES-007',
    customerId: 'CUST-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet.yilmaz@email.com',
    customerPhone: '+90 532 123 4567',
    transferType: 'airport-hotel',
    pickupLocation: 'Antalya Havalimanı (AYT)',
    dropoffLocation: 'Lara - Delphin Imperial',
    pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    pickupTime: '22:15',
    passengerCount: 6,
    baggageCount: 5,
    vehicleType: 'premium',
    distance: 15,
    basePrice: 50.85,
    additionalServices: [
      {
        id: 'child-seat',
        name: 'Çocuk Koltuğu',
        price: 10
      },
      {
        id: 'water',
        name: 'Su',
        price: 3
      }
    ],
    totalPrice: 65,
    status: 'pending',
    qrCode: 'QR-007-2024',
    paymentStatus: 'pending',
    createdAt: new Date('2024-01-15T20:00:00Z'),
    updatedAt: new Date('2024-01-15T20:00:00Z')
  },
  {
    id: 'RES-008',
    customerId: 'CUST-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+1 555 123 4567',
    transferType: 'hotel-airport',
    pickupLocation: 'Side - TUI Sensatori Resort',
    dropoffLocation: 'Antalya Havalimanı (AYT)',
    pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    pickupTime: '05:45',
    passengerCount: 2,
    baggageCount: 3,
    vehicleType: 'luxury',
    distance: 65,
    basePrice: 127.12,
    additionalServices: [
      {
        id: 'early-pickup',
        name: 'Erken Kalkış',
        price: 15
      }
    ],
    totalPrice: 150,
    status: 'cancelled',
    qrCode: 'QR-008-2024',
    paymentStatus: 'refunded',
    createdAt: new Date('2024-01-12T18:30:00Z'),
    updatedAt: new Date('2024-01-13T06:00:00Z')
  }
];

// Function to get mock reservations with optional filters
export const getMockReservations = (filters?: {
  status?: 'pending' | 'assigned' | 'confirmed' | 'started' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  customerId?: string;
  driverId?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  searchTerm?: string;
}): Reservation[] => {
  let filteredReservations = [...mockReservations];

  if (filters?.status && filters.status !== 'all') {
    filteredReservations = filteredReservations.filter(reservation => reservation.status === filters.status);
  }

  if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
    filteredReservations = filteredReservations.filter(reservation => reservation.paymentStatus === filters.paymentStatus);
  }

  if (filters?.customerId) {
    filteredReservations = filteredReservations.filter(reservation => reservation.customerId === filters.customerId);
  }

  if (filters?.driverId) {
    filteredReservations = filteredReservations.filter(reservation => reservation.driverId === filters.driverId);
  }

  if (filters?.dateRange?.start) {
    filteredReservations = filteredReservations.filter(reservation => 
      reservation.pickupDate >= filters.dateRange!.start!
    );
  }

  if (filters?.dateRange?.end) {
    filteredReservations = filteredReservations.filter(reservation => 
      reservation.pickupDate <= filters.dateRange!.end!
    );
  }

  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredReservations = filteredReservations.filter(reservation =>
      reservation.customerName?.toLowerCase().includes(searchLower) ||
      reservation.customerEmail?.toLowerCase().includes(searchLower) ||
      reservation.customerPhone?.includes(filters.searchTerm) ||
      reservation.pickupLocation?.toLowerCase().includes(searchLower) ||
      reservation.dropoffLocation?.toLowerCase().includes(searchLower) ||
      reservation.qrCode?.toLowerCase().includes(searchLower)
    );
  }

  return filteredReservations;
};

// Function to get today's reservations
export const getTodayMockReservations = (): Reservation[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockReservations.filter(reservation => reservation.pickupDate === today);
};

// Function to get pending reservations
export const getPendingMockReservations = (): Reservation[] => {
  return mockReservations.filter(reservation => reservation.status === 'pending');
};

// Function to get reservations by driver
export const getMockReservationsByDriver = (driverId: string): Reservation[] => {
  return mockReservations.filter(reservation => reservation.driverId === driverId);
};

// Function to get reservations by customer
export const getMockReservationsByCustomer = (customerId: string): Reservation[] => {
  return mockReservations.filter(reservation => reservation.customerId === customerId);
};