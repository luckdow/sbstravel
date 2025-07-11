import React from 'react';
import { Link } from 'react-router-dom';
import { User, Shield, Car } from 'lucide-react';

export default function QuickAccess() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
        {/* Admin Girişi */}
        <Link
          to="/admin/login"
          className="group bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Admin Girişi"
        >
          <Shield className="h-6 w-6" />
        </Link>

        {/* Şoför Girişi */}
        <Link
          to="/driver/login"
          className="group bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Şoför Girişi"
        >
          <Car className="h-6 w-6" />
        </Link>

        {/* Müşteri Girişi */}
        <Link
          to="/customer/login"
          className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Müşteri Girişi"
        >
          <User className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}