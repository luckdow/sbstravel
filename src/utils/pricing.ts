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

// Main async pricing function that uses dynamic data
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
  
  // Get vehicle pricing (should come from admin panel in future)
  const vehiclePricing = {
    standard: 4.5,
    premium: 6.5,
    luxury: 8.5
  };

  const pricePerKm = vehiclePricing[params.vehicleType as keyof typeof vehiclePricing] || vehiclePricing.standard;
  const basePrice = distance * pricePerKm;
  
  // Calculate extra services price (mock data for now)
  const servicePrices: { [key: string]: number } = {
    'baby-seat': 15,
    'meet-greet': 10,
    'extra-stop': 25,
    'wifi': 5
  };
  
  const servicesPrice = params.extraServices.reduce((total, serviceId) => {
    return total + (servicePrices[serviceId] || 0);
  }, 0);

  const total = basePrice + servicesPrice;

  return {
    distance,
    basePrice,
    servicesPrice,
    total,
    totalPrice: total
  };
}

export function calculateCommission(totalAmount: number) {
  return {
    companyShare: totalAmount * COMMISSION_RATES.company,
    driverShare: totalAmount * COMMISSION_RATES.driver
  };
}