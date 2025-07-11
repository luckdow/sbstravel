/**
 * Utility functions for handling location data safely
 */

import { LocationData } from '../../types';

/**
 * Safely extracts a location string from either a string or location object
 * @param location - Can be a string, location object, or null/undefined
 * @returns A safe string representation of the location
 */
export function getLocationString(location: any): string {
  // Handle null/undefined first
  if (location === null || location === undefined) {
    return 'Bilinmeyen Lokasyon';
  }

  // If it's already a string, return it
  if (typeof location === 'string') {
    return location;
  }

  // If it's an object with location properties, extract the best available string
  if (typeof location === 'object') {
    // Try formatted_address first (most descriptive)
    if (location.formatted_address && typeof location.formatted_address === 'string') {
      return location.formatted_address;
    }
    
    // Fall back to name
    if (location.name && typeof location.name === 'string') {
      return location.name;
    }
    
    // If it has lat/lng but no readable address, format coordinates
    if (typeof location.lat === 'number' && typeof location.lng === 'number') {
      return `Konum: ${Number(location.lat).toFixed(4)}, ${Number(location.lng).toFixed(4)}`;
    }
  }

  // Last resort: convert to string or return fallback
  try {
    const stringified = String(location);
    return stringified !== '[object Object]' ? stringified : 'Bilinmeyen Lokasyon';
  } catch {
    return 'Bilinmeyen Lokasyon';
  }
}

/**
 * Validates if a location object has the expected structure
 * @param location - Location object to validate
 * @returns boolean indicating if the location has valid structure
 */
export function isValidLocationObject(location: any): location is LocationData {
  return (
    location &&
    typeof location === 'object' &&
    typeof location.name === 'string' &&
    typeof location.lat === 'number' &&
    typeof location.lng === 'number'
  );
}

/**
 * Safely extracts location data for displaying pickup/dropoff locations
 * @param pickupLocation - Pickup location (string or object)
 * @param dropoffLocation - Dropoff location (string or object)
 * @returns Object with safe pickup and dropoff strings
 */
export function getSafeLocationStrings(pickupLocation: any, dropoffLocation: any) {
  return {
    pickup: getLocationString(pickupLocation),
    dropoff: getLocationString(dropoffLocation)
  };
}