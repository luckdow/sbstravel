import React, { useState, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { Search, Filter, Calendar, MapPin, User, Car, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';

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
  assigned: 'Atandı',
  started: 'Başladı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
};

export default function ReservationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  
  const { 
    reservations, 
    drivers,
    fetchReservations, 
    fetchDrivers,
    updateReservationStatus,
    loading 
  } = useStore();

  useEffect(() => {
    fetchReservations();
    fetchDrivers();
  }, [fetchReservations, fetchDrivers]);

  const filteredReservations = reservations.filter(reservation => {
    const customerName = reservation.customerName || '';
    const reservationId = reservation.id || '';
    
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAssignDriver = async (reservationId: string, driverId: string) => {
    await updateReservationStatus(reservationId, 'assigned', driverId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rezervasyon Yönetimi</h1>
          <p className="text-gray-600">Tüm transfer rezervasyonlarını yönetin</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
          Yeni Rezervasyon
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rezervasyon ID veya müşteri adı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="confirmed">Onaylandı</option>
              <option value="assigned">Atandı</option>
              <option value="started">Başladı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filtreler</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezervasyon
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Güzergah
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih/Saat
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detaylar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Şoför
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Yükleniyor...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Rezervasyon bulunamadı
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.id || 'N/A'}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {reservation.customerName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">{reservation.customerPhone || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <MapPin className="h-3 w-3 mr-1 text-green-500" />
                        <span className="truncate max-w-32">{reservation.pickupLocation || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-red-500" />
                        <span className="truncate max-w-32">{reservation.dropoffLocation || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {reservation.pickupDate || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.pickupTime || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Car className="h-3 w-3 mr-1" />
                      {reservation.vehicleType || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reservation.passengerCount || 0} kişi, {reservation.baggageCount || 0} bagaj
                    </div>
                    <div className="text-sm font-medium text-green-600 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      ${reservation.totalPrice || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.driverId ? (
                      <div className="text-sm text-gray-900">{reservation.driverId}</div>
                    ) : (
                      <select 
                        onChange={(e) => e.target.value && handleAssignDriver(reservation.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Şoför Seç</option>
                        {drivers.filter(d => d.status === 'available').map(driver => (
                          <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[reservation.status as keyof typeof statusColors]}`}>
                      {statusLabels[reservation.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedReservation(reservation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Rezervasyon Detayları</h2>
                <button 
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Müşteri Bilgileri</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div><span className="font-medium">Ad:</span> {selectedReservation.customerName || 'N/A'}</div>
                  <div><span className="font-medium">E-posta:</span> {selectedReservation.customerEmail || 'N/A'}</div>
                  <div><span className="font-medium">Telefon:</span> {selectedReservation.customerPhone || 'N/A'}</div>
                </div>
              </div>

              {/* Transfer Details */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Transfer Detayları</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div><span className="font-medium">Kalkış:</span> {selectedReservation.pickupLocation || 'N/A'}</div>
                  <div><span className="font-medium">Varış:</span> {selectedReservation.dropoffLocation || 'N/A'}</div>
                  <div><span className="font-medium">Tarih:</span> {selectedReservation.pickupDate || 'N/A'}</div>
                  <div><span className="font-medium">Saat:</span> {selectedReservation.pickupTime || 'N/A'}</div>
                  <div><span className="font-medium">Araç Tipi:</span> {selectedReservation.vehicleType || 'N/A'}</div>
                  <div><span className="font-medium">Yolcu:</span> {selectedReservation.passengerCount || 0} kişi</div>
                  <div><span className="font-medium">Bagaj:</span> {selectedReservation.baggageCount || 0} adet</div>
                  <div><span className="font-medium">Fiyat:</span> ${selectedReservation.totalPrice || 0}</div>
                </div>
              </div>

              {/* QR Code */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">QR Kod</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-xl mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Kod</span>
                    </div>
                    <div className="text-sm text-gray-600">{selectedReservation.qrCode || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}