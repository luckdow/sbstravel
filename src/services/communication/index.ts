import { EmailService } from './email/EmailService';
import { SMSService } from './sms/SMSService';
import { WhatsAppService } from './whatsapp/WhatsAppService';
import { NotificationService } from './NotificationService';

// Email providers
import { MockEmailProvider, GmailProvider, SendGridProvider, SESProvider } from './email/providers';

// SMS providers
import { MockSMSProvider, NetGSMProvider, IletiMerkeziProvider, TwilioProvider } from './sms/providers';

import { defaultConfig, validateConfig } from './config';

export class CommunicationServiceFactory {
  private static instance: NotificationService | null = null;

  static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = this.createNotificationService();
    }
    return this.instance;
  }

  static createNotificationService(): NotificationService {
    const config = defaultConfig;
    
    // Validate configuration
    const configErrors = validateConfig(config);
    if (configErrors.length > 0) {
      console.warn('Communication service configuration issues:', configErrors);
    }

    // Create email providers
    const emailProviders = [];
    
    // In development, always include mock provider
    if (import.meta.env.DEV) {
      emailProviders.push(new MockEmailProvider());
    }

    // Add real providers if configured
    if (config.email.providers.gmail.user && config.email.providers.gmail.pass) {
      emailProviders.push(new GmailProvider(config.email.providers.gmail));
    }

    if (config.email.providers.sendgrid.apiKey) {
      emailProviders.push(new SendGridProvider(config.email.providers.sendgrid));
    }

    if (config.email.providers.ses.accessKeyId && config.email.providers.ses.secretAccessKey) {
      emailProviders.push(new SESProvider(config.email.providers.ses));
    }

    // Create SMS providers
    const smsProviders = [];
    
    // In development, always include mock provider
    if (import.meta.env.DEV) {
      smsProviders.push(new MockSMSProvider());
    }

    // Add real providers if configured
    if (config.sms.providers.netgsm.username && config.sms.providers.netgsm.password) {
      smsProviders.push(new NetGSMProvider(config.sms.providers.netgsm));
    }

    if (config.sms.providers.iletiMerkezi.username && config.sms.providers.iletiMerkezi.password) {
      smsProviders.push(new IletiMerkeziProvider(config.sms.providers.iletiMerkezi));
    }

    if (config.sms.providers.twilio.accountSid && config.sms.providers.twilio.authToken) {
      smsProviders.push(new TwilioProvider(config.sms.providers.twilio));
    }

    // Create services
    const emailService = new EmailService(emailProviders);
    const smsService = new SMSService(smsProviders);
    const whatsAppService = new WhatsAppService(config.whatsapp);

    // Create notification service
    return new NotificationService({
      emailService,
      smsService,
      whatsAppService,
      defaultChannels: {
        email: true,
        sms: true,
        whatsapp: true
      }
    });
  }

  static resetInstance(): void {
    this.instance = null;
  }
}

// Export services for direct access if needed
export { EmailService } from './email/EmailService';
export { SMSService } from './sms/SMSService';
export { WhatsAppService } from './whatsapp/WhatsAppService';
export { NotificationService } from './NotificationService';

// Export providers
export * from './email/providers';
export * from './sms/providers';

// Export templates
export * from './templates';

// Export configuration
export * from './config';

// Main export - the notification service instance
export const notificationService = CommunicationServiceFactory.getInstance();

// Helper function to test all services
export const testCommunicationServices = async () => {
  const service = CommunicationServiceFactory.getInstance();
  
  console.log('🧪 Testing Communication Services...');
  
  // Test service status
  const status = await service.getServiceStatus();
  console.log('📊 Service Status:', status);
  
  // Test service verification
  const verification = await service.verifyAllServices();
  console.log('✅ Service Verification:', verification);
  
  // Test sending a sample notification
  try {
    const result = await service.sendNotification({
      customerId: 'test-customer',
      template: 'booking_confirmation',
      variables: {
        customerName: 'Test Müşteri',
        customerEmail: 'test@example.com',
        customerPhone: '+905551234567',
        bookingId: 'TEST123',
        transferType: 'Havalimanı → Otel',
        pickupLocation: 'Antalya Havalimanı',
        dropoffLocation: 'Kemer Otel',
        pickupDate: '2024-01-15',
        pickupTime: '14:30',
        passengerCount: '2',
        vehicleType: 'Standard',
        totalPrice: '250',
        qrCode: 'TEST-QR-123'
      },
      immediate: true
    });
    
    console.log('📧 Test Notification Result:', result);
  } catch (error) {
    console.error('❌ Test Notification Failed:', error);
  }
  
  return {
    status,
    verification
  };
};