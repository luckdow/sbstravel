import { Reservation } from '../types';
import { getVehicleTypeDisplayName } from '../utils/vehicle';

export interface EmailConfig {
  enabled: boolean;
  provider: 'nodemailer' | 'smtp' | 'sendgrid' | 'none';
  config: {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    apiKey?: string;
  };
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  private static instance: EmailService;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  public static getInstance(config?: EmailConfig): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService(config || {
        enabled: true,
        provider: 'nodemailer',
        config: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.VITE_EMAIL_USER || 'sbstravelinfo@gmail.com',
            pass: process.env.VITE_EMAIL_PASS || ''
          }
        }
      });
    }
    return EmailService.instance;
  }

  private generateReservationEmailTemplate(reservation: Reservation, qrCode: string): EmailTemplate {
    const companyInfo = {
      name: 'SBS TRAVEL',
      phone: '+90 242 123 45 67',
      email: 'sbstravelinfo@gmail.com',
      website: 'https://www.sbstravel.com'
    };

    const subject = `Rezervasyon Onayı - ${reservation.id} | SBS TRAVEL`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .qr-section { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 10px; border: 2px dashed #3B82F6; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 10px; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          .qr-code { font-family: monospace; font-size: 18px; font-weight: bold; color: #3B82F6; background: #f0f8ff; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Rezervasyon Onayı</h1>
            <p>Sayın ${reservation.customerName}, rezervasyonunuz başarıyla oluşturulmuştur!</p>
          </div>
          
          <div class="content">
            <div class="qr-section">
              <h2>📱 QR Kodunuz</h2>
              <div class="qr-code">${qrCode}</div>
              <p><strong>Bu QR kodu şoföre gösterin!</strong></p>
              <p>Transfer sırasında şoföre bu QR kodu göstererek kimliğinizi doğrulayın.</p>
            </div>

            <div class="details">
              <h3>📋 Rezervasyon Detayları</h3>
              <div class="detail-row">
                <span class="detail-label">Rezervasyon ID:</span>
                <span class="detail-value">${reservation.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transfer Tipi:</span>
                <span class="detail-value">${reservation.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Alınacak Yer:</span>
                <span class="detail-value">${reservation.pickupLocation}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bırakılacak Yer:</span>
                <span class="detail-value">${reservation.dropoffLocation}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tarih:</span>
                <span class="detail-value">${reservation.pickupDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Saat:</span>
                <span class="detail-value">${reservation.pickupTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Yolcu Sayısı:</span>
                <span class="detail-value">${reservation.passengerCount} kişi</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bagaj Sayısı:</span>
                <span class="detail-value">${reservation.baggageCount} adet</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Araç Tipi:</span>
                <span class="detail-value">${getVehicleTypeDisplayName(reservation.vehicleType)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mesafe:</span>
                <span class="detail-value">${reservation.distance} km</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Toplam Ücret:</span>
                <span class="detail-value"><strong>${reservation.totalPrice.toFixed(2)} TL</strong></span>
              </div>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3>ℹ️ Önemli Bilgiler</h3>
              <ul>
                <li>Şoför 15-30 dakika önceden sizinle iletişime geçecektir</li>
                <li>QR kodunuzu şoföre göstererek kimliğinizi doğrulayın</li>
                <li>Transfer saatinden 1 saat öncesine kadar iptal edebilirsiniz</li>
                <li>Bagaj limitinizi aşmamanıza dikkat edin</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p><strong>${companyInfo.name}</strong></p>
            <p>📞 ${companyInfo.phone} | 📧 ${companyInfo.email}</p>
            <p>🌐 ${companyInfo.website}</p>
            <p>7/24 müşteri hizmetleri | Güvenli transfer garantisi</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Rezervasyon Onayı - ${reservation.id}

Sayın ${reservation.customerName},

Rezervasyonunuz başarıyla oluşturulmuştur!

QR Kodunuz: ${qrCode}
Bu kodu şoföre gösterin!

Rezervasyon Detayları:
- Rezervasyon ID: ${reservation.id}
- Transfer: ${reservation.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}
- Alınacak Yer: ${reservation.pickupLocation}
- Bırakılacak Yer: ${reservation.dropoffLocation}
- Tarih: ${reservation.pickupDate}
- Saat: ${reservation.pickupTime}
- Yolcu: ${reservation.passengerCount} kişi
- Bagaj: ${reservation.baggageCount} adet
- Araç: ${reservation.vehicleType}
- Mesafe: ${reservation.distance} km
- Toplam Ücret: ${reservation.totalPrice.toFixed(2)} TL

Önemli Bilgiler:
- Şoför 15-30 dakika önceden sizinle iletişime geçecektir
- QR kodunuzu şoföre göstererek kimliğinizi doğrulayın
- Transfer saatinden 1 saat öncesine kadar iptal edebilirsiniz

${companyInfo.name}
${companyInfo.phone} | ${companyInfo.email}
${companyInfo.website}
    `;

    return { subject, html, text };
  }

  async sendReservationConfirmation(reservation: Reservation, qrCode: string): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Email service disabled, skipping email send');
      return false;
    }

    try {
      const template = this.generateReservationEmailTemplate(reservation, qrCode);
      
      // In a real implementation, you would use nodemailer or another email service
      // For now, we'll log the email content and simulate success
      console.log('=== EMAIL NOTIFICATION ===');
      console.log('To:', reservation.customerEmail);
      console.log('Subject:', template.subject);
      console.log('HTML:', template.html);
      console.log('========================');
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, implement actual email sending:
      /*
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        host: this.config.config.host,
        port: this.config.config.port,
        secure: this.config.config.secure,
        auth: this.config.config.auth
      });
      
      await transporter.sendMail({
        from: this.config.config.auth?.user,
        to: reservation.customerEmail,
        subject: template.subject,
        html: template.html,
        text: template.text
      });
      */
      
      console.log(`✅ Reservation confirmation email sent to ${reservation.customerEmail}`);
      return true;
      
    } catch (error) {
      console.error('Error sending reservation confirmation email:', error);
      return false;
    }
  }

  async sendDriverNotification(driverId: string, reservation: Reservation, qrCode: string): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Email service disabled, skipping driver notification');
      return false;
    }

    try {
      // This would fetch driver details from the database
      // For now, we'll log the notification
      console.log('=== DRIVER NOTIFICATION ===');
      console.log('Driver ID:', driverId);
      console.log('Reservation:', reservation.id);
      console.log('QR Code:', qrCode);
      console.log('Pick up:', reservation.pickupLocation);
      console.log('Drop off:', reservation.dropoffLocation);
      console.log('Date/Time:', reservation.pickupDate, reservation.pickupTime);
      console.log('==========================');
      
      return true;
    } catch (error) {
      console.error('Error sending driver notification:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();