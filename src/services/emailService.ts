import { notificationService } from './communication';

export interface EmailData {
  customerName: string;
  customerEmail: string;
  reservationId: string;
  transferType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengerCount: string;
  vehicleType: string;
  totalAmount: string;
  qrCode: string;
}

/**
 * Send confirmation email with QR code attachment
 */
export const sendConfirmationEmail = async (
  email: string, 
  reservationId: string, 
  qrCode: string,
  bookingData?: Partial<EmailData>
): Promise<boolean> => {
  try {
    // Create customer ID from email for notification service
    const customerId = `customer-${email.replace(/[^a-zA-Z0-9]/g, '-')}`;
    
    // Prepare email data with defaults
    const emailData: Record<string, string> = {
      customerEmail: email,
      reservationId,
      qrCode,
      customerName: bookingData?.customerName || 'Değerli Müşteri',
      transferType: bookingData?.transferType || 'Transfer',
      pickupLocation: bookingData?.pickupLocation || 'Antalya Havalimanı',
      dropoffLocation: bookingData?.dropoffLocation || 'Otel',
      pickupDate: bookingData?.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: bookingData?.pickupTime || '12:00',
      passengerCount: bookingData?.passengerCount || '1',
      vehicleType: bookingData?.vehicleType || 'Standard',
      totalAmount: bookingData?.totalAmount || '0'
    };

    // Use the existing notification service
    const result = await notificationService.sendBookingConfirmation(
      customerId,
      reservationId,
      emailData
    );

    return result.success;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmationEmail = async (
  email: string,
  reservationId: string,
  paymentData: {
    amount: string;
    method: string;
    transactionId: string;
  }
): Promise<boolean> => {
  try {
    const customerId = `customer-${email.replace(/[^a-zA-Z0-9]/g, '-')}`;
    
    const emailData: Record<string, string> = {
      customerEmail: email,
      reservationId,
      amount: paymentData.amount,
      paymentMethod: paymentData.method,
      transactionId: paymentData.transactionId,
      paymentDate: new Date().toLocaleDateString('tr-TR')
    };

    const result = await notificationService.sendPaymentSuccess(
      customerId,
      reservationId,
      emailData
    );

    return result.success;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
};

/**
 * Send QR code via email/SMS/WhatsApp
 */
export const sendQRCode = async (
  customerId: string,
  reservationId: string,
  qrCode: string,
  customerData: {
    email: string;
    phone: string;
    name: string;
  }
): Promise<boolean> => {
  try {
    const qrData: Record<string, string> = {
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      customerName: customerData.name,
      reservationId,
      qrCode,
      qrCodeUrl: `${window.location.origin}/verify/${qrCode}`
    };

    const result = await notificationService.sendQRCode(
      customerId,
      reservationId,
      qrData
    );

    return result.success;
  } catch (error) {
    console.error('Error sending QR code:', error);
    return false;
  }
};