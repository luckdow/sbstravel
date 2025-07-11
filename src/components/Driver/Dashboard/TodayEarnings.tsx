import React from 'react';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const earningsData = [
  { time: '09:00', amount: 45, trip: 'AYT → Kemer' },
  { time: '11:30', amount: 65, trip: 'Kemer → Belek' },
  { time: '14:15', amount: 85, trip: 'Belek → AYT' },
  { time: '16:45', amount: 45, trip: 'AYT → Side' }
];

export default function TodayEarnings() {
  const totalEarnings = earningsData.reduce((sum, earning) => sum + earning.amount, 0);
  const averagePerTrip = totalEarnings / earningsData.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Bugünkü Kazançlar</h2>
        <DollarSign className="h-5 w-5 text-green-600" />
      </div>
      
      {/* Total Earnings */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          ${totalEarnings}
        </div>
        <div className="text-sm text-gray-600">Toplam Kazanç</div>
        <div className="flex items-center justify-center space-x-2 mt-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">+15% dünden</span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-lg font-bold text-blue-600">{earningsData.length}</div>
          <div className="text-xs text-blue-600">Tamamlanan</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <div className="text-lg font-bold text-green-600">${averagePerTrip.toFixed(0)}</div>
          <div className="text-xs text-green-600">Ortalama</div>
        </div>
      </div>
      
      {/* Earnings List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm">Transfer Detayları</h3>
        {earningsData.map((earning, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{earning.trip}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {earning.time}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-green-600">${earning.amount}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress to Goal */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Günlük Hedef</span>
          <span className="text-sm text-gray-600">${totalEarnings}/$300</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalEarnings / 300) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Hedefe ${Math.max(300 - totalEarnings, 0)} kaldı
        </div>
      </div>
    </div>
  );
}