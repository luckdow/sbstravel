import React from 'react';
import { DollarSign, Clock, MapPin, Star, TrendingUp, Users } from 'lucide-react';

const stats = [
  {
    title: 'Bugünkü Kazanç',
    value: '$240',
    change: '+15%',
    changeType: 'increase',
    icon: DollarSign,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Aktif Transferler',
    value: '3',
    change: '+2',
    changeType: 'increase',
    icon: Clock,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Tamamlanan Transferler',
    value: '12',
    change: '+8',
    changeType: 'increase',
    icon: MapPin,
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Müşteri Puanı',
    value: '4.8',
    change: '+0.2',
    changeType: 'increase',
    icon: Star,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    title: 'Haftalık Kazanç',
    value: '$1,680',
    change: '+12%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    title: 'Toplam Müşteri',
    value: '156',
    change: '+24',
    changeType: 'increase',
    icon: Users,
    color: 'from-pink-500 to-pink-600'
  }
];

export default function DriverStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className={`text-sm font-medium ${
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
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