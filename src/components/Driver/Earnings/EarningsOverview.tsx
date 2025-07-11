import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, Filter } from 'lucide-react';

const earningsData = {
  today: { amount: 240, trips: 8, average: 30 },
  week: { amount: 1680, trips: 42, average: 40 },
  month: { amount: 6720, trips: 168, average: 40 },
  total: { amount: 25600, trips: 640, average: 40 }
};

const dailyEarnings = [
  { date: '2024-01-15', amount: 240, trips: 8 },
  { date: '2024-01-14', amount: 320, trips: 10 },
  { date: '2024-01-13', amount: 180, trips: 6 },
  { date: '2024-01-12', amount: 280, trips: 9 },
  { date: '2024-01-11', amount: 220, trips: 7 },
  { date: '2024-01-10', amount: 300, trips: 12 },
  { date: '2024-01-09', amount: 140, trips: 5 }
];

export default function EarningsOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kazançlarım</h1>
          <p className="text-gray-600">Gelir takibi ve detaylı raporlar</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filtrele</span>
          </button>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Rapor İndir</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex space-x-2 mb-6">
          {Object.keys(earningsData).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'today' ? 'Bugün' : 
               period === 'week' ? 'Bu Hafta' :
               period === 'month' ? 'Bu Ay' : 'Toplam'}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">
              ${earningsData[selectedPeriod as keyof typeof earningsData].amount}
            </div>
            <div className="text-gray-600">Toplam Kazanç</div>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12%</span>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">
              {earningsData[selectedPeriod as keyof typeof earningsData].trips}
            </div>
            <div className="text-gray-600">Transfer Sayısı</div>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-600">+8%</span>
            </div>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">
              ${earningsData[selectedPeriod as keyof typeof earningsData].average}
            </div>
            <div className="text-gray-600">Ortalama/Transfer</div>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-purple-600">+5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Günlük Kazanç Detayı</h2>
        
        <div className="space-y-4">
          {dailyEarnings.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {new Date(day.date).getDate()}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date(day.date).toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                  <div className="text-sm text-gray-600">{day.trips} transfer</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">${day.amount}</div>
                <div className="text-sm text-gray-500">${(day.amount / day.trips).toFixed(0)} ortalama</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Ödeme Durumu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-green-50 rounded-2xl">
            <h3 className="font-bold text-green-800 mb-2">Ödenen Kazançlar</h3>
            <div className="text-2xl font-bold text-green-600 mb-2">$5,280</div>
            <div className="text-sm text-green-700">Son ödeme: 10 Ocak 2024</div>
          </div>
          
          <div className="p-6 bg-yellow-50 rounded-2xl">
            <h3 className="font-bold text-yellow-800 mb-2">Bekleyen Ödemeler</h3>
            <div className="text-2xl font-bold text-yellow-600 mb-2">$1,440</div>
            <div className="text-sm text-yellow-700">Sonraki ödeme: 17 Ocak 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}