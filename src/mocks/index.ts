// Mock data exports
export { mockCustomers, getMockCustomers } from './mockCustomers';
export { mockDrivers, getMockDrivers, getAvailableMockDrivers } from './mockDrivers';
export { mockVehicles, getMockVehicles, getActiveMockVehicles, getMockVehiclesByType } from './mockVehicles';
export { 
  mockReservations, 
  getMockReservations, 
  getTodayMockReservations, 
  getPendingMockReservations,
  getMockReservationsByDriver,
  getMockReservationsByCustomer 
} from './mockReservations';

// Mock data provider
export { MockDataProvider, useMockData } from './MockDataProvider';

// Utility functions
export const isDevelopment = process.env.NODE_ENV === 'development';

export const mockDataConfig = {
  // Enable mock data by default in development
  enableByDefault: isDevelopment,
  
  // Show sample data buttons only in development
  showSampleDataButtons: isDevelopment,
  
  // Auto-disable when real data is available
  autoDisableOnRealData: true
};