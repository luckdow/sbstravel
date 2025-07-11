// Mock data for demo purposes (when Supabase is not connected)
import { Reservation, Driver, Customer } from './supabase';

export const mockReservations: Reservation[] = [
  {
    id: 'RES-001',
    customer_name: 'Ahmet Yılmaz',
    customer_email: 'ahmet@email.com',
    customer_phone: '+90 532 123 4567',
    pickup_location: 'Antalya Havalimanı (AYT)',
    dropoff_location: 'Kemer - Club Med Palmiye',
    pickup_date: '2024-01-15',
    pickup_time: '14:30',
    passenger_count: 4,
    baggage_count: 3,
    vehicle_type: 'premium',
    total_price: 85,
    status: 'pending',
    qr_code: 'QR-001',
    payment_status: 'completed',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'RES-002',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@email.com',
    customer_phone: '+1 555 123 4567',
    pickup_location: 'Belek - Regnum Carya',
    dropoff_location: 'Antalya Havalimanı (AYT)',
    pickup_date: '2024-01-15',
    pickup_time: '16:00',
    passenger_count: 2,
    baggage_count: 2,
    vehicle_type: 'luxury',
    total_price: 120,
    status: 'assigned',
    driver_id: 'DRV-001',
    qr_code: 'QR-002',
    payment_status: 'completed',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  }
];

export const mockDrivers: Driver[] = [
  {
    id: 'DRV-001',
    name: 'Mehmet Demir',
    email: 'mehmet@ayttransfer.com',
    phone: '+90 532 111 2233',
    vehicle_type: 'premium',
    status: 'available',
    current_location: 'Antalya Merkez',
    rating: 4.8,
    total_earnings: 2340,
    completed_trips: 156,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'DRV-002',
    name: 'Ali Kaya',
    email: 'ali@ayttransfer.com',
    phone: '+90 533 222 3344',
    vehicle_type: 'luxury',
    status: 'busy',
    current_location: 'Kemer',
    rating: 4.9,
    total_earnings: 3120,
    completed_trips: 203,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@email.com',
    phone: '+90 532 123 4567',
    total_reservations: 3,
    created_at: '2024-01-10T00:00:00Z'
  }
];