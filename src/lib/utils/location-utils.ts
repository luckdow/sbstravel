import { LocationData } from '../../types';

/**
 * Safely converts a location value to a string for rendering
 * Handles both string and LocationData object types
 */
export function safeLocationToString(location: string | LocationData | any): string {
  // Handle null or undefined
  if (!location) {
    return 'Belirtilmemiş';
  }
  
  // If it's already a string, return it
  if (typeof location === 'string') {
    return location;
  }
  
  // If it's an object with name property (LocationData)
  if (typeof location === 'object' && location.name) {
    return location.name;
  }
  
  // If it's an object with formatted_address
  if (typeof location === 'object' && location.formatted_address) {
    return location.formatted_address;
  }
  
  // Fallback for any other object types
  if (typeof location === 'object') {
    return location.toString?.() || 'Belirtilmemiş';
  }
  
  // Final fallback
  return String(location);
}

/**
 * Safely formats a route display (pickup → dropoff)
 */
export function formatRoute(pickupLocation: string | LocationData | any, dropoffLocation: string | LocationData | any): string {
  const pickup = safeLocationToString(pickupLocation);
  const dropoff = safeLocationToString(dropoffLocation);
  return `${pickup} → ${dropoff}`;
}