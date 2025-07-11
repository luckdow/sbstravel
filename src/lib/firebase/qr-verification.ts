import { updateReservation, getReservation } from './collections';

export const verifyQRCode = async (reservationId: string, qrCode: string) => {
  try {
    const reservation = await getReservation(reservationId);
    
    if (!reservation) {
      return { success: false, message: 'Rezervasyon bulunamadı' };
    }
    
    if (reservation.qrCode !== qrCode) {
      return { success: false, message: 'QR kod geçersiz' };
    }
    
    if (reservation.status === 'completed') {
      return { success: false, message: 'Bu transfer zaten tamamlanmış' };
    }
    
    if (reservation.status === 'cancelled') {
      return { success: false, message: 'Bu transfer iptal edilmiş' };
    }
    
    // Update reservation status
    await updateReservation(reservationId, {
      status: 'started'
    });
    
    return { 
      success: true, 
      message: 'Transfer başarıyla başlatıldı',
      reservation 
    };
    
  } catch (error) {
    console.error('QR verification error:', error);
    return { success: false, message: 'Doğrulama sırasında hata oluştu' };
  }
};

export const completeTransfer = async (reservationId: string) => {
  try {
    await updateReservation(reservationId, {
      status: 'completed'
    });
    
    return { success: true, message: 'Transfer başarıyla tamamlandı' };
  } catch (error) {
    console.error('Transfer completion error:', error);
    return { success: false, message: 'Transfer tamamlanırken hata oluştu' };
  }
};