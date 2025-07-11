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