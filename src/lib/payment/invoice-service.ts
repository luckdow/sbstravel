import { generateQRCode } from '../../utils/qrCode';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  company: {
    name: string;
    address: string;
    taxNumber: string;
    phone: string;
    email: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  qrCode: string;
  reservationId: string;
}

export class InvoiceService {
  private static instance: InvoiceService;
  private companyInfo = {
    name: 'AYT Transfer Ltd. Şti.',
    address: 'Muratpaşa Mah. Atatürk Cad. No:123/A Muratpaşa/ANTALYA',
    taxNumber: '1234567890',
    phone: '+90 242 123 45 67',
    email: 'info@ayttransfer.com'
  };

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const time = now.getTime().toString().slice(-6);
    
    return `INV-${year}${month}${day}-${time}`;
  }

  createInvoice(
    reservationData: any,
    paymentData: any,
    customerInfo: any
  ): InvoiceData {
    const invoiceNumber = this.generateInvoiceNumber();
    const now = new Date();
    const qrCode = generateQRCode();

    // Calculate items
    const items: InvoiceItem[] = [
      {
        description: `Transfer Hizmeti: ${reservationData.route}`,
        quantity: 1,
        unitPrice: paymentData.amount,
        total: paymentData.amount
      }
    ];

    // Add additional services if any
    if (reservationData.additionalServices && reservationData.additionalServices.length > 0) {
      reservationData.additionalServices.forEach((service: string) => {
        const servicePrice = this.getServicePrice(service);
        items.push({
          description: `Ek Hizmet: ${this.getServiceName(service)}`,
          quantity: 1,
          unitPrice: servicePrice,
          total: servicePrice
        });
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.18; // 18% KDV
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      invoiceNumber,
      date: now.toLocaleDateString('tr-TR'),
      dueDate: now.toLocaleDateString('tr-TR'),
      customer: {
        name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address
      },
      company: this.companyInfo,
      items,
      subtotal,
      tax,
      total,
      qrCode,
      reservationId: reservationData.id
    };
  }

  private getServicePrice(serviceId: string): number {
    const servicePrices: Record<string, number> = {
      'baby-seat': 10,
      'booster-seat': 8,
      'meet-greet': 15,
      'extra-stop': 20,
      'waiting-time': 25,
      'premium-water': 5
    };
    return servicePrices[serviceId] || 0;
  }

  private getServiceName(serviceId: string): string {
    const serviceNames: Record<string, string> = {
      'baby-seat': 'Bebek Koltuğu',
      'booster-seat': 'Yükseltici Koltuk',
      'meet-greet': 'Karşılama Tabelası',
      'extra-stop': 'Ek Durak',
      'waiting-time': 'Bekleme Süresi (+30dk)',
      'premium-water': 'Premium Su İkramı'
    };
    return serviceNames[serviceId] || serviceId;
  }

  async generatePDF(invoiceData: InvoiceData): Promise<Blob> {
    // In a real implementation, you would use a PDF generation library
    // like jsPDF or PDFKit to create the actual PDF
    
    // For demo purposes, we'll create a simple text representation
    const pdfContent = this.generatePDFContent(invoiceData);
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  private generatePDFContent(invoiceData: InvoiceData): string {
    return `
FATURA
======

Fatura No: ${invoiceData.invoiceNumber}
Tarih: ${invoiceData.date}
Rezervasyon No: ${invoiceData.reservationId}

FATURA KESİLEN FİRMA:
${invoiceData.company.name}
${invoiceData.company.address}
Vergi No: ${invoiceData.company.taxNumber}
Tel: ${invoiceData.company.phone}
E-posta: ${invoiceData.company.email}

MÜŞTERİ BİLGİLERİ:
${invoiceData.customer.name}
Tel: ${invoiceData.customer.phone}
E-posta: ${invoiceData.customer.email}

HİZMET DETAYLARI:
${invoiceData.items.map(item => 
  `${item.description} - ${item.quantity} x $${item.unitPrice} = $${item.total}`
).join('\n')}

ARA TOPLAM: $${invoiceData.subtotal.toFixed(2)}
KDV (%18): $${invoiceData.tax.toFixed(2)}
GENEL TOPLAM: $${invoiceData.total.toFixed(2)}

QR Kod: ${invoiceData.qrCode}
    `;
  }

  async sendInvoiceByEmail(invoiceData: InvoiceData, pdfBlob: Blob): Promise<boolean> {
    try {
      // In a real implementation, you would integrate with an email service
      // like SendGrid, AWS SES, or similar
      
      console.log('Sending invoice email to:', invoiceData.customer.email);
      console.log('Invoice data:', invoiceData);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return false;
    }
  }

  async sendInvoiceBySMS(invoiceData: InvoiceData): Promise<boolean> {
    try {
      // In a real implementation, you would integrate with an SMS service
      // like Twilio, Nexmo, or a local Turkish SMS provider
      
      const message = `
AYT Transfer Faturanız Hazır!
Fatura No: ${invoiceData.invoiceNumber}
Tutar: $${invoiceData.total.toFixed(2)}
QR Kod: ${invoiceData.qrCode}
Detaylar için: ${process.env.REACT_APP_BASE_URL}/invoice/${invoiceData.invoiceNumber}
      `;
      
      console.log('Sending SMS to:', invoiceData.customer.phone);
      console.log('SMS content:', message);
      
      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending invoice SMS:', error);
      return false;
    }
  }
}

export const invoiceService = InvoiceService.getInstance();