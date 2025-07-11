import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { useEffect } from 'react';
import { Eye, Edit, Trash2, MapPin, Clock, User, Car } from 'lucide-react';

const reservations = [
  {
    id: 'RES-001',
    customer: 'Ahmet Yılmaz',
    route: 'AYT → Kemer',
    date: '2024-01-15',
    time: '14:30',
    vehicle: 'Premium',
    price: '$85',
    status: 'confirmed',
    driver: 'Mehmet Demir'
  },
  {
    id: 'RES-002',
    customer: 'Sarah Johnson',
    route: 'Belek → AYT',
    date: '2024-01-15',
    time: '16:00',
    vehicle: 'Luxury',
    price: '$120',
    status: 'assigned',
    driver: 'Ali Kaya'
  },
  {
    id: 'RES-003',
    customer: 'Hans Mueller',
    route: 'AYT → Side',
    date: '2024-01-15',
    time: '18:15',
    vehicle: 'Standard',
    price: '$65',
    status: 'pending',
    driver: '-'
  },
  {
    id: 'RES-004',
    customer: 'Maria Garcia',
    route: 'Alanya → AYT',
    date: '2024-01-16',
    time: '09:00',
    vehicle: 'Premium',
    price: '$95',
    status: 'completed',
  }
];

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

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const recentReservations = reservations.slice(0, 5);

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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Yükleniyor...
                </td>
              </tr>
            ) : recentReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Henüz rezervasyon bulunmuyor
                </td>
              </tr>
            ) : (
              recentReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {reservation.customer_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {reservation.pickup_location} → {reservation.dropoff_location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.pickup_date}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {reservation.pickup_time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <Car className="h-3 w-3 mr-1" />
                    {reservation.vehicle_type}
                  </div>
                  <div className="text-sm text-gray-500">{reservation.driver_id || 'Atanmadı'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${reservation.total_price}</div>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}