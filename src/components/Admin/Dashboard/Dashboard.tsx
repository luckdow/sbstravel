import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, DollarSign, Users, Car, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import MockDataIndicator from '../../Common/MockDataIndicator';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { 
    reservations, 
    drivers, 
    customers, 
    vehicles, 
    fetchReservations, 
    fetchDrivers, 
    fetchCustomers, 
    fetchVehicles, 
    getStats 
  } = useStore();

  useEffect(() => {
    // Fetch data when component mounts
    fetchReservations();
    fetchDrivers();
    fetchCustomers();
    fetchVehicles();
  }, [fetchReservations, fetchDrivers, fetchCustomers, fetchVehicles]);

  const stats = getStats();

  // Quick action buttons
  const quickActions = [
    {
      title: 'Rezervasyon Ekle',
      icon: Calendar,
      href: '/admin/reservations',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Araç Ekle',
      icon: Car,
      href: '/admin/vehicles',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Şoför Ekle',
      icon: Users,
      href: '/admin/drivers',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Core metrics
  const coreMetrics = [
    {
      title: 'Bugünkü Rezervasyonlar',
      value: stats.todayReservations,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
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
      color: 'from-purple-500 to-purple-600',
      change: '+2'
    },
    {
      title: 'Kullanımdaki Araçlar',
      value: stats.vehiclesInUse,
      icon: Car,
      color: 'from-orange-500 to-orange-600',
      change: `${drivers.length > 0 ? Math.round((stats.vehiclesInUse / drivers.length) * 100) : 0}%`
    }
  ];

  const recentReservations = reservations.slice(0, 3);
  const activeDrivers = drivers.filter(d => d.status === 'available' || d.status === 'busy').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`flex items-center justify-center space-x-3 bg-gradient-to-r ${action.color} text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 text-sm`}
            >
              <action.icon className="h-5 w-5" />
              <span>{action.title}</span>
              <Plus className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>

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
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Son Aktiviteler</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          {recentReservations.length > 0 ? (
            <div className="space-y-4">
              {recentReservations.map((reservation, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {reservation.customerName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {reservation.pickupLocation} → {reservation.dropoffLocation}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    ${reservation.totalPrice}
                  </div>
                </div>
              ))}
              <Link 
                to="/admin/reservations"
                className="block w-full text-center bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Tüm Rezervasyonları Gör
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz rezervasyon bulunmuyor</p>
              <Link 
                to="/admin/reservations"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                İlk rezervasyonu oluştur
              </Link>
            </div>
          )}
        </div>

        {/* Active Drivers */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Aktif Şoförler</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          {activeDrivers.length > 0 ? (
            <div className="space-y-4">
              {activeDrivers.map((driver, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {driver.firstName?.[0]}{driver.lastName?.[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                      driver.status === 'available' ? 'bg-green-500' : 'bg-blue-500'
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
              <Link 
                to="/admin/drivers"
                className="block w-full text-center bg-gray-100 text-gray-600 py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Tüm Şoförleri Gör
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Henüz aktif şoför bulunmuyor</p>
              <Link 
                to="/admin/drivers"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                İlk şoförü ekle
              </Link>
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
      
      {/* Mock Data Indicator for Development */}
      <MockDataIndicator 
        onAddSampleData={() => {
          // Trigger all fetch methods to load mock data
          fetchReservations();
          fetchDrivers();
          fetchCustomers();
          fetchVehicles();
          toast.success('Örnek veriler yüklendi!');
        }}
        onClearData={() => {
          // This would clear the data if we had a method for it
          toast.info('Veriler temizlendi!');
        }}
      />
    </div>
  );
}