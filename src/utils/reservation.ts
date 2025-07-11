/**
 * Utility functions for reservation management
 */

/**
 * Generates a readable reservation number in SBS-XXX format
 * @param rawId - Raw Firebase ID or any string ID
 * @param index - Optional index number for sequential numbering
 * @returns Formatted reservation number like "SBS-101"
 */
export function generateReadableReservationNumber(rawId: string, index?: number): string {
  if (index !== undefined) {
    // Use sequential numbering starting from 101
    return `SBS-${(101 + index).toString()}`;
  }
  
  // Generate from hash of rawId for consistency
  const hash = rawId.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffff;
  }, 0);
  
  // Ensure it's always a 3-digit number starting from 101
  const number = 101 + (Math.abs(hash) % 899); // 101-999 range
  return `SBS-${number}`;
}

/**
 * Maps raw reservation ID to readable format
 * @param reservations - Array of reservations to process
 * @returns Array with readable reservation numbers
 */
export function addReadableReservationNumbers<T extends { id?: string }>(reservations: T[]): (T & { readableId: string })[] {
  return reservations.map((reservation, index) => ({
    ...reservation,
    readableId: generateReadableReservationNumber(reservation.id || `temp-${index}`, index)
  }));
}

/**
 * Finds a driver by ID and returns their full name
 * @param driverId - Driver ID to search for
 * @param drivers - Array of drivers
 * @returns Driver's full name or "Atanmadı" if not found
 */
export function getDriverDisplayName(driverId: string | undefined, drivers: Array<{ id?: string; firstName: string; lastName: string }>): string {
  if (!driverId) return 'Atanmadı';
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) return 'Bilinmeyen Şoför';
  
  return `${driver.firstName} ${driver.lastName}`;
}