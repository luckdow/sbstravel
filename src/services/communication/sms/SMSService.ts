import { SMSTemplate, NotificationMessage } from '../../../types';

export interface SMSProvider {
  name: string;
  isAvailable(): boolean;
  sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string; cost?: number }>;
  verifyConnection(): Promise<boolean>;
  getQuota(): Promise<{ used: number; total: number; remaining: number }>;
}

export interface SMSSendOptions {
  to: string;
  message: string;
  template?: string;
  variables?: Record<string, string>;
}

export interface SMSSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  cost?: number;
}

export class SMSService {
  private providers: SMSProvider[] = [];
  private defaultProvider?: SMSProvider;

  constructor(providers: SMSProvider[]) {
    this.providers = providers;
    this.defaultProvider = providers.find(p => p.isAvailable());
  }

  async sendSMS(options: SMSSendOptions): Promise<SMSSendResult> {
    if (!this.defaultProvider) {
      return { success: false, error: 'No SMS provider available' };
    }

    try {
      let message = options.message;

      // Apply template variables if provided
      if (options.variables) {
        Object.keys(options.variables).forEach(key => {
          const placeholder = `{${key}}`;
          message = message.replace(new RegExp(placeholder, 'g'), options.variables![key]);
        });
      }

      const result = await this.defaultProvider.sendSMS(options.to, message);

      return {
        ...result,
        provider: this.defaultProvider.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.defaultProvider.name
      };
    }
  }

  async sendSMSWithFallback(options: SMSSendOptions): Promise<SMSSendResult> {
    let lastError = '';

    // Sort providers by cost (cheapest first)
    const sortedProviders = [...this.providers].sort((a, b) => {
      // In a real implementation, you'd have cost data
      // For now, prioritize Turkish providers for local numbers
      if (options.to.startsWith('+90')) {
        if (a.name.includes('netgsm') || a.name.includes('iletiMerkezi')) return -1;
        if (b.name.includes('netgsm') || b.name.includes('iletiMerkezi')) return 1;
      }
      return 0;
    });

    for (const provider of sortedProviders) {
      if (!provider.isAvailable()) continue;

      try {
        const result = await this.sendSMSWithProvider(provider, options);
        if (result.success) {
          return result;
        }
        lastError = result.error || 'Unknown error';
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        continue;
      }
    }

    return {
      success: false,
      error: `All providers failed. Last error: ${lastError}`
    };
  }

  private async sendSMSWithProvider(provider: SMSProvider, options: SMSSendOptions): Promise<SMSSendResult> {
    let message = options.message;

    // Apply template variables if provided
    if (options.variables) {
      Object.keys(options.variables).forEach(key => {
        const placeholder = `{${key}}`;
        message = message.replace(new RegExp(placeholder, 'g'), options.variables![key]);
      });
    }

    const result = await provider.sendSMS(options.to, message);

    return {
      ...result,
      provider: provider.name
    };
  }

  async verifyProviders(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const provider of this.providers) {
      try {
        results[provider.name] = await provider.verifyConnection();
      } catch (error) {
        results[provider.name] = false;
      }
    }

    return results;
  }

  async getQuotaStatus(): Promise<Record<string, { used: number; total: number; remaining: number }>> {
    const results: Record<string, { used: number; total: number; remaining: number }> = {};

    for (const provider of this.providers) {
      try {
        if (provider.isAvailable()) {
          results[provider.name] = await provider.getQuota();
        }
      } catch (error) {
        results[provider.name] = { used: 0, total: 0, remaining: 0 };
      }
    }

    return results;
  }

  getAvailableProviders(): string[] {
    return this.providers.filter(p => p.isAvailable()).map(p => p.name);
  }

  setDefaultProvider(providerName: string): boolean {
    const provider = this.providers.find(p => p.name === providerName);
    if (provider && provider.isAvailable()) {
      this.defaultProvider = provider;
      return true;
    }
    return false;
  }

  // Format Turkish phone number
  static formatTurkishPhone(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('90')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+90' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '+90' + cleaned;
    } else {
      cleaned = '+90' + cleaned;
    }

    return cleaned;
  }

  // Validate phone number
  static isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
}