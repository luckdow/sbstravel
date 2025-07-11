export interface EmailProvider {
  name: string;
  isAvailable(): boolean;
  sendEmail(to: string, subject: string, htmlContent: string, textContent?: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
  verifyConnection(): Promise<boolean>;
}

export interface EmailSendOptions {
  to: string;
  subject: string;
  template?: string;
  variables?: Record<string, string>;
  htmlContent?: string;
  textContent?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
}

export class EmailService {
  private providers: EmailProvider[] = [];
  private defaultProvider?: EmailProvider;

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
    this.defaultProvider = providers.find(p => p.isAvailable());
  }

  async sendEmail(options: EmailSendOptions): Promise<EmailSendResult> {
    if (!this.defaultProvider) {
      return { success: false, error: 'No email provider available' };
    }

    try {
      let htmlContent = options.htmlContent || '';
      let subject = options.subject;

      // Apply template variables if provided
      if (options.variables) {
        Object.keys(options.variables).forEach(key => {
          const placeholder = `{${key}}`;
          htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), options.variables![key]);
          subject = subject.replace(new RegExp(placeholder, 'g'), options.variables![key]);
        });
      }

      const result = await this.defaultProvider.sendEmail(
        options.to,
        subject,
        htmlContent,
        options.textContent
      );

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

  async sendEmailWithFallback(options: EmailSendOptions): Promise<EmailSendResult> {
    let lastError = '';

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;

      try {
        const result = await this.sendEmailWithProvider(provider, options);
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

  private async sendEmailWithProvider(provider: EmailProvider, options: EmailSendOptions): Promise<EmailSendResult> {
    let htmlContent = options.htmlContent || '';
    let subject = options.subject;

    // Apply template variables if provided
    if (options.variables) {
      Object.keys(options.variables).forEach(key => {
        const placeholder = `{${key}}`;
        htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), options.variables![key]);
        subject = subject.replace(new RegExp(placeholder, 'g'), options.variables![key]);
      });
    }

    const result = await provider.sendEmail(
      options.to,
      subject,
      htmlContent,
      options.textContent
    );

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
      } catch {
        results[provider.name] = false;
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
}