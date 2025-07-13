import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Clock, Phone, Mail, Edit, X, LogOut, Car, UserCheck } from 'lucide-react';
import { getCustomerSession, clearCustomerSession } from '../utils/customerSession';
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  vehicle: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  driverName?: string;
  vehiclePlate?: string;
  flightNumber?: string;
  paymentStatus?: 'paid' | 'pending' | 'failed';
  createdAt: Date;
}

export default function OriginalCustomerPanel() {
  const [customer, setCustomer] = useState<any>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const customerSession = getCustomerSession();
    if (!customerSession) {
      navigate('/customer/login');
      return;
    }
    
    setCustomer(customerSession);
    
    // Mock reservations data
    const mockReservations: Reservation[] = [
      {
        id: '1',
        from: 'Antalya Havalimanı',
        to: 'Kemer',
        date: '2024-01-15',
        time: '14:30',
        passengers: 2,
        vehicle: 'Mercedes Vito',
        price: 150,
        status: 'confirmed',
        driverName: 'Mehmet Yılmaz',
        vehiclePlate: '07 ABC 123',
        flightNumber: 'TK 123',
        paymentStatus: 'paid',
        createdAt: new Date('2024-01-14T10:00:00')
      },
      {
        id: '2',
        from: 'Kemer',
        to: 'Antalya Havalimanı',
        date: '2024-01-20',
        time: '09:00',
        passengers: 2,
        vehicle: 'Mercedes Vito',
        price: 150,
        status: 'pending',
        driverName: 'Ali Demir',
        vehiclePlate: '07 XYZ 456',
        flightNumber: 'TK 456',
        paymentStatus: 'pending',
        createdAt: new Date()
      }
    ];
    
    setReservations(mockReservations);
  }, [navigate]);

  const handleLogout = () => {
    clearCustomerSession();
    navigate('/');
  };

  const canEditReservation = (reservation: Reservation) => {
    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const timeDiff = reservationDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    return hoursDiff > 12;
  };

  const handleEditReservation = (reservation: Reservation) => {
    if (canEditReservation(reservation)) {
      setEditingReservation(reservation);
      setShowEditModal(true);
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation && canEditReservation(reservation)) {
      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
      ));
    }
  };

  if (!customer) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {customer.firstName} {customer.lastName}
                </h1>
                <p className="text-gray-600">SBS Transfer Müşterisi</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">İletişim Bilgileri</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700">{customer.email}</span>
            </div>
            {customer.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {reservations.length}
            </div>
            <div className="text-blue-800 font-medium">Rezervasyon</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${reservations.reduce((sum, r) => sum + r.price, 0).toFixed(2)}
            </div>
            <div className="text-green-800 font-medium">Toplam</div>
          </div>
        </div>

        {/* New Reservation Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/booking')}
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Yeni Rezervasyon</span>
          </button>
        </div>

        {/* Reservations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rezervasyonlarım</h2>
          
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Henüz rezervasyonunuz bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-gray-800">
                        {reservation.from} → {reservation.to}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status === 'confirmed' ? 'Onaylandı' :
                       reservation.status === 'pending' ? 'Beklemede' : 'İptal Edildi'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{reservation.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{reservation.passengers} kişi</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="h-4 w-4" />
                      <span>{reservation.vehicle}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-blue-600">
                      ${reservation.price}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        Detaylar
                      </button>
                      {canEditReservation(reservation) && reservation.status !== 'cancelled' && (
                        <>
                          <button
                            onClick={() => handleEditReservation(reservation)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            İptal Et
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reservation Detail Modal */}
        {showDetailModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Rezervasyon Detayları</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Güzergah</label>
                    <p className="text-gray-900">{selectedReservation.from} → {selectedReservation.to}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                      <p className="text-gray-900">{selectedReservation.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                      <p className="text-gray-900">{selectedReservation.time}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yolcu Sayısı</label>
                      <p className="text-gray-900">{selectedReservation.passengers} kişi</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Araç</label>
                      <p className="text-gray-900">{selectedReservation.vehicle}</p>
                    </div>
                  </div>

                  {selectedReservation.driverName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şoför</label>
                      <p className="text-gray-900">{selectedReservation.driverName}</p>
                    </div>
                  )}

                  {selectedReservation.vehiclePlate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Araç Plakası</label>
                      <p className="text-gray-900">{selectedReservation.vehiclePlate}</p>
                    </div>
                  )}

                  {selectedReservation.flightNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uçuş Numarası</label>
                      <p className="text-gray-900">{selectedReservation.flightNumber}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Durumu</label>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedReservation.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedReservation.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedReservation.paymentStatus === 'paid' ? 'Ödendi' :
                       selectedReservation.paymentStatus === 'pending' ? 'Beklemede' : 'Ödenmedi'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Tutar</label>
                    <p className="text-xl font-semibold text-blue-600">${selectedReservation.price}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}