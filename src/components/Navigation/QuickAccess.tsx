import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function QuickAccess() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
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