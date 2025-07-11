// Communication Service Configuration
export interface CommunicationConfig {
  email: {
    defaultProvider: 'gmail' | 'sendgrid' | 'ses';
    providers: {
      gmail: {
        host: string;
        port: number;
        user: string;
        pass: string;
      };
      sendgrid: {
        apiKey: string;
        fromEmail: string;
        fromName: string;
      };
      ses: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
        fromEmail: string;
      };
    };
  };
  sms: {
    defaultProvider: 'netgsm' | 'iletiMerkezi' | 'twilio';
    providers: {
      netgsm: {
        username: string;
        password: string;
        header: string;
      };
      iletiMerkezi: {
        username: string;
        password: string;
        header: string;
      };
      twilio: {
        accountSid: string;
        authToken: string;
        fromNumber: string;
      };
    };
  };
  whatsapp: {
    accessToken: string;
    phoneNumberId: string;
    verifyToken: string;
    businessAccountId: string;
  };
}

// Default configuration - will be overridden by environment variables
export const defaultConfig: CommunicationConfig = {
  email: {
    defaultProvider: 'gmail',
    providers: {
      gmail: {
        host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
        user: import.meta.env.VITE_SMTP_USER || '',
        pass: import.meta.env.VITE_SMTP_PASS || '',
      },
      sendgrid: {
        apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
        fromEmail: import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@sbstravel.com',
        fromName: import.meta.env.VITE_SENDGRID_FROM_NAME || 'SBS Travel',
      },
      ses: {
        region: import.meta.env.VITE_AWS_SES_REGION || 'eu-west-1',
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
        fromEmail: import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'noreply@sbstravel.com',
      },
    },
  },
  sms: {
    defaultProvider: 'netgsm',
    providers: {
      netgsm: {
        username: import.meta.env.VITE_NETGSM_USERNAME || '',
        password: import.meta.env.VITE_NETGSM_PASSWORD || '',
        header: import.meta.env.VITE_NETGSM_HEADER || 'SBSTRAVEL',
      },
      iletiMerkezi: {
        username: import.meta.env.VITE_ILETIMERKEZI_USERNAME || '',
        password: import.meta.env.VITE_ILETIMERKEZI_PASSWORD || '',
        header: import.meta.env.VITE_ILETIMERKEZI_HEADER || 'SBSTRAVEL',
      },
      twilio: {
        accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
        authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
        fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '',
      },
    },
  },
  whatsapp: {
    accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
    verifyToken: import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN || '',
    businessAccountId: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  },
};

// Validation function
export const validateConfig = (config: CommunicationConfig): string[] => {
  const errors: string[] = [];

  // Validate email configuration
  const emailProvider = config.email.providers[config.email.defaultProvider];
  if (!emailProvider) {
    errors.push(`Email provider '${config.email.defaultProvider}' not configured`);
  }

  // Validate SMS configuration
  const smsProvider = config.sms.providers[config.sms.defaultProvider];
  if (!smsProvider) {
    errors.push(`SMS provider '${config.sms.defaultProvider}' not configured`);
  }

  // Validate WhatsApp configuration
  if (!config.whatsapp.accessToken) {
    errors.push('WhatsApp access token not configured');
  }
  if (!config.whatsapp.phoneNumberId) {
    errors.push('WhatsApp phone number ID not configured');
  }

  return errors;
};