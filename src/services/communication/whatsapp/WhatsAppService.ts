import { WhatsAppTemplate, NotificationMessage } from '../../../types';

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'media';
  text?: string;
  template?: {
    name: string;
    language: { code: string };
    components?: WhatsAppTemplateComponent[];
  };
  media?: {
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    caption?: string;
    filename?: string;
  };
}

export interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'footer' | 'button';
  parameters?: Array<{
    type: 'text' | 'currency' | 'date_time' | 'image' | 'document';
    text?: string;
    currency?: { fallback_value: string; code: string; amount_1000: number };
    date_time?: { fallback_value: string };
    image?: { link: string };
    document?: { link: string; filename: string };
  }>;
  sub_type?: 'quick_reply' | 'url';
  index?: number;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface WhatsAppWebhookData {
  messageId: string;
  from: string;
  timestamp: number;
  type: 'text' | 'image' | 'document' | 'button' | 'interactive';
  text?: string;
  button?: { text: string; payload: string };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string; description: string };
  };
}

export class WhatsAppService {
  private config: {
    accessToken: string;
    phoneNumberId: string;
    verifyToken: string;
    businessAccountId: string;
  };

  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(config: { accessToken: string; phoneNumberId: string; verifyToken: string; businessAccountId: string }) {
    this.config = config;
  }

  isAvailable(): boolean {
    return !!(this.config.accessToken && this.config.phoneNumberId);
  }

  async sendTextMessage(to: string, text: string): Promise<WhatsAppSendResult> {
    try {
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(to),
        type: 'text',
        text
      };

      return await this.sendMessage(message);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp message'
      };
    }
  }

  async sendTemplateMessage(to: string, templateName: string, language: string = 'tr', variables?: Record<string, string>): Promise<WhatsAppSendResult> {
    try {
      const components: WhatsAppTemplateComponent[] = [];

      // Add variables to body component if provided
      if (variables && Object.keys(variables).length > 0) {
        components.push({
          type: 'body',
          parameters: Object.values(variables).map(value => ({
            type: 'text',
            text: value
          }))
        });
      }

      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(to),
        type: 'template',
        template: {
          name: templateName,
          language: { code: language },
          components: components.length > 0 ? components : undefined
        }
      };

      return await this.sendMessage(message);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp template'
      };
    }
  }

  async sendMediaMessage(to: string, mediaUrl: string, mediaType: 'image' | 'document', caption?: string, filename?: string): Promise<WhatsAppSendResult> {
    try {
      const message: WhatsAppMessage = {
        to: this.formatPhoneNumber(to),
        type: 'media',
        media: {
          type: mediaType,
          url: mediaUrl,
          caption,
          filename
        }
      };

      return await this.sendMessage(message);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send WhatsApp media'
      };
    }
  }

  async sendInteractiveMessage(to: string, text: string, buttons: Array<{ id: string; title: string }>): Promise<WhatsAppSendResult> {
    try {
      // In a real implementation, this would send an interactive message with buttons
      // For now, we'll simulate it as a text message with button options
      const buttonText = buttons.map(btn => `• ${btn.title}`).join('\n');
      const fullText = `${text}\n\n${buttonText}`;

      return await this.sendTextMessage(to, fullText);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send interactive message'
      };
    }
  }

  async sendLocationMessage(to: string, latitude: number, longitude: number, name?: string, address?: string): Promise<WhatsAppSendResult> {
    try {
      // In a real implementation, this would send a location message
      const locationText = `📍 Konum: ${name || 'Konum'}\n${address || `${latitude}, ${longitude}`}\nhttps://maps.google.com/?q=${latitude},${longitude}`;
      
      return await this.sendTextMessage(to, locationText);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send location'
      };
    }
  }

  private async sendMessage(message: WhatsAppMessage): Promise<WhatsAppSendResult> {
    if (!this.isAvailable()) {
      return { success: false, error: 'WhatsApp service not configured' };
    }

    try {
      // In a real implementation, this would make an HTTP request to WhatsApp Business API
      console.log('💬 WhatsApp Message (simulated):', {
        phoneNumberId: this.config.phoneNumberId,
        message: {
          ...message,
          text: message.text?.substring(0, 100) + (message.text && message.text.length > 100 ? '...' : '')
        }
      });

      // Simulate API response
      const messageId = `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        messageId,
        status: 'sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'WhatsApp API error'
      };
    }
  }

  // Webhook verification for Meta Business API
  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.config.verifyToken) {
      return challenge;
    }
    return null;
  }

  // Process incoming webhook data
  processWebhook(webhookData: any): WhatsAppWebhookData | null {
    try {
      // In a real implementation, this would parse the webhook payload
      // and extract message data according to WhatsApp Business API format
      
      if (webhookData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
        const message = webhookData.entry[0].changes[0].value.messages[0];
        
        return {
          messageId: message.id,
          from: message.from,
          timestamp: message.timestamp,
          type: message.type,
          text: message.text?.body,
          button: message.button ? {
            text: message.button.text,
            payload: message.button.payload
          } : undefined,
          interactive: message.interactive
        };
      }

      return null;
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
      return null;
    }
  }

  // Get message status (read, delivered, etc.)
  async getMessageStatus(messageId: string): Promise<{ status: string; timestamp?: number }> {
    try {
      // In a real implementation, this would query WhatsApp Business API
      return {
        status: 'delivered',
        timestamp: Date.now()
      };
    } catch (error) {
      return { status: 'unknown' };
    }
  }

  // Format phone number for WhatsApp (remove + and ensure country code)
  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    
    // Add Turkey country code if missing
    if (cleaned.length === 10 && !cleaned.startsWith('90')) {
      cleaned = '90' + cleaned;
    }
    
    // Remove leading + if present in original
    return cleaned;
  }

  // Validate phone number for WhatsApp
  static isValidWhatsAppNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Get WhatsApp chat URL
  static getChatUrl(phone: string, message?: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const baseUrl = 'https://wa.me/';
    
    if (message) {
      return `${baseUrl}${cleaned}?text=${encodeURIComponent(message)}`;
    }
    
    return `${baseUrl}${cleaned}`;
  }
}