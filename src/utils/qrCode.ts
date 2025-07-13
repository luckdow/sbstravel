import { v4 as uuidv4 } from 'uuid';

export function generateQRCode(): string {
  return uuidv4();
}

export function generateQRCodeData(reservationId: string, qrCode: string): string {
  // Generate URL that points to customer reservation view instead of admin
  const baseUrl = window.location.origin;
  const customerViewUrl = `${baseUrl}/reservation/${reservationId}?qr=${qrCode}`;
  
  return JSON.stringify({
    reservationId,
    qrCode,
    url: customerViewUrl,
    timestamp: Date.now()
  });
}

export function generateCustomerViewURL(reservationId: string, qrCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/reservation/${reservationId}?qr=${qrCode}`;
}