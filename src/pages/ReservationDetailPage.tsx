import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Calendar, User, Plane, QrCode, Home, ArrowRight } from 'lucide-react';
import QRCode from 'react-qr-code';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getVehicleTypeDisplayName } from '../utils/vehicle';
import { generateCustomerViewURL } from '../utils/qrCode';

export default function ReservationDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get reservation data from navigation state
  const reservationData = location.state;
  
  // If no reservation data, redirect to booking
  useEffect(() => {
    if (!reservationData) {
      navigate('/booking');
    }
  }, [reservationData, navigate]);

  if (!reservationData) {
    return null;
  }

  // Extract customer info from reservation data
  const customerInfo = reservationData?.customerInfo || {
    firstName: 'Müşteri',
    lastName: 'Adı',
    email: 'musteri@example.com',
    phone: '+90 5XX XXX XX XX'
  };
  
  const reservation = {
    id: reservationData?.reservationId || 'RES-001',
    customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
    flightNumber: reservationData?.flightNumber || customerInfo.flightNumber,
    route: reservationData?.route || `${reservationData?.pickupLocation || 'Antalya Havalimanı'} → ${reservationData?.dropoffLocation || 'Kemer'}`,
    vehicleType: reservationData?.vehicleType || 'standard',
    date: reservationData?.pickupDate || new Date().toLocaleDateString('tr-TR'),
    time: reservationData?.pickupTime || '14:30',
    amount: reservationData?.totalPrice || 85.00,
    qrCode: reservationData?.qrCode || 'QR_' + Date.now(),
    qrCodeUrl: reservationData?.qrCode ? generateCustomerViewURL(reservationData.reservationId || 'RES-001', reservationData.qrCode) : generateCustomerViewURL('RES-001', 'QR_' + Date.now()),
    status: 'confirmed'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Rezervasyon Onaylandı
            </h1>
            <p className="text-lg text-gray-600">
              Transfer rezervasyonunuz başarıyla oluşturuldu
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Reservation Details */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Rezervasyon Bilgileri</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Rezervasyon No:</span>
                    <span className="font-semibold text-gray-800">{reservation.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Müşteri:</span>
                    <span className="font-semibold text-gray-800">{reservation.customerName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">E-posta:</span>
                    <span className="font-semibold text-gray-800">{reservation.customerEmail}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Telefon:</span>
                    <span className="font-semibold text-gray-800">{reservation.customerPhone}</span>
                  </div>
                </div>

                {/* Transfer Details */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Detayları</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{reservation.route}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-700">{reservation.date} - {reservation.time}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Araç: {getVehicleTypeDisplayName(reservation.vehicleType)}</span>
                    </div>
                    {reservation.flightNumber && (
                      <div className="flex items-center space-x-3">
                        <Plane className="h-5 w-5 text-orange-600" />
                        <span className="text-gray-700">Uçuş No: {reservation.flightNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-xl">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-green-600">${reservation.amount.toFixed(2)}</span>
                    <p className="text-green-700 text-sm">Toplam Ücret</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Transfer QR Kodu</h2>
                
                <div className="text-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block mb-6">
                    <QRCode
                      value={reservation.qrCodeUrl}
                      size={180}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h4 className="font-bold text-blue-800 mb-2">Önemli Bilgi</h4>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Transfer günü şoförünüze QR kodu gösterin</li>
                      <li>• QR kodu telefonunuzda saklayın</li>
                      <li>• Transfer 15 dakika öncesinde hazır olun</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/profile"
                  state={{ newReservation: true, reservationId: reservation.id }}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>Müşteri Paneline Git</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Ana Sayfaya Dön</span>
                </Link>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-yellow-800 mb-2">Transfer Bilgileri</h3>
              <p className="text-sm text-yellow-700">
                Rezervasyon detaylarınız e-posta adresinize gönderilmiştir. 
                Şoförünüz transfer saatinden önce sizinle iletişime geçecektir.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}