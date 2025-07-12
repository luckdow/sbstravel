import React from 'react';
import { Download, Mail, Printer, FileText, Calendar, MapPin, User, DollarSign } from 'lucide-react';
import QRCode from 'react-qr-code';

interface InvoiceData {
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
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  qrCode: string;
  reservationId: string;
}

interface InvoiceGeneratorProps {
  invoiceData: InvoiceData;
  onDownload: () => void;
  onEmail: () => void;
  onPrint: () => void;
}

export default function InvoiceGenerator({ 
  invoiceData, 
  onDownload, 
  onEmail, 
  onPrint 
}: InvoiceGeneratorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FATURA</h1>
            <p className="text-blue-100">#{invoiceData.invoiceNumber}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onDownload}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              title="İndir"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onEmail}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              title="E-posta Gönder"
            >
              <Mail className="h-5 w-5" />
            </button>
            <button
              onClick={onPrint}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              title="Yazdır"
            >
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Company & Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Fatura Kesilen Firma</h3>
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-lg">{invoiceData.company.name}</div>
              <div className="text-gray-600">{invoiceData.company.address}</div>
              <div className="text-gray-600">Vergi No: {invoiceData.company.taxNumber}</div>
              <div className="text-gray-600">Tel: {invoiceData.company.phone}</div>
              <div className="text-gray-600">E-posta: {invoiceData.company.email}</div>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Müşteri Bilgileri</h3>
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-lg">{invoiceData.customer.name}</div>
              {invoiceData.customer.address && (
                <div className="text-gray-600">{invoiceData.customer.address}</div>
              )}
              <div className="text-gray-600">Tel: {invoiceData.customer.phone}</div>
              <div className="text-gray-600">E-posta: {invoiceData.customer.email}</div>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-gray-800">Fatura Tarihi</span>
            </div>
            <div className="text-gray-600">{invoiceData.date}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-gray-800">Rezervasyon No</span>
            </div>
            <div className="text-gray-600">{invoiceData.reservationId}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-gray-800">Toplam Tutar</span>
            </div>
            <div className="text-lg font-bold text-green-600">${invoiceData.total.toFixed(0)}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Hizmet Detayları</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hizmet Açıklaması
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birim Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.unitPrice.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${item.total.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Totals */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Ara Toplam:</span>
              <span className="font-semibold">${invoiceData.subtotal.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">KDV (%18):</span>
              <span className="font-semibold">${invoiceData.tax.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
              <span className="text-lg font-bold text-gray-800">GENEL TOPLAM:</span>
              <span className="text-2xl font-bold text-green-600">${invoiceData.total.toFixed(0)}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h4 className="font-bold text-gray-800 mb-4">Transfer QR Kodu</h4>
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block">
              <QRCode
                value={invoiceData.qrCode}
                size={150}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Transfer günü şoföre gösteriniz
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Ödeme Bilgileri</h4>
              <p className="text-sm text-gray-600">
                Ödeme kredi kartı ile alınmıştır. İade işlemleri için müşteri hizmetleri ile iletişime geçiniz.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 mb-2">İletişim</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Tel: +90 242 123 45 67</div>
                <div>E-posta: sbstravelinfo@gmail.com</div>
                <div>Web: www.sbstravel.com</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 text-xs text-gray-500">
            Bu fatura elektronik ortamda oluşturulmuş olup yasal geçerliliği vardır.
          </div>
        </div>
      </div>
    </div>
  );
}