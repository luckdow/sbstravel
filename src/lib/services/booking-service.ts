import { createReservation, createCustomer, getCustomerByEmail, createCommission } from '../firebase/collections';
import { generateQRCode } from '../utils/qr-code';
import { notificationService } from './notification-service';
import { paytrService } from '../payment/paytr-integration';
import { transactionService } from './transaction-service';
import { Reservation, Customer } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export interface BookingRequest {
  // Transfer details
  transferType: 'airport-hotel' | 'hotel-airport';
  destination: {
    name: string;
    type: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  luggageCount: number;
  
  // Customer information
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    flightNumber?: string;
    specialRequests?: string;
  };
  
  // Additional services and pricing
  extraServices: string[];
  priceCalculation: {
    basePrice: number;
    distance: number;
    additionalServicesCost: number;
    totalPrice: number;
  };
  
  // Payment details
  paymentMethod: 'credit-card' | 'bank-transfer';
}

export interface BookingResult {
  success: boolean;
  reservationId?: string;
  customerId?: string;
  qrCode?: string;
  paymentUrl?: string;
  error?: string;
  message?: string;
}

/**
 * Booking Service - Handles the complete booking flow
 * Creates real reservations and integrates with payment systems
 */
export class BookingService {
  private static instance: BookingService;

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  /**
   * Process a complete booking including reservation creation and payment
   */
  async processBooking(request: BookingRequest): Promise<BookingResult> {
    try {
      // Check if booking system is enabled
      if (!this.isBookingEnabled()) {
        return {
          success: false,
          error: 'Rezervasyon sistemi şu anda aktif değil'
        };
      }

      // Step 1: Create or get customer
      const customer = await this.createOrGetCustomer(request.customerInfo);
      if (!customer) {
        return {
          success: false,
          error: 'Müşteri bilgileri kaydedilemedi'
        };
      }

      // Step 2: Create reservation based on payment method
      if (request.paymentMethod === 'bank-transfer') {
        // For bank transfer, create reservation immediately
        return await this.createImmediateReservation(request, customer);
      } else if (request.paymentMethod === 'credit-card') {
        // For credit card, create pending reservation and initiate payment
        return await this.createPendingReservationWithPayment(request, customer);
      } else {
        return {
          success: false,
          error: 'Geçersiz ödeme yöntemi'
        };
      }

    } catch (error) {
      console.error('Booking processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Rezervasyon oluşturulurken hata oluştu'
      };
    }
  }

  /**
   * Creates immediate reservation for bank transfer payments
   */
  private async createImmediateReservation(request: BookingRequest, customer: Customer): Promise<BookingResult> {
    try {
      // Create reservation with confirmed status for bank transfer
      const reservationData = this.buildReservationData(request, customer, 'confirmed');
      const reservationId = await createReservation(reservationData);

      // Generate QR code
      const qrCode = await generateQRCode(reservationId);

      // Create commission record
      await createCommission(reservationId, 'pending', request.priceCalculation.totalPrice);

      // Send notifications
      await this.sendBookingNotifications(reservationId, request, customer, 'bank-transfer');

      return {
        success: true,
        reservationId,
        customerId: customer.id,
        qrCode,
        message: 'Rezervasyon oluşturuldu. Havale bilgileri e-posta adresinize gönderildi.'
      };

    } catch (error) {
      console.error('Immediate reservation creation error:', error);
      throw error;
    }
  }

  /**
   * Creates pending reservation and initiates credit card payment
   */
  private async createPendingReservationWithPayment(request: BookingRequest, customer: Customer): Promise<BookingResult> {
    try {
      // Create reservation with pending status
      const reservationData = this.buildReservationData(request, customer, 'pending');
      const reservationId = await createReservation(reservationData);

      // Create transaction
      const transaction = await transactionService.createTransaction({
        reservationId,
        amount: request.priceCalculation.totalPrice,
        currency: 'USD',
        customerInfo: request.customerInfo,
        reservationData: {
          route: `${request.transferType === 'airport-hotel' ? 'Airport → ' + request.destination.name : request.destination.name + ' → Airport'}`,
          ...request
        },
        paymentMethod: request.paymentMethod,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // Process payment
      const paymentResult = await transactionService.processPayment(transaction.id, {
        reservationId,
        amount: request.priceCalculation.totalPrice,
        currency: 'USD',
        customerInfo: request.customerInfo,
        reservationData: {
          route: `${request.transferType === 'airport-hotel' ? 'Airport → ' + request.destination.name : request.destination.name + ' → Airport'}`,
          ...request
        },
        paymentMethod: request.paymentMethod,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      if (!paymentResult.success) {
        // If payment failed, we might want to cancel the reservation
        // For now, we'll leave it as pending
        return {
          success: false,
          error: paymentResult.error || 'Ödeme başlatılamadı'
        };
      }

      // Generate QR code for the reservation
      const qrCode = await generateQRCode(reservationId);

      return {
        success: true,
        reservationId,
        customerId: customer.id,
        qrCode,
        paymentUrl: paymentResult.paymentUrl,
        message: paymentResult.paymentUrl 
          ? 'Ödeme sayfasına yönlendiriliyorsunuz...' 
          : 'Rezervasyon oluşturuldu ve ödeme test modunda kabul edildi'
      };

    } catch (error) {
      console.error('Pending reservation with payment error:', error);
      throw error;
    }
  }

  /**
   * Create or get existing customer
   */
  private async createOrGetCustomer(customerInfo: BookingRequest['customerInfo']): Promise<Customer | null> {
    try {
      // Try to get existing customer by email
      let customer = await getCustomerByEmail(customerInfo.email);
      
      if (!customer) {
        // Create new customer
        const customerId = await createCustomer({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          isActive: true,
          totalReservations: 0,
          totalSpent: 0,
          preferredLanguage: 'tr',
          communicationPreferences: {
            email: true,
            sms: true,
            whatsapp: false
          }
        });

        customer = {
          id: customerId,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          isActive: true,
          totalReservations: 0,
          totalSpent: 0,
          preferredLanguage: 'tr',
          communicationPreferences: {
            email: true,
            sms: true,
            whatsapp: false
          },
          createdAt: new Date()
        };
      }

      return customer;
    } catch (error) {
      console.error('Customer creation/retrieval error:', error);
      return null;
    }
  }

  /**
   * Build reservation data object
   */
  private buildReservationData(request: BookingRequest, customer: Customer, status: Reservation['status']): Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      customerId: customer.id!,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      
      // Transfer details
      pickupLocation: request.transferType === 'airport-hotel' ? 'Antalya Airport' : request.destination.name,
      dropoffLocation: request.transferType === 'airport-hotel' ? request.destination.name : 'Antalya Airport',
      pickupDate: request.pickupDate,
      pickupTime: request.pickupTime,
      
      // Vehicle and passenger info
      vehicleType: request.vehicleType,
      passengerCount: request.passengerCount,
      luggageCount: request.luggageCount,
      
      // Pricing
      basePrice: request.priceCalculation.basePrice,
      totalPrice: request.priceCalculation.totalPrice,
      distance: request.priceCalculation.distance,
      currency: 'USD',
      
      // Additional details
      flightNumber: request.customerInfo.flightNumber || '',
      specialRequests: request.customerInfo.specialRequests || '',
      extraServices: request.extraServices,
      
      // Status and assignment
      status,
      paymentStatus: request.paymentMethod === 'bank-transfer' ? 'pending' : 'pending',
      paymentMethod: request.paymentMethod,
      
      // Tracking
      confirmationCode: this.generateConfirmationCode(),
      qrCode: '', // Will be updated after QR generation
      
      // Assignment (will be done later by admin)
      driverId: '',
      vehicleId: '',
      
      // Metadata
      source: 'website',
      notes: ''
    };
  }

  /**
   * Send booking confirmations and notifications
   */
  private async sendBookingNotifications(
    reservationId: string, 
    request: BookingRequest, 
    customer: Customer, 
    paymentMethod: string
  ): Promise<void> {
    try {
      // Send email confirmation
      await notificationService.sendBookingConfirmation(
        customer.id!,
        reservationId,
        {
          customerName: `${customer.firstName} ${customer.lastName}`,
          route: `${request.transferType === 'airport-hotel' ? 'Airport → ' + request.destination.name : request.destination.name + ' → Airport'}`,
          date: request.pickupDate,
          time: request.pickupTime,
          totalPrice: request.priceCalculation.totalPrice,
          paymentMethod
        }
      );

      // Send SMS notification if enabled
      if (customer.communicationPreferences?.sms) {
        await notificationService.sendSMSNotification(
          customer.phone,
          `Rezervasyon onaylandı! Kod: ${reservationId.substring(0, 8)}. Detaylar e-posta adresinizde.`
        );
      }

    } catch (error) {
      console.error('Notification sending error:', error);
      // Don't throw error - booking should complete even if notifications fail
    }
  }

  /**
   * Generate a human-readable confirmation code
   */
  private generateConfirmationCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SBS${timestamp}${random}`;
  }

  /**
   * Check if booking system is enabled
   */
  private isBookingEnabled(): boolean {
    return import.meta.env.VITE_BOOKING_SYSTEM_ENABLED !== 'false';
  }

  /**
   * Check if real reservations are enabled
   */
  private isRealReservationsEnabled(): boolean {
    return import.meta.env.VITE_REAL_RESERVATIONS_ENABLED !== 'false';
  }

  /**
   * Complete a reservation after successful payment
   */
  async completeReservation(reservationId: string): Promise<boolean> {
    try {
      // This would be called from payment success callback
      // Update reservation status to confirmed
      // Send final confirmation notifications
      // Create commission record
      
      console.log('Completing reservation:', reservationId);
      return true;
    } catch (error) {
      console.error('Reservation completion error:', error);
      return false;
    }
  }
}

export const bookingService = BookingService.getInstance();