import React from 'react';
import { useStore } from '../../../store/useStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { MapPin, Clock, User, Phone, Navigation, CheckCircle, AlertCircle } from 'lucide-react';

const activeTransfers = [
  {
    id: 'RES-001',
    customer: 'Ahmet Yılmaz',
    phone: '+90 532 123 4567',
    route: {
      from: 'Antalya Havalimanı (AYT)',
      to: 'Kemer - Club Med Palmiye'
    },
    time: '14:30',
    status: 'confirmed',
    distance: '45 km',
    price: '$85',
    estimatedDuration: '50 dk',
    priority: 'high'
  },
  {
    id: 'RES-002',
    customer: 'Sarah Johnson',
    phone: '+1 555 123 4567',
    route: {
      from: 'Belek - Regnum Carya',
      to: 'Antalya Havalimanı (AYT)'
    },
    time: '16:00',
    status: 'started',
    distance: '35 km',
    price: '$120',
    estimatedDuration: '40 dk',
    priority: 'medium'
  },
  {
    id: 'RES-003',
    customer: 'Hans Mueller',
    phone: '+49 123 456 7890',
    route: {
      from: 'Antalya Havalimanı (AYT)',
      to: 'Side - Manavgat Hotel'
    },
    time: '18:15',
    status: 'assigned',
    distance: '65 km',
    price: '$95',
    estimatedDuration: '75 dk',
    priority: 'low'
  }
];

const statusColors = {
  assigned: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  started: 'bg-green-100 text-green-800'
};

const statusLabels = {
  assigned: 'Atandı',
  confirmed: 'Onaylandı',
  started: 'Başladı'
};

const priorityColors = {
  high: 'border-red-200 bg-red-50',
  medium: 'border-yellow-200 bg-yellow-50',
  low: 'border-green-200 bg-green-50'
};

export default function ActiveTransfers() {
  const { 
    reservations, 
    currentDriver,
    fetchReservations,
    updateReservationStatus 
  } = useStore();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Get current driver's active transfers
  const activeTransfers = reservations.filter(res => 
    res.driver_id === currentDriver?.id && 
    ['assigned', 'confirmed', 'started'].includes(res.status)
  );

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    await updateReservationStatus(reservationId, newStatus);
    toast.success('Transfer durumu güncellendi!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Aktif Transferler</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Canlı</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {activeTransfers.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Aktif transfer bulunmuyor</div>
          </div>
        ) : (
          activeTransfers.map((transfer) => (
          <div 
            key={transfer.id} 
            className="border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border-blue-200 bg-blue-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {transfer.customer_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{transfer.customer_name}</h3>
                  <p className="text-sm text-gray-600">{transfer.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[transfer.status]}`}>
                  {statusLabels[transfer.status]}
                </span>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${transfer.total_price}</div>
                  <div className="text-xs text-gray-500">Transfer</div>
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-3 mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-6 bg-gray-300"></div>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="font-medium text-gray-800">{transfer.pickup_location}</p>
                    <p className="text-sm text-gray-500">Kalkış</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transfer.dropoff_location}</p>
                    <p className="text-sm text-gray-500">Varış</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{transfer.pickup_time}</p>
                  <p className="text-xs text-gray-500">Saat</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{transfer.customer_phone}</p>
                  <p className="text-xs text-gray-500">İletişim</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              {transfer.status === 'assigned' && (
                <button 
                  onClick={() => handleStatusUpdate(transfer.id, 'confirmed')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Onayla</span>
                </button>
              )}
              {transfer.status === 'confirmed' && (
                <button 
                  onClick={() => handleStatusUpdate(transfer.id, 'started')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Transferi Başlat</span>
                </button>
              )}
              {transfer.status === 'started' && (
                <button 
                  onClick={() => handleStatusUpdate(transfer.id, 'completed')}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Transferi Tamamla</span>
                </button>
              )}
              <a 
                href={`tel:${transfer.customer_phone}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>Ara</span>
              </a>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Navigasyon</span>
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}