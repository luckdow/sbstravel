import React, { useState, useEffect } from 'react';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../lib/services/auth-service';
import toast from 'react-hot-toast';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [currentUser, setCurrentUser] = useState(authService.getAuthState().user);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe((authState) => {
      setCurrentUser(authState.user);
    });

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      unsubscribe();
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Başarıyla çıkış yapıldı');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Çıkış sırasında bir hata oluştu');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      toast.info(`"${searchQuery}" için arama yapılıyor...`);
    }
  };
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Hoş geldiniz, {currentUser?.firstName || 'Admin'}
            </p>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden lg:flex relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rezervasyon ara..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>
                    
          {/* Profile */}
          <div className="relative dropdown-container">
            <button 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin User'}
                </p>
                <p className="text-xs text-gray-600">
                  {currentUser?.email || 'admin@ayttransfer.com'}
                </p>
              </div>
            </button>
            
            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Admin User'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentUser?.email || 'admin@sbstravel.com'}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-green-600 rounded-full flex items-center justify-center">
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => navigate('/admin/settings')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Profil Ayarları
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}