import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, DollarSign, Users, Car, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { getSafeLocationStrings } from '../../../lib/utils/location';

export default function Dashboard() {
  const { 
    reservations, 
    drivers, 
    fetchReservations, 
    fetchDrivers, 
    getStats
  } = useStore();

  useEffect(() => {
    // Fetch data when component mounts
    fetchReservations();
    fetchDrivers();
  }, [fetchReservations, fetchDrivers]);

  const stats = getStats();

  // Core metrics
  const coreMetrics = [
    {
      title: 'Bugünkü Rezervasyonlar',
      value: stats.todayReservations,
      icon: CalendarCheck,
      color: 'from-purple-500 to-purple-600',
      change: '+12%'
    },
    {
      title: 'Toplam Gelir',
      value: `$${stats.totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Aktif Şoförler',
      value: stats.activeDrivers,
      icon: Users,
      color: 'from-purple-500 to-green-600',
      change: '+2'
    },
    {
      title: 'Kullanımdaki Araçlar',
      value: stats.vehiclesInUse,
      icon: Car,
      color: 'from-green-500 to-purple-600',
      change: `${drivers.length > 0 ? Math.round((stats.vehiclesInUse / drivers.length) * 100) : 0}%`
    }
  ];

  const recentReservations = reservations.slice(0, 5);
  const activeDrivers = drivers.filter(d => d.status === 'available' || d.status === 'busy').slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-green-600">
                {metric.change}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Son Rezervasyonlar</h2>
            <Link to="/admin/reservations" className="text-purple-600 hover:text-purple-700 font-medium">
              Tümünü Gör
            </Link>
          </div>
          
          {recentReservations.length > 0 ? (
            <div className="space-y-4">
              {recentReservations.map((reservation, index) => {
                const { pickup, dropoff } = getSafeLocationStrings(reservation.pickupLocation, reservation.dropoffLocation);
                return (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center">
                    <CalendarCheck className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {reservation.customerName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {pickup} → {dropoff}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    ${reservation.totalPrice}
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz rezervasyon bulunmuyor</p>
            </div>
          )}
        </div>

        {/* Active Drivers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Aktif Şoförler</h2>
            <Link to="/admin/drivers" className="text-purple-600 hover:text-purple-700 font-medium">
              Tümünü Gör
            </Link>
          </div>
          
          {activeDrivers.length > 0 ? (
            <div className="space-y-4">
              {activeDrivers.map((driver, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {driver.firstName?.[0]}{driver.lastName?.[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                      driver.status === 'available' ? 'bg-green-500' : 'bg-purple-500'
                    } rounded-full border-2 border-white`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {driver.firstName} {driver.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {driver.status === 'available' ? 'Müsait' : 'Meşgul'}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    {driver.rating?.toFixed(1) || '5.0'}⭐
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz aktif şoför bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Actions */}
      {stats.pendingReservations > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-amber-800">
                {stats.pendingReservations} bekleyen rezervasyon var
              </h3>
              <p className="text-amber-700">Bu rezervasyonları gözden geçirin ve şoför atayın.</p>
            </div>
            <Link 
              to="/admin/reservations"
              className="bg-amber-600 text-white py-2 px-4 rounded-xl hover:bg-amber-700 transition-colors font-medium"
            >
              İncele
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}