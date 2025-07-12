import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, DollarSign, Loader2 } from 'lucide-react';
import { PriceCalculation, BookingFormData } from '../../types';
import { transactionService } from '../../lib/services/transaction-service';
import { notificationService } from '../../lib/services/notification-service';
import { updateReservation } from '../../lib/firebase/collections';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface PaymentSectionProps {
  priceCalculation: PriceCalculation;
  bookingData: BookingFormData;
  onPaymentSuccess?: (transactionId: string) => void;
  reservationId?: string;
}

export default function PaymentSection({ 
  priceCalculation, 
  bookingData, 
  onPaymentSuccess,
  reservationId 
}: PaymentSectionProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const navigate = useNavigate();
  const { settings, fetchSettings } = useStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handlePayment = async () => {
    if (!termsAccepted) {
      toast.error('Lütfen kullanım şartlarını kabul edin');
      return;
    }

    if (!bookingData.customerInfo) {
      toast.error('Müşteri bilgileri eksik');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create transaction
      const transaction = await transactionService.createTransaction({
        reservationId: reservationId || 'temp_' + Date.now(),
        amount: priceCalculation.totalPrice,
        currency: 'USD',
        customerInfo: bookingData.customerInfo,
        reservationData: {
          route: `${bookingData.transferType === 'airport-hotel' ? 'Airport → ' + bookingData.destination.name : bookingData.destination.name + ' → Airport'}`,
          ...bookingData
        },
        paymentMethod: paymentMethod as 'credit-card' | 'bank-transfer',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      // Process payment
      const result = await transactionService.processPayment(transaction.id, {
        reservationId: reservationId || 'temp_' + Date.now(),
        amount: priceCalculation.totalPrice,
        currency: 'USD',
        customerInfo: bookingData.customerInfo,
        reservationData: {
          route: `${bookingData.transferType === 'airport-hotel' ? 'Airport → ' + bookingData.destination.name : bookingData.destination.name + ' → Airport'}`,
          ...bookingData
        },
        paymentMethod: paymentMethod as 'credit-card' | 'bank-transfer',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

      if (result.success) {
        // Update reservation status in Firebase
        if (reservationId) {
          try {
            await updateReservation(reservationId, {
              paymentStatus: 'completed',
              paymentId: transaction.id,
              status: 'confirmed'
            });
            console.log('Reservation payment status updated in Firebase');
          } catch (updateError) {
            console.error('Failed to update reservation status:', updateError);
            // Don't fail the payment process if this fails
          }
        }

        if (paymentMethod === 'credit-card' && result.paymentUrl) {
          // For testing, we'll just simulate success
          toast.success('Test modu: Ödeme başarılı kabul edildi');
          
          // Navigate to success page with transaction info
          navigate('/payment/success', { 
            state: { 
              transaction: result.transaction,
              method: 'credit-card' 
            } 
          });
        } else if (paymentMethod === 'bank-transfer') {
          // Show bank transfer success
          toast.success('Havale bilgileri e-posta adresinize gönderildi');
          
          // Navigate to success page with transaction info
          navigate('/payment/success', { 
            state: { 
              transaction: result.transaction,
              method: 'bank-transfer' 
            } 
          });
        }

        // Call success callback
        if (onPaymentSuccess) {
          onPaymentSuccess(transaction.id);
        }
      } else {
        toast.error(result.error || 'Ödeme işlemi başarısız');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setIsProcessing(false);
    }
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

          {/* Bank Transfer Info */}
          {paymentMethod === 'bank-transfer' && (
            <div className="bg-blue-50 rounded-2xl p-6">
              <h4 className="font-bold text-blue-800 mb-4">Banka Hesap Bilgileri</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Banka:</span> {settings?.company?.bankName || 'Türkiye İş Bankası'}</div>
                <div><span className="font-medium">Hesap Sahibi:</span> {settings?.company?.name || 'SBS TRAVEL Ltd. Şti.'}</div>
                <div><span className="font-medium">IBAN:</span> {settings?.company?.iban || 'TR12 0006 4000 0011 2345 6789 01'}</div>
                <div><span className="font-medium">Açıklama:</span> {bookingData.customerInfo?.firstName} {bookingData.customerInfo?.lastName}</div>
              </div>
              <div className="mt-4 p-3 bg-yellow-100 rounded-xl">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Havale/EFT sonrası dekont fotoğrafını WhatsApp ile gönderiniz: {settings?.company?.phone || '+90 242 123 45 67'}
                </p>
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
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
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
                checked={marketingAccepted}
                onChange={(e) => setMarketingAccepted(e.target.checked)}
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
                <span className="font-semibold text-gray-800">{bookingData.destination?.name || 'Bilinmiyor'}</span>
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

              {bookingData.flightNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Uçuş Numarası:</span>
                  <span className="font-semibold text-gray-800">{bookingData.flightNumber}</span>
                </div>
              )}
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
            disabled={isProcessing || !termsAccepted}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>
                  {paymentMethod === 'credit-card' ? 'Ödeme sayfasına yönlendiriliyor...' : 'İşleniyor...'}
                </span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>
                  {paymentMethod === 'credit-card' 
                    ? `Ödeme Yap & Rezervasyonu Tamamla - $${priceCalculation.totalPrice.toFixed(2)}`
                    : `Havale Bilgilerini Al & Rezervasyonu Tamamla - $${priceCalculation.totalPrice.toFixed(2)}`
                  }
                </span>
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
              {settings?.payment?.paytr?.enabled ? 'PayTR güvenli ödeme altyapısı ile korunmaktadır' : 'Test modu: Gerçek ödeme alınmayacaktır'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}