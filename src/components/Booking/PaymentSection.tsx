import React, { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { PriceCalculation, BookingFormData } from '../../types';

interface PaymentSectionProps {
  priceCalculation: PriceCalculation;
  bookingData: BookingFormData;
}

export default function PaymentSection({ priceCalculation, bookingData }: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Payment success will be handled by parent component
    }, 3000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Ödeme Bilgileri</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ödeme Yöntemi</label>
            <div className="space-y-3">
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
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === 'credit-card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Numarası</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Son Kullanma</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kart Sahibi Adı</label>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  defaultValue={`${bookingData.customerInfo?.firstName || ''} ${bookingData.customerInfo?.lastName || ''}`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* Security Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Güvenli Ödeme</h4>
                <p className="text-sm text-green-700 mt-1">
                  Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. 
                  Kart bilgileriniz saklanmaz.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <span className="text-sm text-gray-700">
                <a href="/terms" className="text-blue-600 hover:underline">Kullanım Şartları</a> ve{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikası</a>'nı 
                okudum ve kabul ediyorum.
              </span>
            </label>
            
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Kampanya ve promosyonlardan haberdar olmak istiyorum.
              </span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rezervasyon Özeti</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Türü:</span>
                <span className="font-semibold text-gray-800">
                  {bookingData.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Varış Noktası:</span>
                <span className="font-semibold text-gray-800">{bookingData.destination}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tarih & Saat:</span>
                <span className="font-semibold text-gray-800">
                  {bookingData.pickupDate} - {bookingData.pickupTime}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Yolcu Sayısı:</span>
                <span className="font-semibold text-gray-800">{bookingData.passengerCount} Kişi</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Araç Tipi:</span>
                <span className="font-semibold text-gray-800 capitalize">{bookingData.vehicleType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Mesafe:</span>
                <span className="font-semibold text-gray-800">{priceCalculation.distance.toFixed(1)} km</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Transfer Ücreti:</span>
                <span className="font-semibold text-gray-800">${priceCalculation.basePrice.toFixed(2)}</span>
              </div>
              
              {priceCalculation.additionalServicesCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ek Hizmetler:</span>
                  <span className="font-semibold text-gray-800">+${priceCalculation.additionalServicesCost.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold text-gray-800 mt-2 pt-2 border-t border-gray-200">
                <span>Toplam:</span>
                <span className="text-blue-600">${priceCalculation.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Ödeme İşleniyor...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>Güvenli Ödeme Yap - ${priceCalculation.totalPrice.toFixed(2)}</span>
              </>
            )}
          </button>

          {/* Payment Security */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
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
            <p className="text-xs text-gray-400">
              PayTR güvenli ödeme altyapısı ile korunmaktadır
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}