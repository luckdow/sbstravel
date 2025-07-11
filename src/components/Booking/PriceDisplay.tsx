import React from 'react';
import { Calculator, MapPin, Car, Plus, DollarSign } from 'lucide-react';
import { PriceCalculation } from '../../types';

interface PriceDisplayProps {
  priceCalculation: PriceCalculation;
}

export default function PriceDisplay({ priceCalculation }: PriceDisplayProps) {
  const vehicleNames = {
    standard: 'Standart Transfer',
    premium: 'Premium Transfer',
    luxury: 'Lüks & VIP Transfer'
  };

  const vehiclePrices = {
    standard: 4.5,
    premium: 6.5,
    luxury: 8.5
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky bottom-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calculator className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Fiyat Detayları</h3>
      </div>

      <div className="space-y-4">
        {/* Distance */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Mesafe</span>
          </div>
          <span className="font-semibold text-gray-800">{priceCalculation.distance.toFixed(1)} km</span>
        </div>

        {/* Vehicle Type */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">{vehicleNames[priceCalculation.vehicleType]}</span>
          </div>
          <span className="font-semibold text-gray-800">
            ${vehiclePrices[priceCalculation.vehicleType]}/km
          </span>
        </div>

        {/* Base Price */}
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700">Transfer Ücreti</span>
          <span className="font-semibold text-gray-800">
            ${priceCalculation.basePrice.toFixed(2)}
          </span>
        </div>

        {/* Additional Services */}
        {priceCalculation.additionalServicesCost > 0 && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Plus className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">Ek Hizmetler</span>
            </div>
            <span className="font-semibold text-gray-800">
              +${priceCalculation.additionalServicesCost.toFixed(2)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Total Price */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-lg font-bold text-gray-800">Toplam Tutar</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${priceCalculation.totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Included Services */}
        <div className="bg-green-50 rounded-xl p-4 mt-4">
          <h4 className="font-semibold text-green-800 mb-2">Fiyata Dahil Olanlar:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
            <div>✓ Yakıt</div>
            <div>✓ Sigorta</div>
            <div>✓ Profesyonel Şoför</div>
            <div>✓ 7/24 Destek</div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-center text-sm text-gray-500 mt-4">
          💳 Güvenli ödeme • 🔒 SSL korumalı • 📱 Anında onay
        </div>
      </div>
    </div>
  );
}