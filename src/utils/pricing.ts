export const VEHICLE_PRICING = {
  standard: 4.5, // USD per KM
  premium: 6.5,  // USD per KM
  luxury: 8.5    // USD per KM
} as const;

export const COMMISSION_RATES = {
  company: 0.25, // 25% to company
  driver: 0.75   // 75% to driver
} as const;

export function calculatePrice(distance: number, vehicleType: keyof typeof VEHICLE_PRICING): number {
  return distance * VEHICLE_PRICING[vehicleType];
}

export function calculateCommission(totalAmount: number) {
  return {
    companyShare: totalAmount * COMMISSION_RATES.company,
    driverShare: totalAmount * COMMISSION_RATES.driver
  };
}