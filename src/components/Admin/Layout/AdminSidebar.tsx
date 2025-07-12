import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Car, 
  LogOut,
  X,
  Plane, 
  MapPin,
  Tag,
  Settings
} from 'lucide-react';
import { authService } from '../../../lib/services/auth-service';
import toast from 'react-hot-toast';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Calendar, label: 'Rezervasyonlar', href: '/admin/reservations' },
  { icon: MapPin, label: 'Lokasyonlar', href: '/admin/locations' },
  { icon: Tag, label: 'Ek Hizmetler', href: '/admin/extra-services' },
  { icon: Users, label: 'Şoförler', href: '/admin/drivers' },
  { icon: Car, label: 'Araçlar', href: '/admin/vehicles' },
  { icon: Settings, label: 'Ayarlar', href: '/admin/settings' }
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Başarıyla çıkış yapıldı');
      window.location.href = '/admin/login';
    } catch (error) {
      toast.error('Çıkış sırasında bir hata oluştu');
    }
  };

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
                <Plane className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SBS TRAVEL
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
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
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </>
  );
}