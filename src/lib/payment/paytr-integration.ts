// PayTR Payment Integration for Turkey
// Using crypto-js for browser compatibility
import CryptoJS from 'crypto-js';

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
  enabled: boolean;
}

export interface PaymentRequest {
  amount: number; // in cents
  currency: string;
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

export interface PaymentResponse {
  success: boolean;
  token?: string;
  paymentUrl?: string;
  error?: string;
}

export interface CallbackData {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
  failed_reason_code?: string;
  failed_reason_msg?: string;
  test_mode: string;
  payment_type: string;
  currency: string;
  payment_amount: string;
}

/**
 * PayTR Service for handling credit card payments
 * Supports both test and production modes based on environment configuration
 */
export class PayTRService {
  private config: PayTRConfig;
  private baseUrl: string;

  constructor(config: PayTRConfig) {
    this.config = config;
    this.baseUrl = 'https://www.paytr.com/odeme/api/get-token';
  }

  /**
   * Creates a payment request with PayTR
   * In production mode with proper credentials, makes real API calls
   * In test mode or without credentials, returns mock responses
   */
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // If PayTR is not enabled or not properly configured, return test response
      if (!this.config.enabled || !this.isProperlyConfigured()) {
        console.warn('PayTR not enabled or not configured, using test mode');
        return this.createTestPayment(request);
      }

      // Calculate hash for PayTR
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
        max_installment: '0',
        timeout_limit: '30',
        lang: 'tr'
      };

      // In test mode or development, return mock response
      if (this.config.testMode || import.meta.env.MODE === 'development') {
        console.info('PayTR test mode: Simulating payment creation');
        return {
          success: true,
          token: 'test_token_' + Date.now(),
          paymentUrl: `https://www.paytr.com/odeme/guvenli/test_token_${Date.now()}`
        };
      }

      // Real API call for production
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SBS Travel Booking System'
        },
        body: new URLSearchParams(postData)
      });

      if (!response.ok) {
        throw new Error(`PayTR API error: ${response.status} ${response.statusText}`);
      }

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
          error: result.reason || 'PayTR ödeme oluşturma hatası'
        };
      }

    } catch (error) {
      console.error('PayTR payment creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ödeme oluşturulurken hata oluştu'
      };
    }
  }

  /**
   * Creates a test payment response for development/testing
   */
  private createTestPayment(request: PaymentRequest): PaymentResponse {
    return {
      success: true,
      token: 'test_token_' + Date.now(),
      paymentUrl: `https://demo.paytr.com/payment?orderId=${request.orderId}&amount=${request.amount}`
    };
  }

  /**
   * Verifies PayTR callback data
   */
  verifyCallback(callbackData: CallbackData): boolean {
    try {
      if (!this.config.enabled || !this.isProperlyConfigured()) {
        console.warn('PayTR not configured, accepting test callback');
        return true; // Accept all callbacks in test mode
      }

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

  /**
   * Processes a refund through PayTR
   */
  async refundPayment(transactionId: string, amount: number, reason: string): Promise<boolean> {
    try {
      if (!this.config.enabled || !this.isProperlyConfigured()) {
        console.info('PayTR refund simulation for transaction:', transactionId);
        return true; // Simulate success in test mode
      }

      const refundData = {
        merchant_id: this.config.merchantId,
        merchant_oid: transactionId,
        return_amount: amount,
        reason: reason
      };

      // Calculate refund hash
      const hashString = [
        this.config.merchantId,
        transactionId,
        amount.toString(),
        this.config.merchantSalt
      ].join('');

      const refundHash = CryptoJS.HmacSHA256(hashString, this.config.merchantKey).toString(CryptoJS.enc.Base64);

      if (this.config.testMode || import.meta.env.MODE === 'development') {
        console.info('PayTR refund test mode:', { ...refundData, hash: refundHash });
        return true;
      }

      // Real refund API call would go here
      const response = await fetch('https://www.paytr.com/odeme/iade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SBS Travel Booking System'
        },
        body: new URLSearchParams({
          ...refundData,
          hash: refundHash
        })
      });

      const result = await response.json();
      return result.status === 'success';
      
    } catch (error) {
      console.error('PayTR refund error:', error);
      return false;
    }
  }

  /**
   * Checks if PayTR is properly configured with all required credentials
   */
  private isProperlyConfigured(): boolean {
    return Boolean(
      this.config.merchantId && 
      this.config.merchantKey && 
      this.config.merchantSalt &&
      this.config.merchantId !== 'demo_merchant' &&
      this.config.merchantKey !== 'demo_key' &&
      this.config.merchantSalt !== 'demo_salt'
    );
  }

  /**
   * Gets user IP address (simplified for demo)
   */
  private getUserIP(): string {
    // In a real implementation, get the actual user IP from the backend
    return '127.0.0.1';
  }

  /**
   * Returns configuration status for debugging
   */
  getConfigStatus() {
    return {
      enabled: this.config.enabled,
      testMode: this.config.testMode,
      configured: this.isProperlyConfigured(),
      merchantId: this.config.merchantId ? `${this.config.merchantId.substring(0, 4)}...` : 'not set'
    };
  }
}

/**
 * Initialize PayTR service with environment configuration
 * Automatically enables/disables based on environment variables
 */
export const paytrService = new PayTRService({
  merchantId: import.meta.env.VITE_PAYTR_MERCHANT_ID || 'demo_merchant',
  merchantKey: import.meta.env.VITE_PAYTR_MERCHANT_KEY || 'demo_key',
  merchantSalt: import.meta.env.VITE_PAYTR_MERCHANT_SALT || 'demo_salt',
  enabled: import.meta.env.VITE_PAYTR_ENABLED === 'true',
  testMode: import.meta.env.VITE_PAYTR_TEST_MODE !== 'false' // Default to test mode for safety
});