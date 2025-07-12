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
  images?: string[]; // Multiple images support
  licensePlate?: string;
  passengerCapacity: number;
  baggageCapacity: number;
  pricePerKm: number;
  features: string[];
  extraServices?: string[]; // References to extra service IDs
  status?: 'active' | 'maintenance' | 'inactive';
  isActive: boolean;
  lastMaintenance?: Date;
  totalKilometers?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalReservations?: number;
  totalSpent?: number;
  lastActivity?: Date;
  lastReservationDate?: Date;
  status?: 'active' | 'inactive';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExtraService {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: 'comfort' | 'assistance' | 'special';
  isActive: boolean;
  applicableVehicleTypes: ('standard' | 'premium' | 'luxury')[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DriverFinancials {
  totalEarnings: number;
  currentBalance: number; // Cari hesap bakiyesi
  receivables: number; // Alacaklar
  payables: number; // Borçlar
  lastPayment?: Date;
  pendingPayments: number;
  monthlyEarnings: Record<string, number>; // Month-year -> earnings
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
  isProblemDriver?: boolean; // Problem driver marking
  problemNotes?: string; // Notes about driver problems
  financials?: DriverFinancials; // Detailed financial information
  lastActivityDate?: Date;
  joinDate?: Date;
  vehicleIds?: string[]; // Multiple vehicles support
  createdAt?: Date;
  updatedAt?: Date;
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
  destination: LocationData;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  baggageCount: number;
  vehicleType: 'standard' | 'premium' | 'luxury';
  additionalServices: string[];
  flightNumber?: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface LocationData {
    bankName?: string;
    iban?: string;
  name: string;
  formatted_address?: string;
  lat: number;
  lng: number;
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

// Communication Types
export interface NotificationChannel {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface NotificationPreferences {
  customerId: string;
  channels: NotificationChannel;
  language: 'tr' | 'en';
  frequency: 'minimal' | 'normal' | 'all';
  optOut: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  language: 'tr' | 'en';
  category: 'booking' | 'payment' | 'reminder' | 'notification';
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  language: 'tr' | 'en';
  category: 'booking' | 'payment' | 'reminder' | 'otp';
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  mediaType?: 'text' | 'image' | 'document';
  mediaUrl?: string;
  variables: string[];
  language: 'tr' | 'en';
  category: 'booking' | 'payment' | 'reminder' | 'support';
}

export interface NotificationMessage {
  id?: string;
  customerId: string;
  reservationId?: string;
  type: 'email' | 'sms' | 'whatsapp';
  template: string;
  recipient: string;
  subject?: string;
  content: string;
  variables: Record<string, string>;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  retryCount: number;
  providerId?: string;
  error?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt?: Date;
}

export interface NotificationProvider {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  isActive: boolean;
  config: Record<string, string>;
  priority: number;
  costPerMessage: number;
  dailyQuota: number;
  usedQuota: number;
}

export interface NotificationAnalytics {
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  deliveryRate: number;
  readRate: number;
  avgDeliveryTime: number;
  byChannel: {
    email: NotificationStats;
    sms: NotificationStats;
    whatsapp: NotificationStats;
  };
}

export interface NotificationStats {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  cost: number;
}