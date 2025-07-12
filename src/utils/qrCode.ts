import { v4 as uuidv4 } from 'uuid';

export function generateQRCode(): string {
  return uuidv4();
}

export function generateQRCodeData(reservationId: string, qrCode: string): string {
  return JSON.stringify({
    reservationId,
    qrCode,
    timestamp: Date.now()
  });
}

// Enhanced QR code generation for reservations
export async function generateReservationQRCode(reservationId: string): Promise<string> {
  const qrData = {
    id: reservationId,
    timestamp: Date.now(),
    type: 'reservation',
    verification: `SBS-${Date.now().toString(36).toUpperCase()}`
  };
  
  // Generate a unique QR code string
  const qrCode = `SBS-${reservationId}-${Date.now().toString(36).toUpperCase()}`;
  
  return qrCode;
}