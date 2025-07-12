import React from 'react';
import { Users, Luggage, Star, Shield, Car, CheckCircle, Loader2 } from 'lucide-react';
import { PriceCalculation } from '../../types';

interface VehicleOption {
  type: 'standard' | 'premium' | 'luxury';
  name: string;
  model: string;
  image: string;
  passengerCapacity: number;
  baggageCapacity: number;
  features: string[];
  description: string;
  popular?: boolean;
}

interface VehicleSelectionProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleType: 'standard' | 'premium' | 'luxury') => void;
  passengerCount?: number;
  baggageCount?: number;
  vehicles: any[];
}

const vehicles: VehicleOption[] = [
  {
    type: 'standard',
    name: 'Standart Transfer',
    model: 'Volkswagen Caddy / Ford Tourneo',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 4,
    baggageCapacity: 4,
    features: ['Klima', 'Müzik Sistemi', 'Güvenli Sürüş', 'Temiz Araç'],
    description: 'Ekonomik ve konforlu transfer çözümü. Küçük gruplar için ideal.'
  },
  {
    type: 'premium',
    name: 'Premium Transfer',
    model: 'Mercedes Vito / Volkswagen Caravelle',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 8,
    baggageCapacity: 8,
    features: ['Premium İç Mekan', 'Wi-Fi', 'Su İkramı', 'Profesyonel Şoför'],
    description: 'Konfor ve kaliteyi bir arada sunan premium araç seçeneği.',
    popular: true
  },
  {
    type: 'luxury',
    name: 'Lüks & VIP Transfer',
    model: 'Mercedes V-Class / BMW X7',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 6,
    baggageCapacity: 6,
    features: ['Lüks Deri Döşeme', 'VIP Karşılama', 'Soğuk İçecek', 'Özel Şoför'],
    description: 'En üst düzey konfor ve prestij arayanlar için VIP transfer hizmeti.'
  }
];

export default function VehicleSelection({
  selectedVehicle,
  onVehicleSelect,
  passengerCount = 1,
  baggageCount = 1,
  vehicles: providedVehicles
}: VehicleSelectionProps) {
  // Use provided vehicles from admin panel, fallback to default vehicles if not available
  const vehiclesToDisplay = providedVehicles && providedVehicles.length > 0 ? providedVehicles : vehicles;

  const isVehicleSuitable = (vehicle: any) => {
    return vehicle.passengerCapacity >= (passengerCount || 1) && vehicle.baggageCapacity >= (baggageCount || 1);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehiclesToDisplay.map((vehicle: any) => {
          const isSuitable = isVehicleSuitable(vehicle);
          const isSelected = selectedVehicle === vehicle.type || selectedVehicle === vehicle.id;
          const vehiclePrice = vehicle.pricePerKm || 0;

          return (
            <div
              key={vehicle.type}
              className={`relative border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : isSuitable
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isSuitable && onVehicleSelect(vehicle.type || vehicle.id)}
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                {vehicle.popular && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ En Popüler
                  </div>
                )}
                {!isSuitable && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    Uygun Değil
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
              )}

              {/* Vehicle Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {vehicle.type}
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{vehicle.name}</h3>
                  <p className="text-gray-600 text-sm">{vehicle.model}</p>
                  <p className="text-gray-500 text-sm mt-2">{vehicle.description}</p>
                </div>

                {/* Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                    vehicle.passengerCapacity >= passengerCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">{vehicle.passengerCapacity} Kişi</span>
                    {vehicle.passengerCapacity < passengerCount && (
                      <span className="text-xs">Yetersiz</span>
                    )}
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                    vehicle.baggageCapacity >= baggageCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Luggage className="h-5 w-5 mb-1" />
                    <span className="text-sm font-medium">{vehicle.baggageCapacity} Bagaj</span>
                    {vehicle.baggageCapacity < baggageCount && (
                      <span className="text-xs">Yetersiz</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Özellikler:</h4>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="pt-4 border-t border-gray-100 text-center">
                    <div className="text-sm font-semibold text-blue-600">
                      ✓ Seçildi
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-3">Tüm Araçlarda Dahil:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">Tam Sigorta</span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Yakıt Dahil</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-gray-700">Profesyonel Şoför</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700">7/24 Destek</span>
          </div>
        </div>
      </div>
    </div>
  );
}