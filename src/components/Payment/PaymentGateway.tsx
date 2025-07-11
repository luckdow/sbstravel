import React, { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, Loader2, DollarSign } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (paymentResult: any) => void;
  onError: (error: string) => void;
}

export default function PaymentGateway({
  amount,
  currency,
  orderId,
  customerInfo,
  onSuccess,
  onError
}: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate PayTR integration
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const paymentResult = {
        success: true,
        transactionId: 'TXN_' + Date.now(),
        amount,
        currency,
        orderId,
        timestamp: new Date().toISOString()
      };
      
      onSuccess(paymentResult);
    } catch (error) {
      onError('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Güvenli Ödeme</h2>
        <p className="text-gray-600">256-bit SSL şifreleme ile korumalı ödeme işlemi</p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {amount.toFixed(2)} {currency}
          </div>
          <div className="text-gray-600">Ödenecek Tutar</div>
          <div className="text-sm text-gray-500 mt-2">Sipariş No: {orderId}</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Ödeme Yöntemi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="relative">
            <input
              type="radio"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'credit-card'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-800">Kredi/Banka Kartı</div>
                  <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                </div>
              </div>
            </div>
          </label>

          <label className="relative">
            <input
              type="radio"
              value="bank-transfer"
              checked={paymentMethod === 'bank-transfer'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="sr-only"
            />
            <div className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'bank-transfer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-800">Banka Havalesi</div>
                  <div className="text-sm text-gray-600">EFT/Havale ile ödeme</div>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Credit Card Form */}
      {paymentMethod === 'credit-card' && (
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Numarası</label>
            <input
              type="text"
              value={cardData.number}
              onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Son Kullanma</label>
              <input
                type="text"
                value={cardData.expiry}
                onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
              <input
                type="text"
                value={cardData.cvv}
                onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Sahibi Adı</label>
            <input
              type="text"
              value={cardData.name}
              onChange={(e) => setCardData({...cardData, name: e.target.value})}
              placeholder="Ad Soyad"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Bank Transfer Info */}
      {paymentMethod === 'bank-transfer' && (
        <div className="bg-blue-50 rounded-2xl p-6 mb-8">
          <h4 className="font-bold text-blue-800 mb-4">Banka Hesap Bilgileri</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Banka:</span> Türkiye İş Bankası</div>
            <div><span className="font-medium">Hesap Sahibi:</span> AYT Transfer Ltd. Şti.</div>
            <div><span className="font-medium">IBAN:</span> TR12 0006 4000 0011 2345 6789 01</div>
            <div><span className="font-medium">Açıklama:</span> {orderId} - {customerInfo.name}</div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-xl">
            <p className="text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              Havale/EFT sonrası dekont fotoğrafını WhatsApp ile gönderiniz: +90 242 123 45 67
            </p>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-800">Güvenli Ödeme Garantisi</h4>
            <p className="text-sm text-green-700 mt-1">
              Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. 
              Kart bilgileriniz saklanmaz ve üçüncü kişilerle paylaşılmaz.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isProcessing || (paymentMethod === 'credit-card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name))}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ödeme İşleniyor...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Güvenli Ödeme Yap - {amount.toFixed(2)} {currency}</span>
          </>
        )}
      </button>

      {/* Security Badges */}
      <div className="text-center mt-6">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span>SSL Güvenli</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>PCI DSS</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="h-4 w-4" />
            <span>256-bit Şifreleme</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          PayTR güvenli ödeme altyapısı ile korunmaktadır
        </p>
      </div>
    </div>
  );
}