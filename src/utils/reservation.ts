/**
 * Utility functions for reservation management
 */

import { createReservation, createCustomer, getCustomerByEmail } from '../lib/firebase/collections';
import { generateReservationQRCode } from './qrCode';
import { BookingFormData, Reservation, Customer } from '../types';

export interface CreateNewReservationData extends BookingFormData {
  distance?: number;
  totalPrice?: number;
}

/**
 * Creates a new reservation with customer auto-registration
 */
export const createNewReservation = async (data: CreateNewReservationData): Promise<string> => {
  try {
    // 1. Check if customer exists, if not create one
    let customer = await getCustomerByEmail(data.customerInfo.email);
    let customerId: string;
    
    if (!customer) {
      // Auto-register customer
      const customerData: Omit<Customer, 'id' | 'createdAt'> = {
        firstName: data.customerInfo.firstName,
        lastName: data.customerInfo.lastName,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone,
        totalReservations: 0,
        totalSpent: 0,
        status: 'active'
      };
      
      customerId = await createCustomer(customerData);
    } else {
      customerId = customer.id!;
    }

    // 2. Generate QR code for this reservation
    const tempReservationId = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = await generateReservationQRCode(tempReservationId);

    // 3. Prepare reservation data
    const reservationData: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'> = {
      customerId,
      customerName: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
      customerEmail: data.customerInfo.email,
      customerPhone: data.customerInfo.phone,
      
      // Transfer details
      transferType: data.transferType,
      pickupLocation: data.transferType === 'airport-hotel' ? 'Antalya Havalimanı' : data.destination.name,
      dropoffLocation: data.transferType === 'airport-hotel' ? data.destination.name : 'Antalya Havalimanı',
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      
      // Passenger details
      passengerCount: data.passengerCount,
      baggageCount: data.baggageCount || 0,
      
      // Vehicle and pricing
      vehicleType: data.vehicleType as 'standard' | 'premium' | 'luxury',
      distance: data.distance || 50, // Default distance if not provided
      basePrice: data.totalPrice || 250, // Default price if not provided
      additionalServices: data.additionalServices?.map(serviceId => ({
        id: serviceId,
        name: serviceId,
        price: 0 // This should be calculated from actual service data
      })) || [],
      totalPrice: data.totalPrice || 250,
      
      // Status and assignment
      status: 'pending',
      
      // QR Code and payment
      qrCode,
      paymentStatus: 'pending'
    };

    // 4. Create the reservation
    const reservationId = await createReservation(reservationData);
    
    return reservationId;
  } catch (error) {
    console.error('Error creating new reservation:', error);
    throw new Error('Rezervasyon oluşturulurken hata oluştu');
  }
};

/**
 * Generates a readable reservation number in SBS-XXX format
 * @param rawId - Raw Firebase ID or any string ID
 * @param index - Optional index number for sequential numbering
 * @returns Formatted reservation number like "SBS-101"
 */
export function generateReadableReservationNumber(rawId: string, index?: number): string {
  if (index !== undefined) {
    // Use sequential numbering starting from 101
    return `SBS-${(101 + index).toString()}`;
  }
  
  // Generate from hash of rawId for consistency
  const hash = rawId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffff;
  }, 0);
  
  // Ensure it's always a 3-digit number starting from 101
  const number = 101 + (Math.abs(hash) % 899); // 101-999 range
  return `SBS-${number}`;
}

/**
 * Maps raw reservation ID to readable format
 * @param reservations - Array of reservations to process
 * @returns Array with readable reservation numbers
 */
export function addReadableReservationNumbers<T extends { id?: string }>(reservations: T[]): (T & { readableId: string })[] {
  return reservations.map((reservation, index) => ({
    ...reservation,
    readableId: generateReadableReservationNumber(reservation.id || `temp-${index}`, index)
  }));
}

/**
 * Finds a driver by ID and returns their full name
 * @param driverId - Driver ID to search for
 * @param drivers - Array of drivers
 * @returns Driver's full name or "Atanmadı" if not found
 */
export function getDriverDisplayName(driverId: string | undefined, drivers: Array<{ id?: string; firstName: string; lastName: string }>): string {
  if (!driverId) return 'Atanmadı';
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) return 'Bilinmeyen Şoför';
  
  return `${driver.firstName} ${driver.lastName}`;
}