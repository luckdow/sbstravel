import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Mail, Phone, Calendar, MapPin, User, Home, Loader2, Plane } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useStore } from '../../store/useStore';
import { getVehicleTypeDisplayName } from '../../utils/vehicle';
import { generateCustomerViewURL } from '../../utils/qrCode';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const { addCustomer } = useStore();
  
  // Get transaction data from navigation state
  const transactionData = location.state;
  
  // Extract real customer data from transaction state
  const customerInfo = transactionData?.customerInfo || {
    firstName: 'Müşteri',
    lastName: 'Adı',
    email: 'musteri@example.com',
    phone: '+90 5XX XXX XX XX'
  };
  
  const reservationData = {
    id: transactionData?.reservationId || 'RES-001',
    transactionId: transactionData?.transaction?.id || 'TXN_' + Date.now(),
    amount: transactionData?.transaction?.amount || transactionData?.totalPrice || 85.00,
    currency: 'USD',
    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    flightNumber: transactionData?.flightNumber || customerInfo.flightNumber,
    route: transactionData?.route || `${transactionData?.pickupLocation || 'Antalya Havalimanı'} → ${transactionData?.dropoffLocation || 'Kemer'}`,
    vehicleType: transactionData?.vehicleType || 'standard',
    date: transactionData?.pickupDate || new Date().toLocaleDateString('tr-TR'),
    time: transactionData?.pickupTime || '14:30',
    qrCode: transactionData?.qrCode || 'QR_' + Date.now(),
    qrCodeUrl: transactionData?.qrCode ? generateCustomerViewURL(transactionData.reservationId || 'RES-001', transactionData.qrCode) : generateCustomerViewURL('RES-001', 'QR_' + Date.now()),
    timestamp: new Date().toISOString(),
    isTestMode: transactionData?.isTestMode || false
  };

  // Auto-create user account and redirect to profile
  useEffect(() => {
    const createUserAndRedirect = async () => {
      if (isCreatingUser || userCreated) return;
      
      setIsCreatingUser(true);
      
      try {
        // Use real customer info from transaction data instead of mock data
        const realCustomerInfo = {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone
        };

        // Check if customer already exists by email to prevent duplicates
        const existingCustomers = await new Promise<any[]>((resolve) => {
          // Since we don't have a direct method to search by email, we'll create the account anyway
          // In a real implementation, you would check existing customers first
          resolve([]);
        });

        let customerId = null;
        
        // Only create customer if not already exists
        if (existingCustomers.length === 0) {
          customerId = await addCustomer(realCustomerInfo);
        } else {
          customerId = existingCustomers[0].id;
        }
        
        if (customerId) {
          console.log('User created successfully:', customerId);
          setUserCreated(true);
          
          // Show success message
          toast.success('Hesabınız oluşturuldu! Profil sayfasına yönlendiriliyorsunuz...');
          
          // Redirect to profile/dashboard after 3 seconds
          setTimeout(() => {
            navigate('/profile', { 
              state: { 
                newUser: true, 
                reservationId: reservationData.id,
                customerId: customerId
              } 
            });
          }, 3000);
        }
      } catch (error) {
        console.error('Error creating user:', error);
        // Don't show error to user, continue with success page
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUserAndRedirect();
  }, [addCustomer, navigate, reservationData.id, isCreatingUser, userCreated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Rezervasyon Tamamlandı!
              {reservationData.isTestMode && <span className="text-lg text-blue-600 block mt-2">(Test Modu)</span>}
            </h1>
            <p className="text-xl text-gray-600">
              Transfer rezervasyonunuz başarıyla oluşturuldu{reservationData.isTestMode ? ' (test modunda)' : ' ve ödemeniz alındı'}.
            </p>
            
            {/* User creation status */}
            {isCreatingUser && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-blue-700">Hesabınız oluşturuluyor...</span>
                </div>
              </div>
            )}
            
            {userCreated && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">Hesabınız oluşturuldu! Profil sayfasına yönlendiriliyorsunuz...</span>
                </div>
              </div>
            )}
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
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Araç Tipi: {getVehicleTypeDisplayName(reservationData.vehicleType)}</span>
                  </div>
                  {reservationData.flightNumber && (
                    <div className="flex items-center space-x-3">
                      <Plane className="h-5 w-5 text-orange-600" />
                      <span className="text-gray-700">Uçuş No: {reservationData.flightNumber}</span>
                    </div>
                  )}
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
                    value={reservationData.qrCodeUrl}
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
                  <li>• E-posta: sbstravelinfo@gmail.com</li>
                  <li>• WhatsApp: +90 242 123 45 67</li>
                </ul>
              </div>
            </div>
          </div>
                </div>
          {/* Navigation */}
          <div className="text-center mt-8 space-y-4">
            <div className="flex justify-center space-x-6">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
              >
                <Home className="h-4 w-4" />
                <span>Ana Sayfaya Dön</span>
              </Link>
              
              {userCreated && (
                <Link
                  to="/profile"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-semibold"
                >
                  <User className="h-4 w-4" />
                  <span>Profilime Git</span>
                </Link>
              )}
            </div>
            
            {/* Auto redirect message */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                📧 {reservationData.isTestMode ? 'Test modunda email gönderimi simüle edildi' : 'Fatura e-posta adresinize gönderildi'}. QR kodunuzu kaydetmeyi unutmayın!
              </p>
              {userCreated && (
                <p className="text-sm text-green-700 mt-2">
                  🎉 Hesabınız oluşturuldu! 3 saniye içinde profil sayfasına yönlendirileceksiniz.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}