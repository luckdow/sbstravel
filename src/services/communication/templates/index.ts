import { EmailTemplate, SMSTemplate, WhatsAppTemplate } from '../../../types';

// Email Templates
export const emailTemplates: Record<string, EmailTemplate> = {
  // Booking Confirmation
  'booking_confirmation_tr': {
    id: 'booking_confirmation_tr',
    name: 'Rezervasyon Onayı',
    subject: 'SBS Travel - Rezervasyon Onayınız #{bookingId}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Rezervasyon Onayı</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .booking-details { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .qr-section { text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
        .btn { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚐 SBS Travel</h1>
            <h2>Rezervasyon Onayınız</h2>
        </div>
        
        <div class="content">
            <p>Sayın <strong>{customerName}</strong>,</p>
            <p>Rezervasyonunuz başarıyla oluşturulmuştur. Detaylar aşağıdadır:</p>
            
            <div class="booking-details">
                <h3>📋 Rezervasyon Detayları</h3>
                <p><strong>Rezervasyon No:</strong> {bookingId}</p>
                <p><strong>Transfer Tipi:</strong> {transferType}</p>
                <p><strong>Alış Yeri:</strong> {pickupLocation}</p>
                <p><strong>Varış Yeri:</strong> {dropoffLocation}</p>
                <p><strong>Tarih & Saat:</strong> {pickupDate} {pickupTime}</p>
                <p><strong>Yolcu Sayısı:</strong> {passengerCount}</p>
                <p><strong>Araç Tipi:</strong> {vehicleType}</p>
                <p><strong>Toplam Tutar:</strong> {totalPrice} TL</p>
            </div>
            
            <div class="qr-section">
                <h3>📱 QR Kodunuz</h3>
                <p>Bu QR kodu şoföre göstermeniz gerekmektedir:</p>
                <p><strong>{qrCode}</strong></p>
            </div>
            
            <p>Transfer saatinden 15 dakika önce hazır olmanızı rica ederiz. Şoförümüz sizinle WhatsApp veya telefon ile iletişime geçecektir.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://sbstravel.com/booking/{bookingId}" class="btn">Rezervasyonu Görüntüle</a>
            </div>
        </div>
        
        <div class="footer">
            <p>SBS Travel - Antalya Transfer Hizmeti</p>
            <p>📞 +90 XXX XXX XXXX | 📧 info@sbstravel.com</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `SBS Travel - Rezervasyon Onayı

Sayın {customerName},

Rezervasyonunuz başarıyla oluşturulmuştur.

Rezervasyon No: {bookingId}
Transfer Tipi: {transferType}
Alış Yeri: {pickupLocation}
Varış Yeri: {dropoffLocation}
Tarih & Saat: {pickupDate} {pickupTime}
Yolcu Sayısı: {passengerCount}
Araç Tipi: {vehicleType}
Toplam Tutar: {totalPrice} TL

QR Kodunuz: {qrCode}

Bu QR kodu şoföre göstermeniz gerekmektedir.

SBS Travel`,
    variables: ['customerName', 'bookingId', 'transferType', 'pickupLocation', 'dropoffLocation', 'pickupDate', 'pickupTime', 'passengerCount', 'vehicleType', 'totalPrice', 'qrCode'],
    language: 'tr',
    category: 'booking'
  },

  // Payment Success
  'payment_success_tr': {
    id: 'payment_success_tr',
    name: 'Ödeme Başarılı',
    subject: 'SBS Travel - Ödemeniz Alındı #{bookingId}',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ödeme Başarılı</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
        .payment-details { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚐 SBS Travel</h1>
            <h2>Ödeme Başarılı</h2>
        </div>
        
        <div class="content">
            <div class="success-icon">✅</div>
            
            <p>Sayın <strong>{customerName}</strong>,</p>
            <p>Ödemeniz başarıyla alınmıştır. Transfer rezervasyonunuz onaylanmıştır.</p>
            
            <div class="payment-details">
                <h3>💳 Ödeme Detayları</h3>
                <p><strong>Rezervasyon No:</strong> {bookingId}</p>
                <p><strong>Ödeme ID:</strong> {paymentId}</p>
                <p><strong>Tutar:</strong> {amount} TL</p>
                <p><strong>Ödeme Tarihi:</strong> {paymentDate}</p>
                <p><strong>Durum:</strong> ✅ Başarılı</p>
            </div>
            
            <p>Transfer detaylarınız ve QR kodunuz ayrı bir e-posta ile gönderilmiştir.</p>
        </div>
        
        <div class="footer">
            <p>SBS Travel - Antalya Transfer Hizmeti</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `SBS Travel - Ödeme Başarılı

Sayın {customerName},

Ödemeniz başarıyla alınmıştır.

Rezervasyon No: {bookingId}
Ödeme ID: {paymentId}
Tutar: {amount} TL
Ödeme Tarihi: {paymentDate}
Durum: Başarılı

Transfer detaylarınız ayrı bir e-posta ile gönderilmiştir.

SBS Travel`,
    variables: ['customerName', 'bookingId', 'paymentId', 'amount', 'paymentDate'],
    language: 'tr',
    category: 'payment'
  },

  // Transfer Reminder
  'transfer_reminder_tr': {
    id: 'transfer_reminder_tr',
    name: 'Transfer Hatırlatıcı',
    subject: 'SBS Travel - Transferiniz {hours} Saat Sonra',
    htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Transfer Hatırlatıcı</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .reminder-details { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚐 SBS Travel</h1>
            <h2>Transfer Hatırlatıcı</h2>
        </div>
        
        <div class="content">
            <p>Sayın <strong>{customerName}</strong>,</p>
            <p>Transferiniz <strong>{hours} saat</strong> sonra başlayacaktır.</p>
            
            <div class="reminder-details">
                <h3>⏰ Transfer Detayları</h3>
                <p><strong>Rezervasyon No:</strong> {bookingId}</p>
                <p><strong>Alış Yeri:</strong> {pickupLocation}</p>
                <p><strong>Tarih & Saat:</strong> {pickupDate} {pickupTime}</p>
                <p><strong>Şoför:</strong> {driverName}</p>
                <p><strong>Araç Plakası:</strong> {vehiclePlate}</p>
                <p><strong>QR Kodunuz:</strong> {qrCode}</p>
            </div>
            
            <p><strong>Önemli Notlar:</strong></p>
            <ul>
                <li>Lütfen transferden 15 dakika önce hazır olun</li>
                <li>QR kodunuzu şoföre göstermeyi unutmayın</li>
                <li>Şoförümüz sizinle iletişime geçecektir</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>SBS Travel - Antalya Transfer Hizmeti</p>
        </div>
    </div>
</body>
</html>`,
    textContent: `SBS Travel - Transfer Hatırlatıcı

Sayın {customerName},

Transferiniz {hours} saat sonra başlayacaktır.

Rezervasyon No: {bookingId}
Alış Yeri: {pickupLocation}
Tarih & Saat: {pickupDate} {pickupTime}
Şoför: {driverName}
Araç Plakası: {vehiclePlate}
QR Kodunuz: {qrCode}

Lütfen transferden 15 dakika önce hazır olun ve QR kodunuzu şoföre göstermeyi unutmayın.

SBS Travel`,
    variables: ['customerName', 'hours', 'bookingId', 'pickupLocation', 'pickupDate', 'pickupTime', 'driverName', 'vehiclePlate', 'qrCode'],
    language: 'tr',
    category: 'reminder'
  }
};

// SMS Templates
export const smsTemplates: Record<string, SMSTemplate> = {
  'booking_confirmation_tr': {
    id: 'booking_confirmation_tr',
    name: 'Rezervasyon Onayı SMS',
    content: 'SBS Travel: Rezervasyonunuz onaylandı. Ref: {bookingId}. Transfer: {pickupDate} {pickupTime}. QR: {qrCode}. Detaylar email ile gönderildi.',
    variables: ['bookingId', 'pickupDate', 'pickupTime', 'qrCode'],
    language: 'tr',
    category: 'booking'
  },

  'otp_verification_tr': {
    id: 'otp_verification_tr',
    name: 'OTP Doğrulama',
    content: 'SBS Travel doğrulama kodunuz: {otp}. Bu kod 5 dakika geçerlidir. Kimseyle paylaşmayın.',
    variables: ['otp'],
    language: 'tr',
    category: 'otp'
  },

  'transfer_reminder_tr': {
    id: 'transfer_reminder_tr',
    name: 'Transfer Hatırlatıcı SMS',
    content: 'SBS Travel: Transferiniz {hours} saat sonra. Şoför: {driverName}, Plaka: {vehiclePlate}. QR: {qrCode}. 15 dk önce hazır olun.',
    variables: ['hours', 'driverName', 'vehiclePlate', 'qrCode'],
    language: 'tr',
    category: 'reminder'
  },

  'payment_success_tr': {
    id: 'payment_success_tr',
    name: 'Ödeme Başarılı SMS',
    content: 'SBS Travel: Ödemeniz alındı. Tutar: {amount} TL. Ref: {bookingId}. Transfer detayları email ile gönderildi.',
    variables: ['amount', 'bookingId'],
    language: 'tr',
    category: 'payment'
  },

  'qr_code_tr': {
    id: 'qr_code_tr',
    name: 'QR Kod SMS',
    content: 'SBS Travel QR kodunuz: {qrCode}. Bu kodu şoföre gösterin. Ref: {bookingId}.',
    variables: ['qrCode', 'bookingId'],
    language: 'tr',
    category: 'booking'
  },

  'cancellation_tr': {
    id: 'cancellation_tr',
    name: 'İptal Bildirimi SMS',
    content: 'SBS Travel: Rezervasyonunuz iptal edildi. Ref: {bookingId}. İade işlemi 3-5 iş günü sürecektir.',
    variables: ['bookingId'],
    language: 'tr',
    category: 'booking'
  }
};

// WhatsApp Templates
export const whatsAppTemplates: Record<string, WhatsAppTemplate> = {
  'booking_confirmation_tr': {
    id: 'booking_confirmation_tr',
    name: 'Rezervasyon Onayı WhatsApp',
    content: `🚐 *SBS Travel - Rezervasyon Onayı*

Merhaba *{customerName}*,

✅ Rezervasyonunuz başarıyla oluşturuldu!

📋 *Detaylar:*
• Rezervasyon No: {bookingId}
• Transfer: {transferType}
• Alış: {pickupLocation}
• Varış: {dropoffLocation}
• Tarih: {pickupDate} {pickupTime}
• Yolcu: {passengerCount}
• Araç: {vehicleType}
• Tutar: {totalPrice} TL

📱 *QR Kodunuz:* {qrCode}
(Bu kodu şoföre gösterin)

Şoförümüz transferden önce sizinle iletişime geçecektir.

Teşekkürler! 🙏`,
    variables: ['customerName', 'bookingId', 'transferType', 'pickupLocation', 'dropoffLocation', 'pickupDate', 'pickupTime', 'passengerCount', 'vehicleType', 'totalPrice', 'qrCode'],
    language: 'tr',
    category: 'booking',
    mediaType: 'text'
  },

  'transfer_reminder_tr': {
    id: 'transfer_reminder_tr',
    name: 'Transfer Hatırlatıcı WhatsApp',
    content: `🚐 *SBS Travel - Transfer Hatırlatıcı*

Merhaba *{customerName}*,

⏰ Transferiniz *{hours} saat* sonra!

📍 *Transfer Bilgileri:*
• Alış Yeri: {pickupLocation}
• Tarih & Saat: {pickupDate} {pickupTime}
• Şoför: {driverName}
• Plaka: {vehiclePlate}
• QR Kod: {qrCode}

📞 Şoför iletişim: {driverPhone}

⚠️ *Önemli:*
• 15 dk önce hazır olun
• QR kodu hazır bulundurun
• Şoför sizi arayacak

İyi yolculuklar! 🛣️`,
    variables: ['customerName', 'hours', 'pickupLocation', 'pickupDate', 'pickupTime', 'driverName', 'vehiclePlate', 'qrCode', 'driverPhone'],
    language: 'tr',
    category: 'reminder',
    mediaType: 'text'
  },

  'qr_code_share_tr': {
    id: 'qr_code_share_tr',
    name: 'QR Kod Paylaşım WhatsApp',
    content: `📱 *SBS Travel - QR Kodunuz*

Rezervasyon: *{bookingId}*

QR Kodunuz: *{qrCode}*

Bu kodu şoföre göstererek transferinizi başlatabilirsiniz.

Not: QR kodu kimseyle paylaşmayın.`,
    variables: ['bookingId', 'qrCode'],
    language: 'tr',
    category: 'booking',
    mediaType: 'image'
  },

  'driver_assigned_tr': {
    id: 'driver_assigned_tr',
    name: 'Şoför Atama WhatsApp',
    content: `🚗 *SBS Travel - Şoför Atandı*

Merhaba *{customerName}*,

Transferinize şoför atanmıştır:

👨‍💼 *Şoför:* {driverName}
📞 *Telefon:* {driverPhone}
🚗 *Araç:* {vehicleModel}
🔢 *Plaka:* {vehiclePlate}
⭐ *Puan:* {driverRating}/5

📍 *Transfer:* {pickupDate} {pickupTime}
📍 *Konum:* {pickupLocation}

Şoförünüz yaklaştığında sizinle iletişime geçecektir.`,
    variables: ['customerName', 'driverName', 'driverPhone', 'vehicleModel', 'vehiclePlate', 'driverRating', 'pickupDate', 'pickupTime', 'pickupLocation'],
    language: 'tr',
    category: 'notification',
    mediaType: 'text'
  },

  'payment_link_tr': {
    id: 'payment_link_tr',
    name: 'Ödeme Linki WhatsApp',
    content: `💳 *SBS Travel - Ödeme*

Rezervasyon: *{bookingId}*
Tutar: *{amount} TL*

Güvenli ödeme için aşağıdaki linki kullanın:
{paymentLink}

⚠️ Link 30 dakika geçerlidir.
❓ Sorularınız için bize yazabilirsiniz.`,
    variables: ['bookingId', 'amount', 'paymentLink'],
    language: 'tr',
    category: 'payment',
    mediaType: 'text'
  }
};

// Template helper functions
export const getTemplate = (type: 'email' | 'sms' | 'whatsapp', templateId: string) => {
  switch (type) {
    case 'email':
      return emailTemplates[templateId];
    case 'sms':
      return smsTemplates[templateId];
    case 'whatsapp':
      return whatsAppTemplates[templateId];
    default:
      return null;
  }
};

export const renderTemplate = (template: string, variables: Record<string, string>): string => {
  let rendered = template;
  
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return rendered;
};

export const validateTemplateVariables = (template: string, variables: Record<string, string>): string[] => {
  const requiredVars = template.match(/{(\w+)}/g)?.map(match => match.slice(1, -1)) || [];
  const missing = requiredVars.filter(varName => !variables[varName]);
  return missing;
};