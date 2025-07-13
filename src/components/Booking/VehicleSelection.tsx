import React from 'react';
import { Users, Luggage, Star, Shield, Car, CheckCircle, Loader2 } from 'lucide-react';
import { PriceCalculation } from '../../types';

interface VehicleSelectionProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
  passengerCount?: number;
  baggageCount?: number;
  vehicles: any[];
}

export default function VehicleSelection({
  selectedVehicle,
  onVehicleSelect,
  passengerCount = 1,
  baggageCount = 1,
  vehicles: providedVehicles
}: VehicleSelectionProps) {
  // Use provided vehicles from admin panel only - no fallback to ensure dynamic behavior
  const vehiclesToDisplay = providedVehicles?.filter(v => v.isActive) || [];

  const isVehicleSuitable = (vehicle: any) => {
    return vehicle.passengerCapacity >= (passengerCount || 1) && vehicle.baggageCapacity >= (baggageCount || 1);
  };

  // If no vehicles are available from admin panel, show loading state
  if (vehiclesToDisplay.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Araç bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Seçimi</h2>
      
      {/* 3-column grid layout for horizontal minimal cards */}
      <div className="grid grid-cols-3 gap-4">
        {vehiclesToDisplay.map((vehicle: any) => {
          const isSuitable = isVehicleSuitable(vehicle);
          const isSelected = selectedVehicle === vehicle.type || selectedVehicle === vehicle.id;

          return (
            <div
              key={vehicle.id || vehicle.type}
              className={`relative border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                  : isSuitable
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => isSuitable && onVehicleSelect(vehicle.id || vehicle.type)}
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
                    src={vehicle.image || vehicle.images?.[0] || 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={vehicle.name}
                    className="w-full h-24 object-cover"
                  />
                </div>

                {/* Package Name from admin panel */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {vehicle.name}
                  </h3>
                  {vehicle.model && (
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  )}
                </div>

                {/* Dynamic features from admin panel as small badges */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {vehicle.features && vehicle.features.slice(0, 3).map((feature: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Passenger/baggage capacity with small icons from admin panel */}
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