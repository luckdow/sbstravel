import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { Eye, Edit, Trash2, MapPin, Clock, User, Car, Loader2 } from 'lucide-react';
import { getSafeLocationStrings } from '../../../lib/utils/location';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  assigned: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  assigned: 'Atandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
};

export default function RecentReservations() {
  const { reservations, fetchReservations, loading } = useStore();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    fetchReservations();
    
    // Set a timeout to stop showing loading after 15 seconds
    const timeoutId = setTimeout(() => {
      setLoadingTimeout(true);
    }, 15000);
    
    return () => clearTimeout(timeoutId);
  }, [fetchReservations]);

  const recentReservations = reservations.slice(0, 5);

  const showLoading = loading && !loadingTimeout;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Son Rezervasyonlar</h2>
          <Link to="/admin/reservations" className="text-blue-600 hover:text-blue-700 font-medium">
            Tümünü Gör
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rezervasyon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Güzergah
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih/Saat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Araç/Şoför
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {showLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <span className="text-gray-600">Veriler yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : loadingTimeout && recentReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="text-center space-y-3">
                    <div className="text-amber-600">
                      <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="text-gray-700 font-medium">Veriler yüklenemedi</div>
                    <div className="text-sm text-gray-500">Firebase bağlantısı kurulamadı, demo veriler gösteriliyor</div>
                    <button 
                      onClick={() => {
                        setLoadingTimeout(false);
                        fetchReservations();
                      }}
                      className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                </td>
              </tr>
            ) : recentReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Henüz rezervasyon bulunmuyor
                </td>
              </tr>
            ) : (
              recentReservations.map((reservation) => {
                const { pickup, dropoff } = getSafeLocationStrings(reservation.pickupLocation, reservation.dropoffLocation);
                return (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {reservation.customerName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {pickup} → {dropoff}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.pickupDate}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {reservation.pickupTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    {reservation.vehicleType}
                  </div>
                  <div className="text-sm text-gray-500">{reservation.driverId || 'Atanmadı'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${reservation.totalPrice}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[reservation.status as keyof typeof statusColors]}`}>
                    {statusLabels[reservation.status as keyof typeof statusLabels]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}