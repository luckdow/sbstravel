import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Share2, Mail, Phone, Calendar, MapPin, User, Home, Loader2, Plane } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useStore } from '../../store/useStore'; 
import { getVehicleTypeDisplayName } from '../../utils/vehicle';
import { generateCustomerViewURL } from '../../utils/qrCode';
import { setCustomerSession } from '../../utils/customerSession';
import { authService } from '../../lib/services/auth-service';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const { addCustomer } = useStore();
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  
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

  // One-time user account creation and redirect to reservation detail page
  useEffect(() => {
    const createUserAndRedirect = async () => {
      // Check if customer was already created for this reservation
      const customerCreatedKey = `sbs_customer_created_${reservationData.id}`;
      const alreadyCreated = localStorage.getItem(customerCreatedKey);
      
      if (isCreatingUser || userCreated) {
        return;
      }

      setIsCreatingUser(true);
      
      try {
        if (!alreadyCreated) {
          // Use real customer info from transaction data
          const customerInfo = {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            phone: customerInfo.phone
          };

          const customerId = await addCustomer(customerInfo);
          
          if (customerId) {
            console.log('User created successfully:', customerId);
            
            // Doğrudan müşteri oturumu oluştur
            setCustomerSession({
              customerId,
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              email: customerInfo.email,
              phone: customerInfo.phone,
              createdAt: new Date()
            });

            // Oturum bilgilerini localStorage'a doğrudan kaydet
            localStorage.setItem('sbs_customer_session', JSON.stringify({
              customerId,
              firstName: customerInfo.firstName,
              lastName: customerInfo.lastName,
              email: customerInfo.email,
              phone: customerInfo.phone,
              createdAt: new Date().toISOString()
            }));

            // Mark as created for this reservation to prevent duplicates
            localStorage.setItem(customerCreatedKey, customerId);
            
            toast.success('Hesabınız oluşturuldu!');
          }
        }
        
        setUserCreated(true);

        // Yönlendirme işlemini başlat
        setRedirecting(true);
        setTimeout(() => {
          navigate('/profile', { 
            state: {
              newReservation: true,
              reservationId: reservationData.id,
              registrationError: registrationError
            },
            replace: true 
          });
        }, 3000);
        
      } catch (error) {
        console.error('Error creating user:', error);
        // Still redirect to reservation detail page even if user creation fails
        setTimeout(() => {
          navigate('/reservation/detail', { 
            state: {
              reservationId: reservationData.id,
              customerInfo: customerInfo,
              ...transactionData
            },
            replace: true 
          });
        }, 2000);
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUserAndRedirect();
  }, []); // Empty dependency array - runs only once per component mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Ödeme Başarılı!
              {reservationData.isTestMode && <span className="text-lg text-blue-600 block mt-2">(Test Modu)</span>}
            </h1>
            <p className="text-xl text-gray-600">
              Ödemeniz başarıyla tamamlandı{reservationData.isTestMode ? ' (test modunda)' : ''}.
            </p>
          </div>

          {/* Processing Status */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {isCreatingUser && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="text-lg text-blue-700">Hesabınız oluşturuluyor...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}

            {redirecting && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  <span className="text-lg text-green-700">Profil sayfanıza yönlendiriliyorsunuz...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                </div>
              </div>
            )}
            
            {userCreated && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <span className="text-lg text-green-700">Hesabınız oluşturuldu!</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Rezervasyon detaylarınız hazırlanıyor...
              </h3>
              <p className="text-gray-600 mb-4">
                Kısa süre içinde profil sayfanıza yönlendirileceksiniz.
              </p>
              {registrationError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                  <p className="text-yellow-800 font-medium">Bilgi:</p>
                  <p className="text-yellow-700 text-sm">{registrationError}</p>
                  <p className="text-yellow-700 text-sm mt-2">
                    Rezervasyonunuz oluşturuldu, ancak hesap oluşturma sırasında bir sorun oluştu.
                    Profil sayfasına erişmek için lütfen manuel olarak giriş yapın.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-800">Rezervasyon</div>
                <div className="text-blue-600">{reservationData.id}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-800">Müşteri</div>
                <div className="text-blue-600">{reservationData.customerName}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-800">Tutar</div>
                <div className="text-blue-600">${reservationData.amount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}