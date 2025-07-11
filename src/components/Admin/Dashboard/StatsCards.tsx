import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, Car, TrendingUp, Clock } from 'lucide-react';
import { useStore } from '../../../store/useStore';

interface StatData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function StatsCards() {
  const { reservations, drivers, fetchReservations, fetchDrivers, getStats } = useStore();
  const [stats, setStats] = useState<StatData[]>([]);

  useEffect(() => {
    // Fetch data when component mounts
    fetchReservations();
    fetchDrivers();
  }, [fetchReservations, fetchDrivers]);

  useEffect(() => {
    const calculateStats = () => {
      const {
        todayReservations,
        totalRevenue,
        activeDrivers,
        vehiclesInUse,
        pendingReservations
      } = getStats();

      // Monthly growth (simulated - in real app this would come from historical data)
      const monthlyGrowth = 23;

      const newStats: StatData[] = [
        {
          title: 'Bugünkü Rezervasyonlar',
          value: todayReservations.toString(),
          change: '+12%',
          changeType: 'increase',
          icon: Calendar,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Toplam Gelir',
          value: `$${totalRevenue.toFixed(0)}`,
          change: '+8%',
          changeType: 'increase',
          icon: DollarSign,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Aktif Şoförler',
          value: activeDrivers.toString(),
          change: '+2',
          changeType: 'increase',
          icon: Users,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Kullanımdaki Araçlar',
          value: vehiclesInUse.toString(),
          change: `${drivers.length > 0 ? Math.round((vehiclesInUse / drivers.length) * 100) : 0}%`,
          changeType: 'neutral',
          icon: Car,
          color: 'from-orange-500 to-orange-600'
        },
        {
          title: 'Aylık Büyüme',
          value: `+${monthlyGrowth}%`,
          change: '+5%',
          changeType: 'increase',
          icon: TrendingUp,
          color: 'from-pink-500 to-pink-600'
        },
        {
          title: 'Bekleyen Rezervasyonlar',
          value: pendingReservations.toString(),
          change: '-3',
          changeType: pendingReservations === 0 ? 'neutral' : 'decrease',
          icon: Clock,
          color: 'from-indigo-500 to-indigo-600'
        }
      ];

      setStats(newStats);
    };

    calculateStats();
  }, [reservations, drivers, getStats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 
              stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {stat.change}
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}