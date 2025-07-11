import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

const drivers = [
  {
    id: 1,
    name: 'Mehmet Demir',
    status: 'active',
    currentTrip: 'AYT → Kemer',
    earnings: '$240',
    avatar: 'MD'
  },
  {
    id: 2,
    name: 'Ali Kaya',
    status: 'active',
    currentTrip: 'Belek → AYT',
    earnings: '$180',
    avatar: 'AK'
  },
  {
    id: 3,
    name: 'Osman Çelik',
    status: 'available',
    currentTrip: 'Beklemede',
    earnings: '$320',
    avatar: 'OÇ'
  },
  {
    id: 4,
    name: 'Fatih Özkan',
    status: 'offline',
    currentTrip: 'Çevrimdışı',
    earnings: '$150',
    avatar: 'FÖ'
  },
  {
    id: 5,
    name: 'Hasan Yıldız',
    status: 'active',
    currentTrip: 'Side → AYT',
    earnings: '$200',
    avatar: 'HY'
  }
];

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Aktif', icon: UserCheck },
  available: { color: 'bg-blue-500', label: 'Müsait', icon: Clock },
  offline: { color: 'bg-gray-400', label: 'Çevrimdışı', icon: UserX }
};

export default function DriverStatus() {
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const availableDrivers = drivers.filter(d => d.status === 'available').length;
  const offlineDrivers = drivers.filter(d => d.status === 'offline').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Şoför Durumu</h2>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{activeDrivers}</div>
          <div className="text-xs text-gray-500">Aktif</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{availableDrivers}</div>
          <div className="text-xs text-gray-500">Müsait</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-600">{offlineDrivers}</div>
          <div className="text-xs text-gray-500">Çevrimdışı</div>
        </div>
      </div>
      
      {/* Driver List */}
      <div className="space-y-4">
        {drivers.map((driver) => {
          const status = statusConfig[driver.status as keyof typeof statusConfig];
          return (
            <div key={driver.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {driver.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${status.color} rounded-full border-2 border-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{driver.name}</div>
                <div className="text-xs text-gray-500 truncate">{driver.currentTrip}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">{driver.earnings}</div>
                <div className="text-xs text-gray-500">bugün</div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link to="/admin/drivers" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center">
          Tüm Şoförleri Görüntüle
        </Link>
      </div>
    </div>
  );
}