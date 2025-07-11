import React, { useState, useEffect } from 'react';
import { Calculator, MapPin, Car, Plus, DollarSign, Clock, Users, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { PriceCalculation } from '../../types';

interface PriceDisplayProps {
  priceCalculation: PriceCalculation;
  passengerCount?: number;
  pickupTime?: string;
  pickupDate?: string;
}

interface PricingFactor {
  name: string;
  factor: number;
  description: string;
  type: 'increase' | 'decrease' | 'neutral';
}

export default function PriceDisplay({ 
  priceCalculation, 
  passengerCount = 1,
  pickupTime,
  pickupDate
}: PriceDisplayProps) {
  const [pricingFactors, setPricingFactors] = useState<PricingFactor[]>([]);
  const [adjustedPrice, setAdjustedPrice] = useState(priceCalculation.totalPrice);
  const [showDetails, setShowDetails] = useState(false);

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

  const vehicleFeatures = {
    standard: ['Klimalı araç', 'Deneyimli şoför', 'Temiz ve bakımlı'],
    premium: ['Lüks araç', 'Premium iç mekan', 'Su ikramı', 'WiFi'],
    luxury: ['VIP araç', 'Deri koltuk', 'Şampanya servisi', 'Gazeteler']
  };

  useEffect(() => {
    const calculatePricingFactors = () => {
      const factors: PricingFactor[] = [];
      let totalFactor = 1;

      // Time-based pricing
      if (pickupTime) {
        const hour = parseInt(pickupTime.split(':')[0]);
        
        if (hour >= 6 && hour <= 8) {
          factors.push({
            name: 'Sabah Erken Saatler',
            factor: 1.1,
            description: 'Sabah 06:00-08:00 arası %10 ek ücret',
            type: 'increase'
          });
          totalFactor *= 1.1;
        } else if (hour >= 22 || hour <= 4) {
          factors.push({
            name: 'Gece Tarifesi',
            factor: 1.2,
            description: 'Gece 22:00-04:00 arası %20 ek ücret',
            type: 'increase'
          });
          totalFactor *= 1.2;
        } else if (hour >= 9 && hour <= 17) {
          factors.push({
            name: 'Normal Saatler',
            factor: 1,
            description: 'Standart tarife',
            type: 'neutral'
          });
        }
      }

      // Date-based pricing (weekend/holiday)
      if (pickupDate) {
        const date = new Date(pickupDate);
        const day = date.getDay();
        
        if (day === 0 || day === 6) { // Weekend
          factors.push({
            name: 'Hafta Sonu',
            factor: 1.15,
            description: 'Hafta sonu %15 ek ücret',
            type: 'increase'
          });
          totalFactor *= 1.15;
        }

        // Summer season (June-September)
        const month = date.getMonth();
        if (month >= 5 && month <= 8) {
          factors.push({
            name: 'Yaz Sezonu',
            factor: 1.25,
            description: 'Yaz sezonu yoğunluk ücreti %25',
            type: 'increase'
          });
          totalFactor *= 1.25;
        }
      }

      // Distance-based discounts
      if (priceCalculation.distance > 50) {
        factors.push({
          name: 'Uzun Mesafe İndirimi',
          factor: 0.9,
          description: '50km üzeri %10 indirim',
          type: 'decrease'
        });
        totalFactor *= 0.9;
      }

      // Group discount
      if (passengerCount >= 4) {
        factors.push({
          name: 'Grup İndirimi',
          factor: 0.95,
          description: '4+ kişi %5 grup indirimi',
          type: 'decrease'
        });
        totalFactor *= 0.95;
      }

      // Early booking discount (simulated)
      const now = new Date();
      const pickupDateTime = pickupDate ? new Date(pickupDate) : new Date();
      const daysUntilTrip = Math.ceil((pickupDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilTrip > 7) {
        factors.push({
          name: 'Erken Rezervasyon',
          factor: 0.92,
          description: '7+ gün öncesi %8 indirim',
          type: 'decrease'
        });
        totalFactor *= 0.92;
      }

      setPricingFactors(factors);
      setAdjustedPrice(priceCalculation.totalPrice * totalFactor);
    };

    calculatePricingFactors();
  }, [priceCalculation, passengerCount, pickupTime, pickupDate]);

  const savings = priceCalculation.totalPrice - adjustedPrice;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 sticky bottom-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Fiyat Detayları</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <Info className="h-4 w-4" />
          <span>{showDetails ? 'Gizle' : 'Detaylar'}</span>
        </button>
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

        {/* Passenger Count */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">Yolcu Sayısı</span>
          </div>
          <span className="font-semibold text-gray-800">{passengerCount} kişi</span>
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

        {/* Pricing Factors */}
        {showDetails && pricingFactors.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Fiyat Faktörleri
            </h4>
            <div className="space-y-2">
              {pricingFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {factor.type === 'increase' && <TrendingUp className="h-3 w-3 text-red-500" />}
                    {factor.type === 'decrease' && <TrendingDown className="h-3 w-3 text-green-500" />}
                    {factor.type === 'neutral' && <div className="w-3 h-3 rounded-full bg-gray-400" />}
                    <span className={`${
                      factor.type === 'increase' ? 'text-red-600' :
                      factor.type === 'decrease' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {factor.name}
                    </span>
                  </div>
                  <span className={`font-medium ${
                    factor.type === 'increase' ? 'text-red-600' :
                    factor.type === 'decrease' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {factor.factor > 1 ? '+' : ''}
                    {((factor.factor - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Original Price (if different) */}
        {Math.abs(adjustedPrice - priceCalculation.totalPrice) > 0.01 && (
          <div className="flex items-center justify-between py-1">
            <span className="text-gray-500 line-through">Orijinal Fiyat</span>
            <span className="text-gray-500 line-through">${priceCalculation.totalPrice.toFixed(2)}</span>
          </div>
        )}

        {/* Savings */}
        {savings > 0.01 && (
          <div className="flex items-center justify-between py-1">
            <span className="text-green-600 font-medium">Toplam İndirim</span>
            <span className="text-green-600 font-bold">-${savings.toFixed(2)}</span>
          </div>
        )}

        {/* Total Price */}
        <div className="flex items-center justify-between py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">
              {savings > 0.01 ? 'İndirimli Fiyat' : 'Toplam Tutar'}
            </span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${adjustedPrice.toFixed(2)}
          </span>
        </div>

        {/* Vehicle Features */}
        {showDetails && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              {vehicleNames[priceCalculation.vehicleType]} Özellikleri:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              {vehicleFeatures[priceCalculation.vehicleType].map((feature, index) => (
                <div key={index}>✓ {feature}</div>
              ))}
            </div>
          </div>
        )}

        {/* Included Services */}
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-800 mb-2">Fiyata Dahil Olanlar:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
            <div>✓ Yakıt</div>
            <div>✓ Sigorta</div>
            <div>✓ Profesyonel Şoför</div>
            <div>✓ 7/24 Destek</div>
            <div>✓ Uçuş Takibi</div>
            <div>✓ Ücretsiz Bekleme</div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-center text-sm text-gray-500 mt-4">
          💳 Güvenli ödeme • 🔒 SSL korumalı • 📱 Anında onay
        </div>

        {/* Real-time Update Notice */}
        <div className="text-center text-xs text-blue-600 bg-blue-50 rounded-lg py-2 px-3">
          ⚡ Fiyatlar gerçek zamanlı olarak güncellenmektedir
        </div>
      </div>
    </div>
  );
}