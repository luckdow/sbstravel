// Core Types for Antalya Transfer System

export interface Location {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  distance?: number; // Distance from airport in KM
  region?: string;
}

export interface Vehicle {
  id?: string;
  type: 'standard' | 'premium' | 'luxury';
  name: string;
  model: string;
  image: string;
  passengerCapacity: number;
  baggageCapacity: number;
  pricePerKm: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalReservations?: number;
  createdAt?: Date;
}

export interface Driver {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: 'standard' | 'premium' | 'luxury';
  status: 'available' | 'busy' | 'offline';
  currentLocation?: string;
  rating: number;
  totalEarnings: number;
  completedTrips: number;
  isActive: boolean;
  createdAt?: Date;
}

export interface Reservation {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Transfer details
  transferType: 'airport-hotel' | 'hotel-airport';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  
  // Passenger details
  passengerCount: number;
  baggageCount: number;
  
  // Vehicle and pricing
  vehicleType: 'standard' | 'premium' | 'luxury';
  distance: number; // in KM
  basePrice: number;
  additionalServices: AdditionalService[];
  totalPrice: number;
  
  // Status and assignment
  status: 'pending' | 'assigned' | 'confirmed' | 'started' | 'completed' | 'cancelled';
  driverId?: string;
  driverName?: string;
  
  // QR Code and payment
  qrCode: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AdditionalService {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
}

export interface Commission {
  id?: string;
  reservationId: string;
  driverId: string;
  totalAmount: number;
  companyShare: number; // 25%
  driverShare: number;  // 75%
  status: 'pending' | 'paid';
  createdAt?: Date;
  paidAt?: Date;
}

export interface BookingFormData {
  transferType: 'airport-hotel' | 'hotel-airport';
  destination: string;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  baggageCount: number;
  vehicleType: 'standard' | 'premium' | 'luxury';
  additionalServices: string[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface PriceCalculation {
  distance: number;
  vehicleType: 'standard' | 'premium' | 'luxury';
  basePrice: number;
  additionalServicesCost: number;
  totalPrice: number;
  route?: google.maps.DirectionsResult;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Google Maps types
export interface RouteResult {
  distance: number; // in kilometers
  duration: number; // in minutes
  route: google.maps.DirectionsResult;
}