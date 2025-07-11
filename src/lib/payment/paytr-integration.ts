import crypto from 'crypto';

export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode: boolean;
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

export class PayTRService {
  private config: PayTRConfig;
  private baseUrl: string;

  constructor(config: PayTRConfig) {
    this.config = config;
    this.baseUrl = config.testMode 
      ? 'https://www.paytr.com/odeme/api/get-token'
      : 'https://www.paytr.com/odeme/api/get-token';
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Calculate hash for PayTR
      const hashString = [
        this.config.merchantId,
        request.customerEmail,
        request.orderId,
        request.amount.toString(),
        request.currency,
        this.config.merchantSalt
      ].join('');

      const paytrToken = crypto
        .createHmac('sha256', this.config.merchantKey)
        .update(hashString)
        .digest('base64');

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

      // In a real implementation, you would make an HTTP POST request to PayTR
      // For demo purposes, we'll return a mock response
      if (this.config.testMode) {
        return {
          success: true,
          token: 'mock_token_' + Date.now(),
          paymentUrl: `https://www.paytr.com/odeme/guvenli/mock_token_${Date.now()}`
        };
      }

      // Real implementation would be:
      // const response = await fetch(this.baseUrl, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   body: new URLSearchParams(postData)
      // });
      // const result = await response.json();

      return {
        success: true,
        token: 'demo_token',
        paymentUrl: 'https://demo.paytr.com/payment'
      };

    } catch (error) {
      console.error('PayTR payment creation error:', error);
      return {
        success: false,
        error: 'Ödeme oluşturulurken hata oluştu'
      };
    }
  }

  verifyCallback(callbackData: CallbackData): boolean {
    try {
      const hashString = [
        callbackData.merchant_oid,
        this.config.merchantSalt,
        callbackData.status,
        callbackData.total_amount
      ].join('');

      const calculatedHash = crypto
        .createHmac('sha256', this.config.merchantKey)
        .update(hashString)
        .digest('base64');

      return calculatedHash === callbackData.hash;
    } catch (error) {
      console.error('PayTR callback verification error:', error);
      return false;
    }
  }

  private getUserIP(): string {
    // In a real implementation, get the actual user IP
    return '127.0.0.1';
  }

  async refundPayment(transactionId: string, amount: number, reason: string): Promise<boolean> {
    try {
      // PayTR refund implementation
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

      const refundHash = crypto
        .createHmac('sha256', this.config.merchantKey)
        .update(hashString)
        .digest('base64');

      // In real implementation, make API call to PayTR refund endpoint
      console.log('Refund request:', { ...refundData, hash: refundHash });
      
      return true;
    } catch (error) {
      console.error('PayTR refund error:', error);
      return false;
    }
  }
}

// Initialize PayTR service
export const paytrService = new PayTRService({
  merchantId: process.env.REACT_APP_PAYTR_MERCHANT_ID || 'demo_merchant',
  merchantKey: process.env.REACT_APP_PAYTR_MERCHANT_KEY || 'demo_key',
  merchantSalt: process.env.REACT_APP_PAYTR_MERCHANT_SALT || 'demo_salt',
  testMode: process.env.NODE_ENV !== 'production'
});