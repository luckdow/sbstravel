import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, MessageCircle, Car, Calendar, Clock, MapPin, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getReservation } from '../lib/firebase/collections';
import { Reservation } from '../types';

export default function BookingSuccessPage() {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      if (reservationId) {
        try {
          const reservationData = await getReservation(reservationId);
          setReservation(reservationData);
        } catch (error) {
          console.error('Error fetching reservation:', error);
        }
      }
      setLoading(false);
    };

    fetchReservation();
  }, [reservationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Rezervasyon bilgileri yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <Header />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Rezervasyon Bulunamadı</h1>
              <p className="text-gray-600 mb-6">Belirtilen rezervasyon bulunamadı.</p>
              <button
                onClick={() => navigate('/booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Yeni Rezervasyon Yap
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rezervasyonunuz Başarıyla Oluşturuldu!</h1>
            <p className="text-lg text-gray-600">Rezervasyon numaranız: <span className="font-semibold text-blue-600">{reservationId}</span></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reservation Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Rezervasyon Detayları</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Car className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Transfer Türü</div>
                    <div className="text-gray-600">
                      {reservation.transferType === 'airport-hotel' ? 'Havalimanı → Otel' : 'Otel → Havalimanı'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Güzergah</div>
                    <div className="text-gray-600">
                      {reservation.pickupLocation} → {reservation.dropoffLocation}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Tarih</div>
                    <div className="text-gray-600">{reservation.pickupDate}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Saat</div>
                    <div className="text-gray-600">{reservation.pickupTime}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Yolcu Sayısı</div>
                    <div className="text-gray-600">{reservation.passengerCount} Kişi</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Toplam Tutar:</span>
                    <span className="text-xl font-bold text-green-600">${reservation.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Müşteri Bilgileri</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Ad Soyad:</span> {reservation.customerName}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {reservation.customerEmail}
                  </div>
                  <div>
                    <span className="font-semibold">Telefon:</span> {reservation.customerPhone}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Rezervasyon Durumu</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-blue-800">Rezervasyon oluşturuldu</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-blue-800">Onay emaili gönderildi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 border-2 border-blue-300 rounded-full"></div>
                    <span className="text-blue-600">Şoför ataması bekleniyor</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sonraki Adımlar</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 text-sm">
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Rezervasyon onay emailinizi kontrol edin. QR kodunuz emailinizle birlikte gönderilmiştir.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      <MessageCircle className="h-4 w-4 inline mr-2" />
                      Şoför bilgileri transfer tarihinden 24 saat önce SMS ile gönderilecektir.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  >
                    Destek İçin İletişime Geçin
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {reservation.qrCode && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">QR Kodunuz</h3>
              <div className="bg-gray-100 rounded-xl p-6 inline-block">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto">
                  {/* QR Code would be rendered here with a library like react-qr-code */}
                  <div className="text-2xl font-mono break-all text-center">
                    {reservation.qrCode}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-4">
                Bu QR kodu transfer günü şoförünüze gösteriniz.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}