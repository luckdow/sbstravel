import React from 'react';
import { Users, Fuel, Zap, Shield, Star, Heart, Eye, ArrowRight } from 'lucide-react';

interface CarCardProps {
  car: {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    originalPrice?: number;
    features: {
      passengers: number;
      fuel: string;
      transmission: string;
      rating: number;
      reviews: number;
    };
    popular?: boolean;
    discount?: number;
    badges?: string[];
  };
  onBook: (carId: number) => void;
}

export default function CarCard({ car, onBook }: CarCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        {car.popular && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            ⭐ Popüler
          </div>
        )}
        {car.discount && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            %{car.discount} İndirim
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
          <Eye className="h-5 w-5 text-gray-600 hover:text-blue-500" />
        </button>
      </div>
      
      {/* Image */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
            {car.category}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {car.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{car.features.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({car.features.reviews} değerlendirme)</span>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <Users className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors mb-1" />
            <span className="text-sm font-medium text-gray-700">{car.features.passengers} Kişi</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <Fuel className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors mb-1" />
            <span className="text-sm font-medium text-gray-700">{car.features.fuel}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <Zap className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors mb-1" />
            <span className="text-sm font-medium text-gray-700">{car.features.transmission}</span>
          </div>
        </div>

        {/* Badges */}
        {car.badges && (
          <div className="flex flex-wrap gap-2">
            {car.badges.map((badge, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              {car.originalPrice && (
                <span className="text-lg text-gray-400 line-through">₺{car.originalPrice}</span>
              )}
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₺{car.price}
              </span>
            </div>
            <span className="text-sm text-gray-500">günlük</span>
          </div>
          
          <button 
            onClick={() => onBook(car.id)}
            className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2"
          >
            <Shield className="h-4 w-4" />
            <span>Kirala</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}