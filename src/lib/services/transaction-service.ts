import { paytrService } from '../payment/paytr-integration';
import { invoiceService } from '../payment/invoice-service';

export interface Transaction {
  id: string;
  reservationId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'credit-card' | 'bank-transfer' | 'cash';
  paymentProvider: 'paytr' | 'manual';
  paytrToken?: string;
  paytrTransactionId?: string;
  invoiceNumber?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    attempts: number;
    lastAttempt: Date;
  };
  timestamps: {
    created: Date;
    updated: Date;
    completed?: Date;
    failed?: Date;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaymentProcessRequest {
  reservationId: string;
  amount: number;
  currency: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
  };
  reservationData: any;
  paymentMethod: 'credit-card' | 'bank-transfer';
  successUrl: string;
  failUrl: string;
}

export class TransactionService {
  private static instance: TransactionService;
  private transactions: Map<string, Transaction> = new Map();

  public static getInstance(): TransactionService {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  async createTransaction(request: PaymentProcessRequest): Promise<Transaction> {
    const transactionId = this.generateTransactionId();
    const orderId = this.generateOrderId();
    
    const transaction: Transaction = {
      id: transactionId,
      reservationId: request.reservationId,
      orderId,
      amount: request.amount,
      currency: request.currency,
      status: 'pending',
      paymentMethod: request.paymentMethod,
      paymentProvider: request.paymentMethod === 'credit-card' ? 'paytr' : 'manual',
      customerInfo: {
        name: `${request.customerInfo.firstName} ${request.customerInfo.lastName}`,
        email: request.customerInfo.email,
        phone: request.customerInfo.phone,
      },
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ipAddress: '127.0.0.1', // In production, get real IP
        attempts: 0,
        lastAttempt: new Date(),
      },
      timestamps: {
        created: new Date(),
        updated: new Date(),
      },
    };

    // Store transaction
    this.transactions.set(transactionId, transaction);
    
    // Persist to localStorage for demo
    this.saveTransactions();

    return transaction;
  }

  async processPayment(transactionId: string, request: PaymentProcessRequest): Promise<{
    success: boolean;
    paymentUrl?: string;
    transaction: Transaction;
    error?: string;
  }> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    try {
      // Update transaction attempt
      transaction.metadata.attempts += 1;
      transaction.metadata.lastAttempt = new Date();
      transaction.timestamps.updated = new Date();

      if (request.paymentMethod === 'credit-card') {
        // Process with PayTR
        const paymentResult = await paytrService.createPayment({
          amount: Math.round(request.amount * 100), // Convert to cents
          currency: request.currency,
          orderId: transaction.orderId,
          customerName: `${request.customerInfo.firstName} ${request.customerInfo.lastName}`,
          customerEmail: request.customerInfo.email,
          customerPhone: request.customerInfo.phone,
          customerAddress: request.customerInfo.address || 'Antalya, Turkey',
          successUrl: request.successUrl,
          failUrl: request.failUrl,
          description: `Transfer Service - Reservation ${request.reservationId}`,
          userBasket: [
            {
              name: `Transfer Service - ${request.reservationData.route || 'Airport Transfer'}`,
              price: Math.round(request.amount * 100),
              quantity: 1,
            },
          ],
        });

        if (paymentResult.success) {
          transaction.paytrToken = paymentResult.token;
          transaction.status = 'pending';
          
          this.updateTransaction(transaction);
          
          return {
            success: true,
            paymentUrl: paymentResult.paymentUrl,
            transaction,
          };
        } else {
          transaction.status = 'failed';
          transaction.error = {
            code: 'PAYTR_ERROR',
            message: paymentResult.error || 'Payment processing failed',
          };
          transaction.timestamps.failed = new Date();
          
          this.updateTransaction(transaction);
          
          return {
            success: false,
            transaction,
            error: paymentResult.error,
          };
        }
      } else if (request.paymentMethod === 'bank-transfer') {
        // For bank transfer, mark as pending and generate invoice
        transaction.status = 'pending';
        
        // Generate invoice
        const invoiceData = invoiceService.createInvoice(
          request.reservationData,
          { amount: request.amount },
          request.customerInfo
        );
        
        transaction.invoiceNumber = invoiceData.invoiceNumber;
        
        this.updateTransaction(transaction);
        
        // Send invoice by email
        await this.sendBankTransferInstructions(transaction, invoiceData);
        
        return {
          success: true,
          transaction,
        };
      }

      throw new Error('Unsupported payment method');
    } catch (error) {
      console.error('Payment processing error:', error);
      
      transaction.status = 'failed';
      transaction.error = {
        code: 'PROCESSING_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };
      transaction.timestamps.failed = new Date();
      
      this.updateTransaction(transaction);
      
      return {
        success: false,
        transaction,
        error: transaction.error.message,
      };
    }
  }

  async completeTransaction(
    transactionId: string, 
    paytrData?: any
  ): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = 'completed';
    transaction.timestamps.completed = new Date();
    transaction.timestamps.updated = new Date();
    
    if (paytrData) {
      transaction.paytrTransactionId = paytrData.transactionId;
    }

    this.updateTransaction(transaction);
    
    // Generate and send invoice
    await this.generateInvoiceForCompletedTransaction(transaction);
    
    return transaction;
  }

  async failTransaction(
    transactionId: string, 
    error: { code: string; message: string; details?: any }
  ): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = 'failed';
    transaction.error = error;
    transaction.timestamps.failed = new Date();
    transaction.timestamps.updated = new Date();

    this.updateTransaction(transaction);
    
    return transaction;
  }

  async refundTransaction(
    transactionId: string, 
    amount: number, 
    reason: string
  ): Promise<boolean> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'completed') {
      throw new Error('Can only refund completed transactions');
    }

    try {
      let refundResult = false;
      
      if (transaction.paymentProvider === 'paytr' && transaction.paytrTransactionId) {
        refundResult = await paytrService.refundPayment(
          transaction.paytrTransactionId,
          Math.round(amount * 100), // Convert to cents
          reason
        );
      } else {
        // Manual refund for bank transfers
        refundResult = true; // Mark as successful, manual processing required
      }

      if (refundResult) {
        transaction.status = 'refunded';
        transaction.timestamps.updated = new Date();
        this.updateTransaction(transaction);
      }

      return refundResult;
    } catch (error) {
      console.error('Refund error:', error);
      return false;
    }
  }

  getTransaction(transactionId: string): Transaction | undefined {
    return this.transactions.get(transactionId);
  }

  getTransactionByOrderId(orderId: string): Transaction | undefined {
    return Array.from(this.transactions.values()).find(t => t.orderId === orderId);
  }

  getTransactionsByReservation(reservationId: string): Transaction[] {
    return Array.from(this.transactions.values()).filter(
      t => t.reservationId === reservationId
    );
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  getTransactionStats() {
    const transactions = this.getAllTransactions();
    
    return {
      total: transactions.length,
      completed: transactions.filter(t => t.status === 'completed').length,
      pending: transactions.filter(t => t.status === 'pending').length,
      failed: transactions.filter(t => t.status === 'failed').length,
      refunded: transactions.filter(t => t.status === 'refunded').length,
      totalAmount: transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      averageAmount: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
        : 0,
    };
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `TXN_${timestamp}_${random}`.toUpperCase();
  }

  private generateOrderId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 6);
    return `ORD_${timestamp}_${random}`.toUpperCase();
  }

  private updateTransaction(transaction: Transaction): void {
    transaction.timestamps.updated = new Date();
    this.transactions.set(transaction.id, transaction);
    this.saveTransactions();
  }

  private saveTransactions(): void {
    try {
      const transactionsArray = Array.from(this.transactions.entries());
      localStorage.setItem('ayt_transactions', JSON.stringify(transactionsArray));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  private loadTransactions(): void {
    try {
      const saved = localStorage.getItem('ayt_transactions');
      if (saved) {
        const transactionsArray = JSON.parse(saved);
        this.transactions = new Map(transactionsArray.map(([id, tx]: [string, any]) => [
          id,
          {
            ...tx,
            timestamps: {
              ...tx.timestamps,
              created: new Date(tx.timestamps.created),
              updated: new Date(tx.timestamps.updated),
              completed: tx.timestamps.completed ? new Date(tx.timestamps.completed) : undefined,
              failed: tx.timestamps.failed ? new Date(tx.timestamps.failed) : undefined,
            },
            metadata: {
              ...tx.metadata,
              lastAttempt: new Date(tx.metadata.lastAttempt),
            },
          },
        ]));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  private async generateInvoiceForCompletedTransaction(transaction: Transaction): Promise<void> {
    try {
      // This would be called with actual reservation data in production
      const invoiceData = invoiceService.createInvoice(
        { 
          id: transaction.reservationId,
          route: 'Airport Transfer',
          additionalServices: []
        },
        { amount: transaction.amount },
        {
          firstName: transaction.customerInfo.name.split(' ')[0],
          lastName: transaction.customerInfo.name.split(' ').slice(1).join(' '),
          email: transaction.customerInfo.email,
          phone: transaction.customerInfo.phone,
        }
      );

      transaction.invoiceNumber = invoiceData.invoiceNumber;
      
      // Send invoice by email
      const pdfBlob = await invoiceService.generatePDF(invoiceData);
      await invoiceService.sendInvoiceByEmail(invoiceData, pdfBlob);
      
      // Send SMS notification
      await invoiceService.sendInvoiceBySMS(invoiceData);
      
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  }

  private async sendBankTransferInstructions(transaction: Transaction, invoiceData: any): Promise<void> {
    try {
      // Send email with bank transfer instructions
      console.log('Sending bank transfer instructions to:', transaction.customerInfo.email);
      
      // In production, this would send actual email with bank details
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error('Error sending bank transfer instructions:', error);
    }
  }

  // Initialize the service
  constructor() {
    this.loadTransactions();
  }
}

export const transactionService = TransactionService.getInstance();