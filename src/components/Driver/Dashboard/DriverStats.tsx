import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, MapPin, Star, TrendingUp, Users } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { authService } from '../../../lib/services/auth-service';
import { transactionService } from '../../../lib/services/transaction-service';

interface StatData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

export default function DriverStats() {
  const { reservations, drivers } = useStore();
  const [stats, setStats] = useState<StatData[]>([]);
  const authState = authService.getAuthState();
  const currentDriverId = authState.user?.id;

  useEffect(() => {
    const calculateDriverStats = () => {
      // Find current driver
      const currentDriver = drivers.find(d => d.id === currentDriverId);
      if (!currentDriver) return;

      // Driver's reservations
      const driverReservations = reservations.filter(r => r.driverId === currentDriverId);
      
      // Today's data
      const today = new Date().toDateString();
      const todaysReservations = driverReservations.filter(r => 
        new Date(r.createdAt || Date.now()).toDateString() === today
      );

      // Calculate earnings
      const todayEarnings = todaysReservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + (r.totalPrice * 0.75), 0); // 75% driver share

      const weeklyEarnings = driverReservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + (r.totalPrice * 0.75), 0);

      // Active transfers
      const activeTransfers = driverReservations.filter(r => 
        r.status === 'assigned' || r.status === 'started'
      ).length;

      // Completed transfers today
      const completedToday = todaysReservations.filter(r => r.status === 'completed').length;

      // Driver rating
      const rating = currentDriver.rating || 4.8;

      // Total customers served
      const totalCustomers = driverReservations.filter(r => r.status === 'completed').length;

      const newStats: StatData[] = [
        {
          title: 'Bugünkü Kazanç',
          value: `$${todayEarnings.toFixed(0)}`,
          change: '+15%',
          changeType: 'increase',
          icon: DollarSign,
          color: 'from-green-500 to-green-600'
        },
        {
          title: 'Aktif Transferler',
          value: activeTransfers.toString(),
          change: activeTransfers > 0 ? `+${activeTransfers}` : '0',
          changeType: activeTransfers > 0 ? 'increase' : 'neutral',
          icon: Clock,
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Tamamlanan Transferler',
          value: completedToday.toString(),
          change: `+${completedToday}`,
          changeType: completedToday > 0 ? 'increase' : 'neutral',
          icon: MapPin,
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Müşteri Puanı',
          value: rating.toFixed(1),
          change: '+0.2',
          changeType: 'increase',
          icon: Star,
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          title: 'Haftalık Kazanç',
          value: `$${weeklyEarnings.toFixed(0)}`,
          change: '+12%',
          changeType: 'increase',
          icon: TrendingUp,
          color: 'from-indigo-500 to-indigo-600'
        },
        {
          title: 'Toplam Müşteri',
          value: totalCustomers.toString(),
          change: `+${Math.max(0, totalCustomers - 100)}`,
          changeType: totalCustomers > 100 ? 'increase' : 'neutral',
          icon: Users,
          color: 'from-pink-500 to-pink-600'
        }
      ];

      setStats(newStats);
    };

    calculateDriverStats();
  }, [reservations, drivers, currentDriverId]);

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