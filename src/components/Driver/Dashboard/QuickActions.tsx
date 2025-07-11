import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, MapPin, Phone, Settings, Clock, DollarSign } from 'lucide-react';

const quickActions = [
  {
    icon: QrCode,
    title: 'QR Kod Okut',
    description: 'Transfer başlatmak için QR kod okutun',
    color: 'from-blue-500 to-blue-600',
    action: 'scan'
  },
  {
    icon: MapPin,
    title: 'Konumumu Güncelle',
    description: 'Mevcut konumunuzu güncelleyin',
    color: 'from-green-500 to-green-600',
    action: 'location'
  },
  {
    icon: Phone,
    title: 'Destek Ara',
    description: '7/24 teknik destek hattı',
    color: 'from-purple-500 to-purple-600',
    action: 'support'
  },
  {
    icon: Clock,
    title: 'Mesai Durumu',
    description: 'Çalışma durumunuzu değiştirin',
    color: 'from-orange-500 to-orange-600',
    action: 'status'
  }
];

export default function QuickActions() {
  const handleAction = (action: string) => {
    switch (action) {
      case 'location':
        alert('Konum güncelleniyor...');
        break;
      case 'support':
        alert('Destek hattı aranıyor: +90 242 123 45 67');
        break;
      case 'status':
        alert('Mesai durumu değiştiriliyor...');
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Hızlı İşlemler</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600 font-medium">Aktif</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          action.action === 'scan' ? (
            <Link
              key={index}
              to="/driver/qr-scanner"
              className="group relative p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 bg-gradient-to-r ${action.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                </div>
              </div>
            </Link>
          ) : (
            <button
              key={index}
              onClick={() => handleAction(action.action)}
              className="group relative p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 bg-gradient-to-r ${action.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                </div>
              </div>
            </button>
          )
        ))}
      </div>
      
      {/* Emergency Contact */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-red-800">Acil Durum</h4>
            <p className="text-sm text-red-600">Acil durumlar için: +90 242 123 45 67</p>
          </div>
          <button className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            Ara
          </button>
        </div>
      </div>
    </div>
  );
}