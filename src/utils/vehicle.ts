/**
 * Utility functions for vehicle-related operations
 */

export function getVehicleTypeDisplayName(vehicleType: string): string {
  switch (vehicleType) {
    case 'standard':
      return 'Standart Transfer';
    case 'premium':
      return 'Premium Transfer';
    case 'luxury':
      return 'Lüks VIP Transfer';
    default:
      // Fallback to original value with capitalization
      if (typeof vehicleType === 'string') {
        return vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1) + ' Transfer';
      }
      return 'Standart Transfer'; // Default fallback
  }
}

export function getVehicleTypeFromId(id: string): string {
  // If the ID looks like a technical ID (long string), try to extract vehicle type
  // This handles cases where vehicle type is stored as an ID instead of the type itself
  if (id.length > 10) {
    // This is likely a technical ID, return a default or try to parse
    return 'Standart Transfer';
  }
  return getVehicleTypeDisplayName(id);
}