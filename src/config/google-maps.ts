// Google Maps API configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  enabled: import.meta.env.VITE_GOOGLE_MAPS_ENABLED === 'true',
  libraries: ["places", "geometry"] as const,
  region: "TR",
  language: "tr"
};

// Check if Google Maps is properly configured
export const isGoogleMapsConfigured = (): boolean => {
  return Boolean(GOOGLE_MAPS_CONFIG.apiKey && GOOGLE_MAPS_CONFIG.enabled);
};

// Antalya Airport coordinates
export const ANTALYA_AIRPORT = {
  lat: 36.8987,
  lng: 30.7854,
  name: "Antalya Havalimanı (AYT)"
};

// Popular destinations in Antalya
export const POPULAR_DESTINATIONS = [
  { name: "Kemer", lat: 36.6048, lng: 30.5606, distance: 45 },
  { name: "Belek", lat: 36.8625, lng: 31.0556, distance: 35 },
  { name: "Side", lat: 36.7673, lng: 31.3890, distance: 65 },
  { name: "Alanya", lat: 36.5444, lng: 32.0000, distance: 120 },
  { name: "Kaş", lat: 36.2020, lng: 29.6414, distance: 180 },
  { name: "Kalkan", lat: 36.2667, lng: 29.4167, distance: 200 },
  { name: "Olympos", lat: 36.4167, lng: 30.4667, distance: 80 },
  { name: "Çıralı", lat: 36.4167, lng: 30.4667, distance: 85 }
];

// Vehicle pricing per km (USD)
export const VEHICLE_PRICING = {
  standard: 4.5,
  premium: 6.5,
  luxury: 8.5
} as const;

// Commission rates
export const COMMISSION_RATES = {
  company: 0.25, // 25% to company
  driver: 0.75   // 75% to driver
} as const;