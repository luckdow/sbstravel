import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function RevenueChart() {
  const data = [
    { day: 'Pzt', revenue: 1200 },
    { day: 'Sal', revenue: 1800 },
    { day: 'Çar', revenue: 1600 },
    { day: 'Per', revenue: 2200 },
    { day: 'Cum', revenue: 2800 },
    { day: 'Cmt', revenue: 3200 },
    { day: 'Paz', revenue: 2400 }
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Haftalık Gelir</h2>
          <p className="text-sm text-gray-600">Son 7 günün gelir analizi</p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="font-semibold">+12.5%</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-gray-400" />
          <span className="text-2xl font-bold text-gray-800">$15,200</span>
          <span className="text-sm text-gray-500">bu hafta</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-8 text-sm font-medium text-gray-600">{item.day}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <div className="w-16 text-sm font-semibold text-gray-800 text-right">
              ${item.revenue}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-800">$2,171</div>
            <div className="text-xs text-gray-500">Ortalama</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">$3,200</div>
            <div className="text-xs text-gray-500">En Yüksek</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">47</div>
            <div className="text-xs text-gray-500">Transfer</div>
          </div>
        </div>
      </div>
    </div>
  );
}