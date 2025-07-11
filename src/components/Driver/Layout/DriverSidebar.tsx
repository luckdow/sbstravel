import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, 
  QrCode, 
  DollarSign, 
  Clock, 
  User, 
  Settings, 
  LogOut,
  X,
  MapPin,
  BarChart3
} from 'lucide-react';

interface DriverSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Car, label: 'Dashboard', href: '/driver' },
  { icon: QrCode, label: 'QR Kod Okut', href: '/driver/qr-scanner' },
  { icon: Clock, label: 'Aktif Transferler', href: '/driver/active-transfers' },
  { icon: MapPin, label: 'Transfer Geçmişi', href: '/driver/history' },
  { icon: DollarSign, label: 'Kazançlarım', href: '/driver/earnings' },
  { icon: BarChart3, label: 'İstatistikler', href: '/driver/stats' },
  { icon: User, label: 'Profil', href: '/driver/profile' },
  { icon: Settings, label: 'Ayarlar', href: '/driver/settings' }
];

export default function DriverSidebar({ isOpen, onClose }: DriverSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Şoför Paneli
              </h1>
              <p className="text-xs text-gray-500">AYT Transfer</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Driver Info */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              MD
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Mehmet Demir</h3>
              <p className="text-sm text-gray-600">Aktif Şoför</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Çevrimiçi</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.href
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl w-full transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
}