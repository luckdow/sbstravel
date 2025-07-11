import { EmailService, EmailSendOptions, EmailSendResult } from './email/EmailService';
import { SMSService, SMSSendOptions, SMSSendResult } from './sms/SMSService';
import { WhatsAppService, WhatsAppSendResult } from './whatsapp/WhatsAppService';
import { NotificationMessage, NotificationPreferences, NotificationChannel } from '../../types';
import { getTemplate, renderTemplate, validateTemplateVariables } from './templates';

export interface NotificationOptions {
  customerId: string;
  reservationId?: string;
  template: string;
  variables: Record<string, string>;
  channels?: NotificationChannel;
  immediate?: boolean;
  scheduledAt?: Date;
}

export interface NotificationResult {
  success: boolean;
  results: {
    email?: EmailSendResult;
    sms?: SMSSendResult;
    whatsapp?: WhatsAppSendResult;
  };
  errors: string[];
}

export interface NotificationServiceConfig {
  emailService: EmailService;
  smsService: SMSService;
  whatsAppService: WhatsAppService;
  defaultChannels: NotificationChannel;
}

export class NotificationService {
  private emailService: EmailService;
  private smsService: SMSService;
  private whatsAppService: WhatsAppService;
  private defaultChannels: NotificationChannel;

  // Mock customer preferences storage (in real app, this would be database)
  private customerPreferences: Map<string, NotificationPreferences> = new Map();

  constructor(config: NotificationServiceConfig) {
    this.emailService = config.emailService;
    this.smsService = config.smsService;
    this.whatsAppService = config.whatsAppService;
    this.defaultChannels = config.defaultChannels;
  }

  async sendNotification(options: NotificationOptions): Promise<NotificationResult> {
    const results: NotificationResult = {
      success: false,
      results: {},
      errors: []
    };

    try {
      // Get customer preferences
      const preferences = this.getCustomerPreferences(options.customerId);
      
      // Determine which channels to use
      const channels = options.channels || preferences.channels || this.defaultChannels;

      // Validate if customer has opted out
      if (preferences.optOut) {
        results.errors.push('Customer has opted out of notifications');
        return results;
      }

      const language = preferences.language || 'tr';

      // Send via each enabled channel with fallback strategy
      if (channels.whatsapp && this.whatsAppService.isAvailable()) {
        try {
          results.results.whatsapp = await this.sendWhatsAppNotification(options, language);
          if (results.results.whatsapp.success) {
            results.success = true;
          }
        } catch (error) {
          results.errors.push(`WhatsApp: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // If WhatsApp failed or not enabled, try SMS
      if ((!results.results.whatsapp?.success && channels.sms) || (channels.sms && !channels.whatsapp)) {
        try {
          results.results.sms = await this.sendSMSNotification(options, language);
          if (results.results.sms.success) {
            results.success = true;
          }
        } catch (error) {
          results.errors.push(`SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Always try email if enabled (independent of other channels)
      if (channels.email) {
        try {
          results.results.email = await this.sendEmailNotification(options, language);
          if (results.results.email.success) {
            results.success = true;
          }
        } catch (error) {
          results.errors.push(`Email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return results;

    } catch (error) {
      results.errors.push(`Notification service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return results;
    }
  }

  private async sendEmailNotification(options: NotificationOptions, language: string): Promise<EmailSendResult> {
    const templateId = `${options.template}_${language}`;
    const template = getTemplate('email', templateId);
    
    if (!template) {
      throw new Error(`Email template not found: ${templateId}`);
    }

    // Validate variables
    const missingVars = validateTemplateVariables(template.htmlContent, options.variables);
    if (missingVars.length > 0) {
      throw new Error(`Missing variables: ${missingVars.join(', ')}`);
    }

    const htmlContent = renderTemplate(template.htmlContent, options.variables);
    const textContent = renderTemplate(template.textContent, options.variables);
    const subject = renderTemplate(template.subject, options.variables);

    // Get customer email from variables or retrieve from database
    const customerEmail = options.variables.customerEmail || await this.getCustomerEmail(options.customerId);
    
    if (!customerEmail) {
      throw new Error('Customer email not found');
    }

    const emailOptions: EmailSendOptions = {
      to: customerEmail,
      subject,
      htmlContent,
      textContent,
      variables: options.variables
    };

    return await this.emailService.sendEmailWithFallback(emailOptions);
  }

  private async sendSMSNotification(options: NotificationOptions, language: string): Promise<SMSSendResult> {
    const templateId = `${options.template}_${language}`;
    const template = getTemplate('sms', templateId);
    
    if (!template) {
      throw new Error(`SMS template not found: ${templateId}`);
    }

    // Validate variables
    const missingVars = validateTemplateVariables(template.content, options.variables);
    if (missingVars.length > 0) {
      throw new Error(`Missing variables: ${missingVars.join(', ')}`);
    }

    const message = renderTemplate(template.content, options.variables);

    // Get customer phone from variables or retrieve from database
    const customerPhone = options.variables.customerPhone || await this.getCustomerPhone(options.customerId);
    
    if (!customerPhone) {
      throw new Error('Customer phone not found');
    }

    const smsOptions: SMSSendOptions = {
      to: customerPhone,
      message,
      variables: options.variables
    };

    return await this.smsService.sendSMSWithFallback(smsOptions);
  }

  private async sendWhatsAppNotification(options: NotificationOptions, language: string): Promise<WhatsAppSendResult> {
    const templateId = `${options.template}_${language}`;
    const template = getTemplate('whatsapp', templateId);
    
    if (!template) {
      throw new Error(`WhatsApp template not found: ${templateId}`);
    }

    // Validate variables
    const missingVars = validateTemplateVariables(template.content, options.variables);
    if (missingVars.length > 0) {
      throw new Error(`Missing variables: ${missingVars.join(', ')}`);
    }

    const message = renderTemplate(template.content, options.variables);

    // Get customer phone from variables or retrieve from database
    const customerPhone = options.variables.customerPhone || await this.getCustomerPhone(options.customerId);
    
    if (!customerPhone) {
      throw new Error('Customer phone not found');
    }

    // Send based on template media type
    if (template.mediaType === 'image' && template.mediaUrl) {
      return await this.whatsAppService.sendMediaMessage(customerPhone, template.mediaUrl, 'image', message);
    } else {
      return await this.whatsAppService.sendTextMessage(customerPhone, message);
    }
  }

  // Booking flow integrations
  async sendBookingConfirmation(customerId: string, reservationId: string, bookingData: Record<string, string>): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      reservationId,
      template: 'booking_confirmation',
      variables: bookingData,
      immediate: true
    });
  }

  async sendPaymentSuccess(customerId: string, reservationId: string, paymentData: Record<string, string>): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      reservationId,
      template: 'payment_success',
      variables: paymentData,
      immediate: true
    });
  }

  async sendTransferReminder(customerId: string, reservationId: string, reminderData: Record<string, string>, hours: number): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      reservationId,
      template: 'transfer_reminder',
      variables: { ...reminderData, hours: hours.toString() },
      immediate: true
    });
  }

  async sendQRCode(customerId: string, reservationId: string, qrData: Record<string, string>): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      reservationId,
      template: 'qr_code',
      variables: qrData,
      channels: { email: false, sms: true, whatsapp: true }, // QR codes work better via SMS/WhatsApp
      immediate: true
    });
  }

  async sendDriverAssignment(customerId: string, reservationId: string, driverData: Record<string, string>): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      reservationId,
      template: 'driver_assigned',
      variables: driverData,
      channels: { email: false, sms: false, whatsapp: true }, // Driver info best via WhatsApp
      immediate: true
    });
  }

  async sendOTP(customerId: string, phone: string, otp: string): Promise<NotificationResult> {
    return await this.sendNotification({
      customerId,
      template: 'otp_verification',
      variables: { otp, customerPhone: phone },
      channels: { email: false, sms: true, whatsapp: false }, // OTP only via SMS
      immediate: true
    });
  }

  // Customer preference management
  setCustomerPreferences(customerId: string, preferences: NotificationPreferences): void {
    this.customerPreferences.set(customerId, preferences);
  }

  getCustomerPreferences(customerId: string): NotificationPreferences {
    return this.customerPreferences.get(customerId) || {
      customerId,
      channels: this.defaultChannels,
      language: 'tr',
      frequency: 'normal',
      optOut: false
    };
  }

  async optOutCustomer(customerId: string): Promise<void> {
    const preferences = this.getCustomerPreferences(customerId);
    preferences.optOut = true;
    this.setCustomerPreferences(customerId, preferences);
  }

  async optInCustomer(customerId: string): Promise<void> {
    const preferences = this.getCustomerPreferences(customerId);
    preferences.optOut = false;
    this.setCustomerPreferences(customerId, preferences);
  }

  // Service status and analytics
  async getServiceStatus(): Promise<{
    email: { available: boolean; providers: string[] };
    sms: { available: boolean; providers: string[] };
    whatsapp: { available: boolean };
  }> {
    return {
      email: {
        available: this.emailService.getAvailableProviders().length > 0,
        providers: this.emailService.getAvailableProviders()
      },
      sms: {
        available: this.smsService.getAvailableProviders().length > 0,
        providers: this.smsService.getAvailableProviders()
      },
      whatsapp: {
        available: this.whatsAppService.isAvailable()
      }
    };
  }

  async verifyAllServices(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    try {
      const emailResults = await this.emailService.verifyProviders();
      Object.keys(emailResults).forEach(key => {
        results[`email_${key}`] = emailResults[key];
      });
    } catch (error) {
      results['email'] = false;
    }

    try {
      const smsResults = await this.smsService.verifyProviders();
      Object.keys(smsResults).forEach(key => {
        results[`sms_${key}`] = smsResults[key];
      });
    } catch (error) {
      results['sms'] = false;
    }

    try {
      results['whatsapp'] = this.whatsAppService.isAvailable();
    } catch (error) {
      results['whatsapp'] = false;
    }

    return results;
  }

  // Helper methods (in real app, these would query database)
  private async getCustomerEmail(customerId: string): Promise<string | null> {
    // Mock implementation
    return null;
  }

  private async getCustomerPhone(customerId: string): Promise<string | null> {
    // Mock implementation
    return null;
  }
}