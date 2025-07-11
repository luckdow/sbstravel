import { v4 as uuidv4 } from 'uuid';

export function generateQRCode(): string {
  return `QR_${uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase()}`;
}

export function generateQRCodeData(reservationId: string, qrCode: string): string {
  return JSON.stringify({
    reservationId,
    qrCode,
    timestamp: Date.now(),
    type: 'antalya_transfer'
  });
}

export function validateQRCode(qrData: string): { valid: boolean; reservationId?: string; qrCode?: string } {
  try {
    const parsed = JSON.parse(qrData);
    
    if (parsed.type === 'antalya_transfer' && parsed.reservationId && parsed.qrCode) {
      return {
        valid: true,
        reservationId: parsed.reservationId,
        qrCode: parsed.qrCode
      };
    }
    
    return { valid: false };
  } catch (error) {
    return { valid: false };
  }
}