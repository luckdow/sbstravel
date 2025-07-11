import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle, MapPin, DollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'completed',
    title: 'Transfer Tamamlandı',
    description: 'AYT → Kemer (Ahmet Yılmaz)',
    time: '2 saat önce',
    amount: '$85',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 2,
    type: 'started',
    title: 'Transfer Başlatıldı',
    description: 'Belek → AYT (Sarah Johnson)',
    time: '3 saat önce',
    amount: '$120',
    icon: MapPin,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 3,
    type: 'assigned',
    title: 'Yeni Transfer Atandı',
    description: 'AYT → Side (Hans Mueller)',
    time: '4 saat önce',
    amount: '$95',
    icon: AlertCircle,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 4,
    type: 'completed',
    title: 'Transfer Tamamlandı',
    description: 'Kemer → AYT (Maria Garcia)',
    time: '5 saat önce',
    amount: '$75',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 5,
    type: 'cancelled',
    title: 'Transfer İptal Edildi',
    description: 'AYT → Alanya (John Smith)',
    time: '6 saat önce',
    amount: '-',
    icon: XCircle,
    color: 'text-red-600 bg-red-100'
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Son Aktiviteler</h2>
          <Link to="/driver/history" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Tümünü Gör
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <activity.icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                  <div className="flex items-center space-x-2">
                    {activity.amount !== '-' && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{activity.amount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center space-x-1 mt-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Tamamlanan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Devam Eden</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">İptal Edilen</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}