import { useStore } from '../store/useStore';

export const VEHICLE_PRICING = {
  standard: 4.5, // USD per KM
  premium: 6.5,  // USD per KM
  luxury: 8.5    // USD per KM
} as const;

export const COMMISSION_RATES = {
  company: 0.25, // 25% to company
  driver: 0.75   // 75% to driver
} as const;

// Static pricing for fallback
export function calculatePriceStatic(distance: number, vehicleType: keyof typeof VEHICLE_PRICING): number {
  return distance * VEHICLE_PRICING[vehicleType];
}

// Main async pricing function that uses dynamic data from admin panel
export async function calculatePrice(params: {
  destination: string;
  vehicleType: string;
  passengerCount: number;
  luggageCount: number;
  extraServices: string[];
  transferType: string;
}): Promise<{
  distance: number;
  basePrice: number;
  servicesPrice: number;
  total: number;
  totalPrice: number;
}> {
  // Get store instance to access vehicles and extra services data
  const store = useStore.getState();
  
  // For now, use a mock distance calculation based on destination
  // This should be replaced with Google Maps API integration
  const mockDistances: { [key: string]: number } = {
    'kemer': 42,
    'antalya': 12,
    'belek': 35,
    'side': 65,
    'alanya': 120,
    'kas': 190,
    'kalkan': 200,
    'default': 30
  };

  const destinationKey = params.destination.toLowerCase();
  const distance = mockDistances[destinationKey] || mockDistances['default'];
  
  // Get vehicle pricing from admin panel vehicles store - use pricePerKm directly
  let pricePerKm = VEHICLE_PRICING.standard; // Fallback to default
  
  if (store.vehicles && store.vehicles.length > 0) {
    const selectedVehicle = store.vehicles.find(v => 
      v.type === params.vehicleType || v.id === params.vehicleType
    );
    if (selectedVehicle && selectedVehicle.pricePerKm) {
      // Use admin panel pricePerKm directly as specified in requirements - NO CURRENCY CONVERSION
      pricePerKm = selectedVehicle.pricePerKm;
    }
  }

  const basePrice = distance * pricePerKm;
  
  // Calculate extra services price using dynamic data from admin panel - use price directly 
  let servicesPrice = 0;
  if (store.extraServices && store.extraServices.length > 0 && params.extraServices.length > 0) {
    servicesPrice = params.extraServices.reduce((total, serviceId) => {
      const service = store.extraServices.find(s => s.id === serviceId);
      if (service) {
        // Use service price directly as specified in requirements - NO CURRENCY CONVERSION
        return total + service.price;
      }
      return total;
    }, 0);
  }

  const total = basePrice + servicesPrice;

  return {
    distance,
    basePrice: Math.round(basePrice * 100) / 100, // Round to 2 decimal places
    servicesPrice: Math.round(servicesPrice * 100) / 100,
    total: Math.round(total * 100) / 100,
    totalPrice: Math.round(total * 100) / 100
  };
}

export function calculateCommission(totalAmount: number) {
  return {
    companyShare: totalAmount * COMMISSION_RATES.company,
    driverShare: totalAmount * COMMISSION_RATES.driver
  };
}