import React from 'react';
import { Menu, Bell, MapPin, Clock, DollarSign } from 'lucide-react';

interface DriverHeaderProps {
  onMenuClick: () => void;
}

export default function DriverHeader({ onMenuClick }: DriverHeaderProps) {
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
            <h1 className="text-2xl font-bold text-gray-800">Şoför Dashboard</h1>
            <p className="text-sm text-gray-600">Hoş geldiniz, Mehmet Demir</p>
          </div>
        </div>
        
        {/* Center - Quick Stats */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">$240</p>
              <p className="text-xs text-green-600">Bugünkü Kazanç</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-800">3</p>
              <p className="text-xs text-blue-600">Aktif Transfer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl">
            <MapPin className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-semibold text-purple-800">Kemer</p>
              <p className="text-xs text-purple-600">Mevcut Konum</p>
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>
          
          {/* Status Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Durum:</span>
            <button className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Aktif
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}