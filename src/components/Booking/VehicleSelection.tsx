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

  // Only show first 3 vehicles for minimal design
  const displayVehicles = vehiclesToDisplay.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
      
      {/* 3-column grid layout for horizontal minimal cards */}
      <div className="grid grid-cols-3 gap-4">
        {displayVehicles.map((vehicle: any) => {
          const isSuitable = isVehicleSuitable(vehicle);
          const isSelected = selectedVehicle === vehicle.type || selectedVehicle === vehicle.id;

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
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              )}

              {/* Minimal card content */}
              <div className="p-4 space-y-3">
                {/* Vehicle Image - small */}
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-24 object-cover"
                  />
                </div>

                {/* Package Name */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {vehicle.name || (vehicle.type === 'standard' ? 'Standard' : vehicle.type === 'premium' ? 'Premium' : 'Luxury')}
                  </h3>
                </div>

                {/* Key Features as small badges */}
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                    AC
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                    Music
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-md">
                    Food
                  </span>
                </div>

                {/* Passenger/baggage capacity with small icons */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    vehicle.passengerCapacity >= passengerCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Users className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">{vehicle.passengerCapacity}</span>
                  </div>
                  <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                    vehicle.baggageCapacity >= baggageCount
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <Luggage className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">{vehicle.baggageCapacity}</span>
                  </div>
                </div>

                {/* Selection Status */}
                {isSelected && (
                  <div className="text-center">
                    <div className="text-xs font-semibold text-blue-600">
                      ✓ Seçildi
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info - minimal */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <h4 className="font-bold text-gray-800 mb-2 text-center">Tüm Araçlarda Dahil:</h4>
        <div className="flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">Sigorta</span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700">Yakıt</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-gray-700">Şoför</span>
          </div>
        </div>
      </div>
    </div>
  );
}