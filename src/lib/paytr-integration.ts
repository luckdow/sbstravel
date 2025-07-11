// PayTR Payment Integration for Turkey
import CryptoJS from 'crypto-js';

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
}

export interface PayTRPaymentRequest {
  amount: number; // in cents (e.g., 100.50 TRY = 10050)
  currency: string; // 'TRY', 'USD', 'EUR'
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  successUrl: string;
  failUrl: string;
  description: string;
  userBasket: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PayTRResponse {
  success: boolean;
  token?: string;
  paymentUrl?: string;
  error?: string;
}

export class PayTRService {
  private config: PayTRConfig;
  private baseUrl: string;

  constructor(config: PayTRConfig) {
    this.config = config;
    this.baseUrl = config.testMode 
      ? 'https://www.paytr.com/odeme/api/get-token'
      : 'https://www.paytr.com/odeme/api/get-token';
  }

  async createPayment(request: PayTRPaymentRequest): Promise<PayTRResponse> {
    try {
      // PayTR hash calculation
      const hashString = [
        this.config.merchantId,
        request.customerEmail,
        request.orderId,
        request.amount.toString(),
        request.currency,
        this.config.merchantSalt
      ].join('');

      const paytrToken = CryptoJS.HmacSHA256(hashString, this.config.merchantKey).toString(CryptoJS.enc.Base64);

      const postData = {
        merchant_id: this.config.merchantId,
        user_ip: this.getUserIP(),
        merchant_oid: request.orderId,
        email: request.customerEmail,
        payment_amount: request.amount,
        currency: request.currency,
        user_name: request.customerName,
        user_address: request.customerAddress,
        user_phone: request.customerPhone,
        merchant_ok_url: request.successUrl,
        merchant_fail_url: request.failUrl,
        user_basket: JSON.stringify(request.userBasket),
        paytr_token: paytrToken,
        test_mode: this.config.testMode ? '1' : '0',
        debug_on: this.config.testMode ? '1' : '0',
        no_installment: '0',
        max_installment: '12',
        timeout_limit: '30',
        lang: 'tr'
      };

      // For demo purposes, return mock response
      if (this.config.testMode) {
        return {
          success: true,
          token: 'mock_token_' + Date.now(),
          paymentUrl: `https://www.paytr.com/odeme/guvenli/mock_token_${Date.now()}`
        };
      }

      // Real PayTR API call would be here
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(postData)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          success: true,
          token: result.token,
          paymentUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`
        };
      } else {
        return {
          success: false,
          error: result.reason || 'Ödeme oluşturulurken hata oluştu'
        };
      }

    } catch (error) {
      console.error('PayTR payment creation error:', error);
      return {
        success: false,
        error: 'Ödeme sistemi ile bağlantı kurulamadı'
      };
    }
  }

  verifyCallback(callbackData: Record<string, any>): boolean {
    try {
      const hashString = [
        callbackData.merchant_oid,
        this.config.merchantSalt,
        callbackData.status,
        callbackData.total_amount
      ].join('');

      const calculatedHash = CryptoJS.HmacSHA256(hashString, this.config.merchantKey).toString(CryptoJS.enc.Base64);
      return calculatedHash === callbackData.hash;
    } catch (error) {
      console.error('PayTR callback verification error:', error);
      return false;
    }
  }

  private getUserIP(): string {
    // In production, get actual user IP from server
    return '127.0.0.1';
  }
}

// PayTR service instance
export const paytrService = new PayTRService({
  merchantId: import.meta.env.VITE_PAYTR_MERCHANT_ID || 'demo_merchant',
  merchantKey: import.meta.env.VITE_PAYTR_MERCHANT_KEY || 'demo_key',
  merchantSalt: import.meta.env.VITE_PAYTR_MERCHANT_SALT || 'demo_salt',
  testMode: import.meta.env.NODE_ENV !== 'production'
});