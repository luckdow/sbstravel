import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Share2, Mail, Phone, Calendar, MapPin, User, Home } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  
  const reservationData = {
    id: searchParams.get('order_id') || 'RES-001',
    transactionId: searchParams.get('transaction_id') || 'TXN_123456',
    amount: 85.00,
    currency: 'USD',
    customerName: 'Ahmet Yılmaz',
    route: 'Antalya Havalimanı → Kemer',
    date: '2024-01-15',
    time: '14:30',
    qrCode: 'QR_' + Date.now(),
    timestamp: new Date().toISOString()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎉 Rezervasyon Tamamlandı!</h1>
            <p className="text-xl text-gray-600">
              Transfer rezervasyonunuz başarıyla oluşturuldu ve ödemeniz alındı.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reservation Details */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Rezervasyon Detayları</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Rezervasyon No:</span>
                  <span className="font-semibold text-gray-800">{reservationData.id}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">İşlem No:</span>
                  <span className="font-semibold text-gray-800">{reservationData.transactionId}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Ödenen Tutar:</span>
                  <span className="font-bold text-green-600 text-lg">
                    ${reservationData.amount.toFixed(2)} {reservationData.currency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Ödeme Tarihi:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(reservationData.timestamp).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>

              {/* Transfer Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Bilgileri</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">{reservationData.route}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-700">{reservationData.date} - {reservationData.time}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Faturayı İndir</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>E-posta</span>
                  </button>
                  <button className="bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Transfer QR Kodu</h2>
              
              <div className="text-center">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 inline-block mb-6">
                  <QRCode
                    value={reservationData.qrCode}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-blue-800 mb-2">QR Kod Nasıl Kullanılır?</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• Transfer günü şoförünüze QR kodu gösterin</li>
                    <li>• Şoför QR kodu okutarak transferi başlatacak</li>
                    <li>• QR kod olmadan transfer başlatılamaz</li>
                    <li>• Kodu telefonunuzda saklayın veya yazdırın</li>
                  </ul>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                  <Share2 className="h-5 w-5" />
                  <span>QR Kodu Paylaş</span>
                </button>
              </div>
            </div>
          </div>
          {/* Important Notes */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h3 className="font-bold text-yellow-800 mb-4">Önemli Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <h4 className="font-semibold mb-2">Transfer Öncesi:</h4>
                <ul className="space-y-1">
                  <li>• Transfer saatinden 15 dakika önce hazır olun</li>
                  <li>• Şoförünüz size WhatsApp ile ulaşacak</li>
                  <li>• QR kodunuzu hazır bulundurun</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">İletişim:</h4>
                <ul className="space-y-1">
                  <li>• 7/24 Destek: +90 242 123 45 67</li>
                  <li>• E-posta: info@ayttransfer.com</li>
                  <li>• WhatsApp: +90 242 123 45 67</li>
                </ul>
              </div>
            </div>
          </div>
                </div>
          {/* Navigation */}
          <div className="text-center mt-8 space-y-4">
            <Link
              to="/customer-panel"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <User className="h-5 w-5" />
              <span>Müşteri Paneline Git</span>
            </Link>
            
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Ana Sayfaya Dön</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}