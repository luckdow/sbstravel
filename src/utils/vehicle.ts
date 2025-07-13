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
      return vehicleType; // Fallback to original value
  }
}

export function getVehicleTypeFromId(id: string): string {
  // If the ID looks like a technical ID (long string), try to extract vehicle type
  // This handles cases where vehicle type is stored as an ID instead of the type itself
  if (id.length > 10) {
    // This is likely a technical ID, return a default or try to parse
    return 'Belirtilmemiş';
  }
  return getVehicleTypeDisplayName(id);
}