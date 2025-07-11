// PayTR payment integration
export interface PayTRConfig {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
  testMode?: boolean;
}

export interface PaymentRequest {
  amount: number; // in cents (e.g., 100.50 USD = 10050)
  currency: string; // 'USD', 'TRY', 'EUR'
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  successUrl: string;
  failUrl: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  token?: string;
  paymentUrl?: string;
  error?: string;
}

export class PayTRService {
  private config: PayTRConfig;
  
  constructor(config: PayTRConfig) {
    this.config = config;
  }
  
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // PayTR requires specific hash calculation
      const hashString = [
        this.config.merchantId,
        request.customerEmail,
        request.orderId,
        request.amount.toString(),
        request.currency,
        this.config.merchantSalt
      ].join('');
      
      // In a real implementation, you would calculate HMAC-SHA256 hash
      // For now, we'll simulate the payment process
      
      const paymentData = {
        merchant_id: this.config.merchantId,
        user_ip: '127.0.0.1', // Should be actual user IP
        merchant_oid: request.orderId,
        email: request.customerEmail,
        payment_amount: request.amount,
        currency: request.currency,
        user_name: request.customerName,
        user_address: 'Antalya, Turkey',
        user_phone: request.customerPhone,
        merchant_ok_url: request.successUrl,
        merchant_fail_url: request.failUrl,
        user_basket: JSON.stringify([{
          name: request.description,
          price: request.amount,
          quantity: 1
        }]),
        paytr_token: this.generateToken(hashString),
        test_mode: this.config.testMode ? '1' : '0'
      };
      
      // In production, you would make actual API call to PayTR
      // For demo purposes, we'll return a mock response
      return {
        success: true,
        token: 'mock_token_' + Date.now(),
        paymentUrl: `https://www.paytr.com/odeme/guvenli/${paymentData.paytr_token}`
      };
      
    } catch (error) {
      console.error('PayTR payment creation error:', error);
      return {
        success: false,
        error: 'Ödeme oluşturulurken hata oluştu'
      };
    }
  }
  
  private generateToken(hashString: string): string {
    // In production, use actual HMAC-SHA256 with merchant key
    // For demo, return a mock token
    return 'mock_token_' + btoa(hashString).substring(0, 20);
  }
  
  verifyCallback(callbackData: Record<string, any>): boolean {
    // Verify PayTR callback hash
    // In production, implement actual hash verification
    return true;
  }
}

// Initialize PayTR service
export const paytrService = new PayTRService({
  merchantId: process.env.PAYTR_MERCHANT_ID || '',
  merchantKey: process.env.PAYTR_MERCHANT_KEY || '',
  merchantSalt: process.env.PAYTR_MERCHANT_SALT || '',
  testMode: process.env.NODE_ENV !== 'production'
});