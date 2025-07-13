import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, DollarSign, QrCode, Phone, Mail, Star, Download, Eye, Plus, CheckCircle, Home } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getVehicleTypeDisplayName } from '../utils/vehicle';
import { getCustomerSession, isCustomerSessionValid } from '../utils/customerSession';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
};

export default function OriginalCustomerPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<Record<string, unknown> | null>(null);
  const [customerReservations, setCustomerReservations] = useState<Record<string, unknown>[]>([]);
  const [showNewReservationMessage, setShowNewReservationMessage] = useState(false);
  const { reservations, fetchReservations } = useStore();

  // Check customer session and load data
  useEffect(() => {
    // Check for customer session
    if (!isCustomerSessionValid()) {
      toast.error('Oturum süreniz dolmuş. Lütfen yeniden giriş yapın.');
      navigate('/booking');
      return;
    }

    const session = getCustomerSession();
    if (session) {
      setCustomerData(session);
      
      // Fetch latest reservations
      fetchReservations().then(() => {
        // Filter reservations for this customer
        const customerReservations = reservations.filter(r => 
          r.customerId === session.customerId || 
          (r.customerEmail === session.email && r.customerName?.includes(session.firstName))
        );
        setCustomerReservations(customerReservations);
      });
    }
  }, [navigate, fetchReservations, reservations]);

  // Handle new reservation success message
  useEffect(() => {
    // Check if we should show success notification (only once per session)
    const sessionKey = 'sbs_reservation_success_shown';
    const alreadyShown = sessionStorage.getItem(sessionKey);
    
    if (location.state?.newReservation && !alreadyShown) {
      setShowNewReservationMessage(true);
      // Mark as shown for this session to prevent re-triggering
      sessionStorage.setItem(sessionKey, 'true');
      
      // Clear the location state to prevent re-triggering on navigation
      window.history.replaceState({}, '', location.pathname);
      
      // Hide message after 5 seconds
      setTimeout(() => setShowNewReservationMessage(false), 5000);
    }
  }, [location.state, location.pathname]);

  const customerInfo = customerData ? {
    firstName: customerData.firstName,
    lastName: customerData.lastName,
    email: customerData.email,
    phone: customerData.phone,
    totalReservations: customerReservations.length,
    totalSpent: customerReservations.reduce((sum, r) => sum + (r.amount || 0), 0)
  } : {
    firstName: 'Müşteri',
    lastName: '',
    email: 'musteri@example.com',
    phone: '+90 5XX XXX XX XX',
    totalReservations: 0,
    totalSpent: 0
  };

  const handleViewDetails = (reservation: Record<string, unknown>) => {
    // Simple alert for now - could be expanded to a modal
    alert(`Rezervasyon Detayları:\n\nNo: ${reservation.id}\nRota: ${reservation.route || reservation.pickupLocation + ' → ' + reservation.dropoffLocation}\nTarih: ${reservation.date || reservation.pickupDate}\nSaat: ${reservation.time || reservation.pickupTime}`);
  };

  const handleDownloadInvoice = (reservation: Record<string, unknown>) => {
    // Simple alert for now - could be expanded to actual download
    alert(`Fatura indirilecek: ${reservation.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Message for New Reservations */}
          {showNewReservationMessage && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-green-800">Rezervasyon Başarılı! 🎉</h2>
                  <p className="text-green-700">
                    Rezervasyonunuz başarıyla oluşturuldu. Transfer bilgilerinizi aşağıdan takip edebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </h2>
                  <p className="text-gray-600">SBS Transfer Müşterisi</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700 text-sm">{customerInfo.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 text-sm">{customerInfo.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <div className="text-xl font-bold text-blue-600">{customerInfo.totalReservations}</div>
                      <div className="text-xs text-blue-700">Rezervasyon</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl">
                      <div className="text-xl font-bold text-green-600">${customerInfo.totalSpent.toFixed(2)}</div>
                      <div className="text-xs text-green-700">Toplam</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/booking"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Rezervasyon</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Reservations */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Rezervasyonlarım</h3>
                
                {customerReservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">Henüz rezervasyonunuz yok</h4>
                    <p className="text-gray-500 mb-6">İlk transfer rezervasyonunuzu oluşturun</p>
                    <Link
                      to="/booking"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Rezervasyon Yap</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerReservations.map((reservation) => (
                      <div key={reservation.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {reservation.route || `${reservation.pickupLocation} → ${reservation.dropoffLocation}`}
                            </h4>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{reservation.date || reservation.pickupDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{reservation.time || reservation.pickupTime}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[reservation.status || 'confirmed']}`}>
                            {statusLabels[reservation.status || 'confirmed']}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-700">${(reservation.amount || reservation.totalPrice || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <QrCode className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-700">{reservation.qrCode || 'QR Kodu'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-gray-700">{getVehicleTypeDisplayName(reservation.vehicleType || 'standard')}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button 
                            onClick={() => handleViewDetails(reservation)}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Detaylar</span>
                          </button>
                          <button 
                            onClick={() => handleDownloadInvoice(reservation)}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Fatura</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
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
      
      <Footer />
    </div>
  );
}