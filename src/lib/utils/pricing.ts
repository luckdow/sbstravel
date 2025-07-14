import { AdditionalService } from '../../types';

// Moved from config/google-maps.ts as part of refactoring
const VEHICLE_PRICING = {
  standard: 4.5,
  premium: 6.5,
  luxury: 8.5
} as const;

const COMMISSION_RATES = {
  company: 0.25, // 25% to company
  driver: 0.75   // 75% to driver
} as const;

export function calculateBasePrice(distance: number, vehicleType: keyof typeof VEHICLE_PRICING): number {
  return distance * VEHICLE_PRICING[vehicleType];
}

export function calculateAdditionalServicesCost(services: AdditionalService[]): number {
  return services.reduce((total, service) => total + (service.selected ? service.price : 0), 0);
}

export function calculateTotalPrice(
  distance: number, 
  vehicleType: keyof typeof VEHICLE_PRICING, 
  additionalServices: AdditionalService[] = []
): number {
  const basePrice = calculateBasePrice(distance, vehicleType);
  const servicesCost = calculateAdditionalServicesCost(additionalServices);
  return basePrice + servicesCost;
}

export function calculateCommission(totalAmount: number) {
  return {
    companyShare: totalAmount * COMMISSION_RATES.company,
    driverShare: totalAmount * COMMISSION_RATES.driver,
    companyPercentage: COMMISSION_RATES.company * 100,
    driverPercentage: COMMISSION_RATES.driver * 100
  };
}

// Available additional services
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  { id: 'baby-seat', name: 'Bebek Koltuğu', price: 10 },
  { id: 'booster-seat', name: 'Yükseltici Koltuk', price: 8 },
  { id: 'meet-greet', name: 'Karşılama Tabelası', price: 15 },
  { id: 'extra-stop', name: 'Ek Durak', price: 20 },
  { id: 'waiting-time', name: 'Bekleme Süresi (+30dk)', price: 25 },
  { id: 'premium-water', name: 'Premium Su İkramı', price: 5 },
  { id: 'wifi', name: 'Araç İçi WiFi', price: 8 },
  { id: 'phone-charger', name: 'Telefon Şarj Aleti', price: 3 }
];

// Currency formatting utility
export function formatCurrency(amount: number, currency: 'USD' | 'TRY' = 'USD'): string {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  } else {
    return `₺${amount.toFixed(2)}`;
  }
}

// Format currency for display (shorthand)
export const formatPrice = (amount: number): string => formatCurrency(amount, 'USD');