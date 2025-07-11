export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface NotificationData {
  recipient: {
    email?: string;
    phone?: string;
    name?: string;
  };
  variables?: Record<string, string>;
  attachments?: {
    filename: string;
    content: string | Blob;
    contentType: string;
  }[];
}

export interface NotificationLog {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  templateId?: string;
  subject?: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private static instance: NotificationService;
  private emailTemplates: Map<string, EmailTemplate> = new Map();
  private smsTemplates: Map<string, SMSTemplate> = new Map();
  private logs: NotificationLog[] = [];

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    this.initializeTemplates();
    this.loadLogs();
  }

  // Email service
  async sendEmail(
    templateId: string,
    data: NotificationData
  ): Promise<{ success: boolean; error?: string; logId?: string }> {
    try {
      const template = this.emailTemplates.get(templateId);
      if (!template) {
        throw new Error(`Email template ${templateId} not found`);
      }

      if (!data.recipient.email) {
        throw new Error('Email recipient is required');
      }

      // Process template variables
      let subject = template.subject;
      let htmlContent = template.htmlContent;
      let textContent = template.textContent;

      if (data.variables) {
        Object.entries(data.variables).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          subject = subject.replace(new RegExp(placeholder, 'g'), value);
          htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
          textContent = textContent.replace(new RegExp(placeholder, 'g'), value);
        });
      }

      // Create log entry
      const logId = this.generateLogId();
      const log: NotificationLog = {
        id: logId,
        type: 'email',
        recipient: data.recipient.email,
        templateId,
        subject,
        content: textContent,
        status: 'pending',
        timestamp: new Date(),
        metadata: {
          variables: data.variables,
          attachments: data.attachments?.map(a => ({ filename: a.filename, contentType: a.contentType })),
        },
      };

      this.logs.push(log);

      // Simulate email sending (in production, use actual email service)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Simulate occasional failures for realistic testing
      const success = Math.random() > 0.05; // 95% success rate

      if (success) {
        log.status = 'sent';
        this.saveLogs();
        
        console.log(`📧 Email sent to ${data.recipient.email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${textContent.substring(0, 100)}...`);
        
        return { success: true, logId };
      } else {
        const error = 'Mock email delivery failure';
        log.status = 'failed';
        log.error = error;
        this.saveLogs();
        
        return { success: false, error, logId };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Email sending error:', error);
      
      return { success: false, error: errorMessage };
    }
  }

  // SMS service
  async sendSMS(
    templateId: string,
    data: NotificationData
  ): Promise<{ success: boolean; error?: string; logId?: string }> {
    try {
      const template = this.smsTemplates.get(templateId);
      if (!template) {
        throw new Error(`SMS template ${templateId} not found`);
      }

      if (!data.recipient.phone) {
        throw new Error('Phone number is required for SMS');
      }

      // Process template variables
      let content = template.content;
      if (data.variables) {
        Object.entries(data.variables).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          content = content.replace(new RegExp(placeholder, 'g'), value);
        });
      }

      // Create log entry
      const logId = this.generateLogId();
      const log: NotificationLog = {
        id: logId,
        type: 'sms',
        recipient: data.recipient.phone,
        templateId,
        content,
        status: 'pending',
        timestamp: new Date(),
        metadata: {
          variables: data.variables,
        },
      };

      this.logs.push(log);

      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Simulate occasional failures
      const success = Math.random() > 0.02; // 98% success rate

      if (success) {
        log.status = 'sent';
        this.saveLogs();
        
        console.log(`📱 SMS sent to ${data.recipient.phone}`);
        console.log(`Content: ${content}`);
        
        return { success: true, logId };
      } else {
        const error = 'Mock SMS delivery failure';
        log.status = 'failed';
        log.error = error;
        this.saveLogs();
        
        return { success: false, error, logId };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('SMS sending error:', error);
      
      return { success: false, error: errorMessage };
    }
  }

  // Bulk notifications
  async sendBulkEmails(
    templateId: string,
    recipients: NotificationData[]
  ): Promise<{ success: number; failed: number; logs: string[] }> {
    const results = await Promise.allSettled(
      recipients.map(recipient => this.sendEmail(templateId, recipient))
    );

    const success = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - success;
    const logs = results
      .map((r, index) => {
        if (r.status === 'fulfilled' && r.value.logId) {
          return r.value.logId;
        }
        return `Failed for recipient ${index}`;
      })
      .filter(Boolean);

    return { success, failed, logs };
  }

  async sendBulkSMS(
    templateId: string,
    recipients: NotificationData[]
  ): Promise<{ success: number; failed: number; logs: string[] }> {
    const results = await Promise.allSettled(
      recipients.map(recipient => this.sendSMS(templateId, recipient))
    );

    const success = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - success;
    const logs = results
      .map((r, index) => {
        if (r.status === 'fulfilled' && r.value.logId) {
          return r.value.logId;
        }
        return `Failed for recipient ${index}`;
      })
      .filter(Boolean);

    return { success, failed, logs };
  }

  // Template management
  addEmailTemplate(template: EmailTemplate): void {
    this.emailTemplates.set(template.id, template);
  }

  addSMSTemplate(template: SMSTemplate): void {
    this.smsTemplates.set(template.id, template);
  }

  getEmailTemplate(id: string): EmailTemplate | undefined {
    return this.emailTemplates.get(id);
  }

  getSMSTemplate(id: string): SMSTemplate | undefined {
    return this.smsTemplates.get(id);
  }

  getAllEmailTemplates(): EmailTemplate[] {
    return Array.from(this.emailTemplates.values());
  }

  getAllSMSTemplates(): SMSTemplate[] {
    return Array.from(this.smsTemplates.values());
  }

  // Logging and analytics
  getLogs(filter?: {
    type?: 'email' | 'sms' | 'push';
    status?: 'sent' | 'failed' | 'pending';
    recipient?: string;
    since?: Date;
  }): NotificationLog[] {
    let logs = [...this.logs];

    if (filter) {
      if (filter.type) {
        logs = logs.filter(log => log.type === filter.type);
      }
      if (filter.status) {
        logs = logs.filter(log => log.status === filter.status);
      }
      if (filter.recipient) {
        logs = logs.filter(log => log.recipient.includes(filter.recipient!));
      }
      if (filter.since) {
        logs = logs.filter(log => log.timestamp >= filter.since!);
      }
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getNotificationStats() {
    const total = this.logs.length;
    const emails = this.logs.filter(l => l.type === 'email').length;
    const sms = this.logs.filter(l => l.type === 'sms').length;
    const sent = this.logs.filter(l => l.status === 'sent').length;
    const failed = this.logs.filter(l => l.status === 'failed').length;
    const pending = this.logs.filter(l => l.status === 'pending').length;

    return {
      total,
      emails,
      sms,
      sent,
      failed,
      pending,
      successRate: total > 0 ? (sent / total) * 100 : 0,
    };
  }

  private initializeTemplates(): void {
    // Reservation confirmation email
    this.addEmailTemplate({
      id: 'reservation-confirmation',
      name: 'Rezervasyon Onayı',
      subject: 'AYT Transfer - Rezervasyonunuz Onaylandı! (#{{reservationId}})',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2563eb;">Rezervasyonunuz Onaylandı!</h1>
          <p>Sayın {{customerName}},</p>
          <p>{{pickupDate}} tarihli transfer rezervasyonunuz başarıyla oluşturuldu.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Rezervasyon Detayları</h3>
            <p><strong>Rezervasyon No:</strong> {{reservationId}}</p>
            <p><strong>Rota:</strong> {{route}}</p>
            <p><strong>Tarih & Saat:</strong> {{pickupDate}} - {{pickupTime}}</p>
            <p><strong>Yolcu Sayısı:</strong> {{passengerCount}}</p>
            <p><strong>Araç Tipi:</strong> {{vehicleType}}</p>
            <p><strong>Toplam Tutar:</strong> ${{totalAmount}}</p>
          </div>
          
          <p>QR Kodunuz: <strong>{{qrCode}}</strong></p>
          <p>Transfer günü QR kodunuzu şoförümüze göstermeniz yeterli olacaktır.</p>
          
          <p>İyi yolculuklar!</p>
          <p><strong>AYT Transfer Ekibi</strong></p>
        </div>
      `,
      textContent: `
Rezervasyonunuz Onaylandı!

Sayın {{customerName}},
{{pickupDate}} tarihli transfer rezervasyonunuz başarıyla oluşturuldu.

Rezervasyon Detayları:
- Rezervasyon No: {{reservationId}}
- Rota: {{route}}
- Tarih & Saat: {{pickupDate}} - {{pickupTime}}
- Yolcu Sayısı: {{passengerCount}}
- Araç Tipi: {{vehicleType}}
- Toplam Tutar: ${{totalAmount}}

QR Kodunuz: {{qrCode}}
Transfer günü QR kodunuzu şoförümüze göstermeniz yeterli olacaktır.

İyi yolculuklar!
AYT Transfer Ekibi
      `,
      variables: ['customerName', 'reservationId', 'route', 'pickupDate', 'pickupTime', 'passengerCount', 'vehicleType', 'totalAmount', 'qrCode'],
    });

    // Driver assignment email
    this.addEmailTemplate({
      id: 'driver-assignment',
      name: 'Şoför Ataması',
      subject: 'Yeni Transfer Ataması - {{reservationId}}',
      htmlContent: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h1 style="color: #2563eb;">Yeni Transfer Ataması</h1>
          <p>Sayın {{driverName}},</p>
          <p>Size yeni bir transfer görevi atandı.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Transfer Detayları</h3>
            <p><strong>Rezervasyon No:</strong> {{reservationId}}</p>
            <p><strong>Müşteri:</strong> {{customerName}}</p>
            <p><strong>Telefon:</strong> {{customerPhone}}</p>
            <p><strong>Rota:</strong> {{route}}</p>
            <p><strong>Tarih & Saat:</strong> {{pickupDate}} - {{pickupTime}}</p>
            <p><strong>Yolcu Sayısı:</strong> {{passengerCount}}</p>
          </div>
          
          <p>Lütfen belirlenen saatte hazır olunuz.</p>
          <p><strong>AYT Transfer Yönetimi</strong></p>
        </div>
      `,
      textContent: `
Yeni Transfer Ataması

Sayın {{driverName}},
Size yeni bir transfer görevi atandı.

Transfer Detayları:
- Rezervasyon No: {{reservationId}}
- Müşteri: {{customerName}}
- Telefon: {{customerPhone}}
- Rota: {{route}}
- Tarih & Saat: {{pickupDate}} - {{pickupTime}}
- Yolcu Sayısı: {{passengerCount}}

Lütfen belirlenen saatte hazır olunuz.
AYT Transfer Yönetimi
      `,
      variables: ['driverName', 'reservationId', 'customerName', 'customerPhone', 'route', 'pickupDate', 'pickupTime', 'passengerCount'],
    });

    // SMS templates
    this.addSMSTemplate({
      id: 'reservation-sms',
      name: 'Rezervasyon SMS',
      content: 'AYT Transfer: Rezervasyonunuz onaylandı! {{reservationId}} - {{pickupDate}} {{pickupTime}}. QR: {{qrCode}}',
      variables: ['reservationId', 'pickupDate', 'pickupTime', 'qrCode'],
    });

    this.addSMSTemplate({
      id: 'driver-assignment-sms',
      name: 'Şoför Atama SMS',
      content: 'AYT Transfer: Yeni görev! {{reservationId}} - {{customerName}} - {{pickupDate}} {{pickupTime}}',
      variables: ['reservationId', 'customerName', 'pickupDate', 'pickupTime'],
    });
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private saveLogs(): void {
    try {
      localStorage.setItem('ayt_notification_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving notification logs:', error);
    }
  }

  private loadLogs(): void {
    try {
      const saved = localStorage.getItem('ayt_notification_logs');
      if (saved) {
        const logs = JSON.parse(saved);
        this.logs = logs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading notification logs:', error);
    }
  }
}

export const notificationService = NotificationService.getInstance();