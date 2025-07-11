import { Customer } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    phone: '+90 532 123 4567',
    totalReservations: 8,
    totalSpent: 680,
    lastActivity: new Date('2024-01-15T14:30:00Z'),
    lastReservationDate: new Date('2024-01-15T14:30:00Z'),
    status: 'active',
    notes: 'VIP müşteri - her zaman premium transfer tercih ediyor',
    createdAt: new Date('2023-06-10T10:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'CUST-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 555 123 4567',
    totalReservations: 3,
    totalSpent: 285,
    lastActivity: new Date('2024-01-12T16:00:00Z'),
    lastReservationDate: new Date('2024-01-12T16:00:00Z'),
    status: 'active',
    notes: 'ABD\'den gelen turist, İngilizce iletişim',
    createdAt: new Date('2023-12-05T15:20:00Z'),
    updatedAt: new Date('2024-01-12T16:00:00Z')
  },
  {
    id: 'CUST-003',
    firstName: 'Mustafa',
    lastName: 'Demir',
    email: 'mustafa.demir@email.com',
    phone: '+90 533 987 6543',
    totalReservations: 5,
    totalSpent: 425,
    lastActivity: new Date('2024-01-10T19:00:00Z'),
    lastReservationDate: new Date('2024-01-10T19:00:00Z'),
    status: 'active',
    notes: 'Düzenli müşteri - aileleriyle seyahat ediyor',
    createdAt: new Date('2023-08-15T12:30:00Z'),
    updatedAt: new Date('2024-01-10T19:00:00Z')
  },
  {
    id: 'CUST-004',
    firstName: 'Elena',
    lastName: 'Petrova',
    email: 'elena.petrova@email.com',
    phone: '+7 916 555 1234',
    totalReservations: 2,
    totalSpent: 190,
    lastActivity: new Date('2023-12-28T11:15:00Z'),
    lastReservationDate: new Date('2023-12-28T11:15:00Z'),
    status: 'active',
    notes: 'Rus turist, İngilizce konuşuyor',
    createdAt: new Date('2023-12-20T09:00:00Z'),
    updatedAt: new Date('2023-12-28T11:15:00Z')
  },
  {
    id: 'CUST-005',
    firstName: 'Hans',
    lastName: 'Müller',
    email: 'hans.mueller@email.com',
    phone: '+49 30 1234 5678',
    totalReservations: 6,
    totalSpent: 510,
    lastActivity: new Date('2024-01-08T13:45:00Z'),
    lastReservationDate: new Date('2024-01-08T13:45:00Z'),
    status: 'active',
    notes: 'Alman turist - her yıl geliyor, dakik ve titiz',
    createdAt: new Date('2023-07-22T16:10:00Z'),
    updatedAt: new Date('2024-01-08T13:45:00Z')
  },
  {
    id: 'CUST-006',
    firstName: 'Fatma',
    lastName: 'Kaya',
    email: 'fatma.kaya@email.com',
    phone: '+90 535 444 5566',
    totalReservations: 1,
    totalSpent: 75,
    lastActivity: new Date('2024-01-05T08:30:00Z'),
    lastReservationDate: new Date('2024-01-05T08:30:00Z'),
    status: 'active',
    notes: 'Yeni müşteri - ilk transfer deneyimi',
    createdAt: new Date('2024-01-05T08:00:00Z'),
    updatedAt: new Date('2024-01-05T08:30:00Z')
  }
];

// Function to get mock customers with optional filters
export const getMockCustomers = (filters?: {
  status?: 'active' | 'inactive';
  searchTerm?: string;
}): Customer[] => {
  let filteredCustomers = [...mockCustomers];

  if (filters?.status && filters.status !== 'all') {
    filteredCustomers = filteredCustomers.filter(customer => customer.status === filters.status);
  }

  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredCustomers = filteredCustomers.filter(customer =>
      customer.firstName?.toLowerCase().includes(searchLower) ||
      customer.lastName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(filters.searchTerm)
    );
  }

  return filteredCustomers;
};