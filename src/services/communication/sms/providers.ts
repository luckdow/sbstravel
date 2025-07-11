import { SMSProvider } from './SMSService';

// Mock SMS provider for development/testing
export class MockSMSProvider implements SMSProvider {
  name = 'mock';

  isAvailable(): boolean {
    return true;
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string; cost?: number }> {
    // Simulate SMS sending
    console.log('📱 Mock SMS Sent:', {
      to,
      message: message.substring(0, 160),
      length: message.length
    });

    // Simulate some delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      messageId: `mock_sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cost: 0.05
    };
  }

  async verifyConnection(): Promise<boolean> {
    return true;
  }

  async getQuota(): Promise<{ used: number; total: number; remaining: number }> {
    return { used: 0, total: 1000, remaining: 1000 };
  }
}

// NetGSM Provider (Turkey's largest SMS provider)
export class NetGSMProvider implements SMSProvider {
  name = 'netgsm';
  private config: {
    username: string;
    password: string;
    header: string;
  };

  constructor(config: { username: string; password: string; header: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.username && this.config.password);
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string; cost?: number }> {
    try {
      // In a real implementation, this would use NetGSM API
      // API endpoint: https://api.netgsm.com.tr/sms/send/get
      console.log('📱 NetGSM SMS (simulated):', {
        header: this.config.header,
        to,
        message: message.substring(0, 160),
        length: message.length
      });

      // Simulate API call
      const messageId = `netgsm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        messageId,
        cost: this.calculateCost(message, to)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'NetGSM sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    // In a real implementation, this would test NetGSM API credentials
    return this.isAvailable();
  }

  async getQuota(): Promise<{ used: number; total: number; remaining: number }> {
    // In a real implementation, this would query NetGSM quota API
    return { used: 150, total: 1000, remaining: 850 };
  }

  private calculateCost(message: string, to: string): number {
    // Turkish domestic SMS cost calculation
    const isInternational = !to.startsWith('+90');
    const segments = Math.ceil(message.length / 160);
    
    if (isInternational) {
      return segments * 0.25; // International rate
    } else {
      return segments * 0.05; // Domestic rate
    }
  }
}

// İleti Merkezi Provider (Alternative Turkish SMS provider)
export class IletiMerkeziProvider implements SMSProvider {
  name = 'iletiMerkezi';
  private config: {
    username: string;
    password: string;
    header: string;
  };

  constructor(config: { username: string; password: string; header: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.username && this.config.password);
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string; cost?: number }> {
    try {
      // In a real implementation, this would use İleti Merkezi API
      console.log('📱 İleti Merkezi SMS (simulated):', {
        header: this.config.header,
        to,
        message: message.substring(0, 160),
        length: message.length
      });

      const messageId = `iletimerkezi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        messageId,
        cost: this.calculateCost(message, to)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'İleti Merkezi sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    return this.isAvailable();
  }

  async getQuota(): Promise<{ used: number; total: number; remaining: number }> {
    return { used: 200, total: 2000, remaining: 1800 };
  }

  private calculateCost(message: string, to: string): number {
    const isInternational = !to.startsWith('+90');
    const segments = Math.ceil(message.length / 160);
    
    if (isInternational) {
      return segments * 0.22; // Slightly cheaper international rate
    } else {
      return segments * 0.045; // Competitive domestic rate
    }
  }
}

// Twilio Provider (International fallback)
export class TwilioProvider implements SMSProvider {
  name = 'twilio';
  private config: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };

  constructor(config: { accountSid: string; authToken: string; fromNumber: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.accountSid && this.config.authToken && this.config.fromNumber);
  }

  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string; cost?: number }> {
    try {
      // In a real implementation, this would use Twilio API
      console.log('📱 Twilio SMS (simulated):', {
        from: this.config.fromNumber,
        to,
        message: message.substring(0, 1600), // Twilio supports longer messages
        length: message.length
      });

      const messageId = `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        messageId,
        cost: this.calculateCost(message, to)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Twilio sending failed'
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    return this.isAvailable();
  }

  async getQuota(): Promise<{ used: number; total: number; remaining: number }> {
    return { used: 50, total: 500, remaining: 450 };
  }

  private calculateCost(message: string, to: string): number {
    const isTurkish = to.startsWith('+90');
    const segments = Math.ceil(message.length / 160);
    
    if (isTurkish) {
      return segments * 0.08; // Turkey rate via Twilio
    } else {
      return segments * 0.15; // International rate
    }
  }
}