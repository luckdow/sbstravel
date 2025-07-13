import { useStore } from '../store/useStore';
import { googleMapsService } from '../lib/google-maps';
import { ANTALYA_AIRPORT } from '../config/google-maps';

export const VEHICLE_PRICING = {
  standard: 4.5, // USD per KM
  premium: 6.5,  // USD per KM
  luxury: 8.5    // USD per KM
} as const;

export const COMMISSION_RATES = {
  company: 0.25, // 25% to company
  driver: 0.75   // 75% to driver
} as const;

// Static pricing for fallback
export function calculatePriceStatic(distance: number, vehicleType: keyof typeof VEHICLE_PRICING): number {
  return distance * VEHICLE_PRICING[vehicleType];
}

// Main async pricing function that uses Google Maps for accurate distance calculation
export async function calculatePrice(params: {
  destination: string | { name: string; [key: string]: any }; // Allow destination to be string or object
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
  console.log('Calculating price for:', params);

  // *** FIX STARTS HERE ***
  // Normalize destination parameter. It can be a string or a location object from Google Places.
  // We need to ensure we pass a string or a compatible LatLng object to the mapping service.
  const destinationName = typeof params.destination === 'string'
    ? params.destination
    : params.destination.name;
  // *** FIX ENDS HERE ***
  
  // Get store instance to access vehicles and extra services data
  const store = useStore.getState();
  
  let distance = 45; // Default fallback distance
  
  try {
    // Use Google Maps to get accurate distance
    const origin = params.transferType === 'airport-hotel' ? ANTALYA_AIRPORT : destinationName;
    const destinationForRoute = params.transferType === 'airport-hotel' ? destinationName : ANTALYA_AIRPORT;
    
    console.log('Calculating route from', origin, 'to', destinationForRoute);
        
    const routeResult = await googleMapsService.calculateRoute(origin, destinationForRoute);
    
    if (routeResult && routeResult.distance > 0) {
      distance = routeResult.distance;
      console.log(`Google Maps distance: ${distance}km`);
    } else {
      console.warn('Google Maps failed, using fallback distance calculation');
      // Fallback to static distance calculation
      const mockDistances: { [key: string]: number } = {
        'kemer': 42,
        'antalya': 12,
        'belek': 35,
        'side': 65,
        'alanya': 120,
        'kas': 190,
        'kalkan': 200,
        'default': 45
      };

      const destinationKey = destinationName.toLowerCase();
      distance = mockDistances[destinationKey] || mockDistances['default'];
      console.log(`Using fallback distance for ${destinationKey}: ${distance}km`);
    }
  } catch (error) {
    console.error('Error calculating distance with Google Maps:', error);
    // Use fallback distance calculation
    const mockDistances: { [key: string]: number } = {
      'kemer': 42,
      'antalya': 12,
      'belek': 35,
      'side': 65,
      'alanya': 120,
      'kas': 190,
      'kalkan': 200,
      'default': 45
    };

    const destinationKey = destinationName.toLowerCase();
    distance = mockDistances[destinationKey] || mockDistances['default'];
    console.log(`Error fallback - using distance for ${destinationKey}: ${distance}km`);
  }
  
  // Get vehicle pricing from admin panel vehicles store - use pricePerKm directly
  let pricePerKm = VEHICLE_PRICING.standard; // Fallback to default
  
  if (store.vehicles && store.vehicles.length > 0) {
    const selectedVehicle = store.vehicles.find(v => 
      v.type === params.vehicleType || v.id === params.vehicleType
    );
    if (selectedVehicle && selectedVehicle.pricePerKm) {
      // Use admin panel pricePerKm directly as specified in requirements - NO CURRENCY CONVERSION
      pricePerKm = selectedVehicle.pricePerKm;
      console.log(`Using vehicle pricePerKm: ${pricePerKm}`);
    }
  } else {
    console.log(`Using fallback pricePerKm for ${params.vehicleType}: ${pricePerKm}`);
  }

  const basePrice = distance * pricePerKm;
  
  // Calculate extra services price using dynamic data from admin panel - use price directly 
  let servicesPrice = 0;
  if (store.extraServices && store.extraServices.length > 0 && params.extraServices.length > 0) {
    servicesPrice = params.extraServices.reduce((total, serviceId) => {
      const service = store.extraServices.find(s => s.id === serviceId);
      if (service) {
        // Use service price directly as specified in requirements - NO CURRENCY CONVERSION
        console.log(`Adding service ${service.name}: ${service.price}`);
        return total + service.price;
      }
      return total;
    }, 0);
  }

  const total = basePrice + servicesPrice;

  const result = {
    distance,
    basePrice: Math.round(basePrice * 100) / 100, // Round to 2 decimal places
    servicesPrice: Math.round(servicesPrice * 100) / 100,
    total: Math.round(total * 100) / 100,
    totalPrice: Math.round(total * 100) / 100
  };
  
  console.log('Price calculation result:', result);
  return result;
}

export function calculateCommission(totalAmount: number) {
  return {
    companyShare: totalAmount * COMMISSION_RATES.company,
    driverShare: totalAmount * COMMISSION_RATES.driver
  };
}
