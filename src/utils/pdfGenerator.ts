import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface InvoiceData {
  reservation: {
    id: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    pickupTime: string;
    totalPrice: number;
    vehicleType: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    qrCode?: string;
  };
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxNumber?: string;
    bankName?: string;
    iban?: string;
  };
}

export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  // Create a new PDF document with better formatting
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = '#3b82f6'; // Blue
  const secondaryColor = '#8b5cf6'; // Purple
  const textColor = '#374151'; // Gray
  const lightGray = '#f3f4f6';
  
  // Generate QR Code
  let qrCodeDataUrl = '';
  if (data.reservation.qrCode) {
    try {
      qrCodeDataUrl = await QRCode.toDataURL(data.reservation.qrCode, {
        width: 100,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
  
  // Header
  // Create gradient-like header with two colors
  doc.setFillColor(59, 130, 246); // Blue
  doc.rect(0, 0, pageWidth, 35, 'F');
  doc.setFillColor(139, 92, 246, 0.8); // Purple with transparency
  doc.rect(pageWidth/2, 0, pageWidth/2, 35, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.company.name, 15, 15);
  
  // Add "FATURA" text to header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSFER FATURASI', pageWidth - 60, 15);
  
  // Add date to header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, pageWidth - 60, 22);
  
  // Add invoice number to header
  doc.text(`Fatura No: INV-${data.reservation.id}`, pageWidth - 60, 27);
  
  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(55, 65, 81);
  
  // Company info (left side)
  doc.setFont('helvetica', 'bold');
  doc.text('Şirket Bilgileri:', 15, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(data.company.name, 15, 50);
  doc.text(data.company.address, 15, 55);
  doc.text(`Tel: ${data.company.phone}`, 15, 60);
  doc.text(`E-posta: ${data.company.email}`, 15, 65);
  
  if (data.company.taxNumber) {
    doc.text(`Vergi No: ${data.company.taxNumber}`, 15, 70);
  }
  
  // QR Code (right side)
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', pageWidth - 50, 45, 35, 35);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Transfer QR Kodu', pageWidth - 40, 85);
  }
  
  // Customer info
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('Müşteri Bilgileri:', 15, 90);
  doc.setFont('helvetica', 'normal');
  doc.text(data.reservation.customerName, 15, 95);
  doc.text(data.reservation.customerEmail, 15, 100);
  doc.text(data.reservation.customerPhone, 15, 105);
  
  // Service details table
  const tableStartY = 115;
  
  // Table header
  doc.setFillColor(59, 130, 246, 0.1); // Light blue with transparency
  doc.rect(15, tableStartY, pageWidth - 30, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Hizmet Detayları', 20, tableStartY + 7);
  doc.text('Tutar', pageWidth - 30, tableStartY + 7);
  
  // Table content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let currentY = tableStartY + 15;
  
  // Service row
  doc.text('Transfer Hizmeti', 20, currentY);
  doc.text(`${data.reservation.pickupLocation} → ${data.reservation.dropoffLocation}`, 20, currentY + 5);
  doc.text(`Tarih: ${data.reservation.pickupDate} ${data.reservation.pickupTime}`, 20, currentY + 10);
  doc.text(`Araç Tipi: ${getVehicleDisplayName(data.reservation.vehicleType)}`, 20, currentY + 15);
  
  // Price (right aligned)
  const priceText = `$${data.reservation.totalPrice.toFixed(2)}`;
  const priceWidth = doc.getTextWidth(priceText);
  doc.text(priceText, pageWidth - 30, currentY + 7);
  
  // Total line
  currentY += 25;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, currentY, pageWidth - 15, currentY);
  currentY += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOPLAM:', pageWidth - 70, currentY);
  const totalText = `$${data.reservation.totalPrice.toFixed(2)}`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - 30, currentY);
  
  // Bank information
  if (data.company.bankName && data.company.iban) {
    currentY += 20;
    
    // Add a light background for bank info section
    doc.setFillColor(243, 244, 246);
    doc.rect(15, currentY, pageWidth - 30, 25, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Ödeme Bilgileri:', 20, currentY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Banka: ${data.company.bankName}`, 20, currentY + 14);
    doc.text(`IBAN: ${data.company.iban}`, 20, currentY + 21);
  }
  
  // Footer
  const footerY = pageHeight - 20;
  
  // Add a line before footer
  doc.setDrawColor(200, 200, 200);
  doc.line(15, footerY - 10, pageWidth - 15, footerY - 10);
  
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Bu fatura elektronik olarak oluşturulmuştur.', 15, footerY);
  doc.text('Transfer hizmetiniz için teşekkür ederiz.', 15, footerY + 5);
  
  // Add page number
  doc.text(`Sayfa 1/1`, pageWidth - 25, footerY + 5);
  
  // Save the PDF
  const fileName = `SBS_Transfer_Fatura_${data.reservation.id}.pdf`;
  doc.save(fileName);
}

function getVehicleDisplayName(vehicleType: string): string {
  switch (vehicleType) {
    case 'standard':
      return 'Standart';
    case 'premium':
      return 'Premium';
    case 'luxury':
      return 'Lüks';
    default:
      return vehicleType || 'Standart';
  }
}