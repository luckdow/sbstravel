import { EmailProvider } from './EmailService';

// Mock email provider for development/testing
export class MockEmailProvider implements EmailProvider {
  name = 'mock';

  isAvailable(): boolean {
    return true;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Simulate email sending
    console.log('📧 Mock Email Sent:', {
      to,
      subject,
      htmlContent: htmlContent.substring(0, 100) + '...',
      textContent: textContent?.substring(0, 100)
    });

    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  async verifyConnection(): Promise<boolean> {
    return true;
  }
}

// Gmail SMTP Provider
export class GmailProvider implements EmailProvider {
  name = 'gmail';
  private config: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };

  constructor(config: { host: string; port: number; user: string; pass: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.user && this.config.pass);
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, this would use nodemailer
      // For now, we'll simulate the functionality
      console.log('📧 Gmail Email (simulated):', {
        from: this.config.user,
        to,
        subject,
        html: htmlContent.substring(0, 100) + '...'
      });

      return {
        success: true,
        messageId: `gmail_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Gmail sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    // In a real implementation, this would test SMTP connection
    return this.isAvailable();
  }
}

// SendGrid Provider
export class SendGridProvider implements EmailProvider {
  name = 'sendgrid';
  private config: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };

  constructor(config: { apiKey: string; fromEmail: string; fromName: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, this would use SendGrid API
      console.log('📧 SendGrid Email (simulated):', {
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to,
        subject,
        html: htmlContent.substring(0, 100) + '...'
      });

      return {
        success: true,
        messageId: `sendgrid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SendGrid sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    // In a real implementation, this would test SendGrid API
    return this.isAvailable();
  }
}

// AWS SES Provider
export class SESProvider implements EmailProvider {
  name = 'ses';
  private config: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    fromEmail: string;
  };

  constructor(config: { region: string; accessKeyId: string; secretAccessKey: string; fromEmail: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.accessKeyId && this.config.secretAccessKey);
  }

  async sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, this would use AWS SDK
      console.log('📧 AWS SES Email (simulated):', {
        from: this.config.fromEmail,
        to,
        subject,
        html: htmlContent.substring(0, 100) + '...',
        region: this.config.region
      });

      return {
        success: true,
        messageId: `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AWS SES sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    // In a real implementation, this would test AWS SES connection
    return this.isAvailable();
  }
}