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
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = '#2563eb'; // Blue
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
          dark: primaryColor,
          light: '#ffffff'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }
  
  // Header
  doc.setFillColor(37, 99, 235); // Blue background
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.company.name, 20, 25);
  
  // Invoice title
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSFER FATURASI', 20, 60);
  
  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Company info (left side)
  doc.setFont('helvetica', 'bold');
  doc.text('Şirket Bilgileri:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(data.company.name, 20, 90);
  doc.text(data.company.address, 20, 100);
  doc.text(`Tel: ${data.company.phone}`, 20, 110);
  doc.text(`E-posta: ${data.company.email}`, 20, 120);
  
  if (data.company.taxNumber) {
    doc.text(`Vergi No: ${data.company.taxNumber}`, 20, 130);
  }
  
  // Invoice info (right side)
  const rightColumn = pageWidth - 80;
  doc.setFont('helvetica', 'bold');
  doc.text('Fatura Bilgileri:', rightColumn, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fatura No: INV-${data.reservation.id}`, rightColumn, 90);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, rightColumn, 100);
  doc.text(`Rezervasyon No: ${data.reservation.id}`, rightColumn, 110);
  
  // Customer info
  doc.setFont('helvetica', 'bold');
  doc.text('Müşteri Bilgileri:', 20, 160);
  doc.setFont('helvetica', 'normal');
  doc.text(data.reservation.customerName, 20, 170);
  doc.text(data.reservation.customerEmail, 20, 180);
  doc.text(data.reservation.customerPhone, 20, 190);
  
  // QR Code (if available)
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', rightColumn, 140, 30, 30);
    doc.setFontSize(8);
    doc.text('Transfer QR Kodu', rightColumn, 180);
  }
  
  // Service details table
  const tableStartY = 220;
  
  // Table header
  doc.setFillColor(243, 244, 246); // Light gray
  doc.rect(20, tableStartY, pageWidth - 40, 15, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Hizmet Detayları', 25, tableStartY + 10);
  
  // Table content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  let currentY = tableStartY + 25;
  
  // Service row
  doc.text('Transfer Hizmeti', 25, currentY);
  doc.text(`${data.reservation.pickupLocation} → ${data.reservation.dropoffLocation}`, 25, currentY + 10);
  doc.text(`Tarih: ${data.reservation.pickupDate} ${data.reservation.pickupTime}`, 25, currentY + 20);
  doc.text(`Araç Tipi: ${getVehicleDisplayName(data.reservation.vehicleType)}`, 25, currentY + 30);
  
  // Price (right aligned)
  const priceText = `$${data.reservation.totalPrice.toFixed(2)}`;
  const priceWidth = doc.getTextWidth(priceText);
  doc.text(priceText, pageWidth - 25 - priceWidth, currentY);
  
  // Total line
  currentY += 50;
  doc.line(20, currentY, pageWidth - 20, currentY);
  currentY += 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOPLAM:', pageWidth - 80, currentY);
  const totalText = `$${data.reservation.totalPrice.toFixed(2)}`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - 25 - totalWidth, currentY);
  
  // Bank information
  if (data.company.bankName && data.company.iban) {
    currentY += 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Ödeme Bilgileri:', 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Banka: ${data.company.bankName}`, 20, currentY + 10);
    doc.text(`IBAN: ${data.company.iban}`, 20, currentY + 20);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Bu fatura elektronik olarak oluşturulmuştur.', 20, footerY);
  doc.text('Transfer hizmetiniz için teşekkür ederiz.', 20, footerY + 10);
  
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