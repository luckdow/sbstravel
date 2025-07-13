import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Home, User, CheckCircle, Calendar, MapPin, Clock, Plane, Car, Phone, Mail, QrCode } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getVehicleTypeDisplayName } from '../utils/vehicle';
import { Reservation } from '../types';

export default function CustomerReservationView() {
  const { reservationId } = useParams();
  const [searchParams] = useSearchParams();
  const qrCode = searchParams.get('qr');
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { reservations, fetchReservations } = useStore();

  useEffect(() => {
    const loadReservation = async () => {
      setLoading(true);
      try {
        await fetchReservations();
        
        // Find reservation by ID
        const foundReservation = reservations.find(r => r.id === reservationId);
        
        if (!foundReservation) {
          setError('Rezervasyon bulunamadı');
          return;
        }
        
        // Verify QR code if provided
        if (qrCode && foundReservation.qrCode !== qrCode) {
          setError('Geçersiz QR kod');
          return;
        }
        
        setReservation(foundReservation);
      } catch (err) {
        console.error('Error loading reservation:', err);
        setError('Rezervasyon yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (reservationId) {
      loadReservation();
    } else {
      setError('Geçersiz rezervasyon ID');
      setLoading(false);
    }
  }, [reservationId, qrCode, reservations, fetchReservations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Rezervasyon bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Hata</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/profile"
              className="block bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <User className="inline h-4 w-4 mr-2" />
              Panelime Git
            </Link>
            <Link
              to="/"
              className="block bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              <Home className="inline h-4 w-4 mr-2" />
              Ana Sayfa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    assigned: 'bg-purple-100 text-purple-800',
    started: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    pending: 'Beklemede',
    confirmed: 'Onaylandı',
    assigned: 'Şoför Atandı',
    started: 'Transfer Başladı',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Geri Dön</span>
          </Link>
          
          <div className="flex space-x-3">
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Panelime Git</span>
            </Link>
            <Link
              to="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Ana Sayfa</span>
            </Link>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-green-800">Rezervasyon Detayları</h1>
              <p className="text-green-700">QR kod taraması başarılı! İşte rezervasyon bilgileriniz.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reservation Details */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Rezervasyon Bilgileri</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                statusColors[reservation.status as keyof typeof statusColors] || statusColors.pending
              }`}>
                {statusLabels[reservation.status as keyof typeof statusLabels] || 'Belirsiz'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Rezervasyon No:</span>
                <span className="font-semibold text-gray-800">{reservation.id}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Müşteri:</span>
                <span className="font-semibold text-gray-800">{reservation.customerName}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-bold text-green-600 text-lg">
                  ${reservation.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Transfer Detayları</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">{reservation.pickupLocation} → {reservation.dropoffLocation}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{reservation.pickupDate}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">{reservation.pickupTime}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Araç Tipi: {getVehicleTypeDisplayName(reservation.vehicleType)}</span>
                </div>
                {reservation.flightNumber && (
                  <div className="flex items-center space-x-3">
                    <Plane className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-700">Uçuş No: {reservation.flightNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">{reservation.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{reservation.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Actions */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">QR Kod Doğrulandı</h2>
            
            <div className="text-center mb-8">
              <div className="bg-green-50 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <QrCode className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <p className="text-green-700 font-semibold">QR kod başarıyla tarandı!</p>
              <p className="text-gray-600 text-sm mt-2">
                Bu rezervasyon doğrulanmıştır ve geçerlidir.
              </p>
            </div>

            {/* Status-based Messages */}
            {reservation.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Beklemede</h4>
                <p className="text-sm text-yellow-700">
                  Rezervasyonunuz onay bekliyor. Size yakında bilgi verilecektir.
                </p>
              </div>
            )}

            {reservation.status === 'confirmed' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Onaylandı</h4>
                <p className="text-sm text-blue-700">
                  Rezervasyonunuz onaylandı. Şoför ataması yakında yapılacaktır.
                </p>
              </div>
            )}

            {reservation.status === 'assigned' && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-purple-800 mb-2">Şoför Atandı</h4>
                <p className="text-sm text-purple-700">
                  Şoförünüz atandı! Transfer saatinden önce sizinle iletişime geçecektir.
                </p>
              </div>
            )}

            {/* Important Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Önemli Bilgiler</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Transfer saatinden 15 dakika önce hazır olun</li>
                <li>• Şoförünüz WhatsApp ile sizinle iletişime geçecek</li>
                <li>• Bu QR kodu şoförünüze gösterin</li>
                <li>• Sorun yaşarsanız müşteri hizmetleri ile iletişime geçin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}