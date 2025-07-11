import React, { createContext, useContext, useState, useCallback } from 'react';
import { Customer, Driver, Vehicle, Reservation, Commission } from '../types';
import { mockCustomers, getMockCustomers } from './mockCustomers';
import { mockDrivers, getMockDrivers, getAvailableMockDrivers } from './mockDrivers';
import { mockVehicles, getMockVehicles, getActiveMockVehicles } from './mockVehicles';
import { mockReservations, getMockReservations, getTodayMockReservations, getPendingMockReservations } from './mockReservations';

interface MockDataContextType {
  // Data state
  customers: Customer[];
  drivers: Driver[];
  vehicles: Vehicle[];
  reservations: Reservation[];
  commissions: Commission[];
  
  // Mock data enabled state
  isMockDataEnabled: boolean;
  setMockDataEnabled: (enabled: boolean) => void;
  
  // Data getters with filters
  getCustomers: (filters?: any) => Customer[];
  getDrivers: (filters?: any) => Driver[];
  getVehicles: (filters?: any) => Vehicle[];
  getReservations: (filters?: any) => Reservation[];
  
  // Utility functions
  getTodayReservations: () => Reservation[];
  getPendingReservations: () => Reservation[];
  getAvailableDrivers: () => Driver[];
  getActiveVehicles: () => Vehicle[];
  
  // Add sample data functions (for development)
  addSampleData: () => void;
  clearData: () => void;
  
  // CRUD operations (in-memory only)
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => Customer | null;
  deleteCustomer: (id: string) => boolean;
  
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => Driver;
  updateDriver: (id: string, updates: Partial<Driver>) => Driver | null;
  deleteDriver: (id: string) => boolean;
  
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Vehicle | null;
  deleteVehicle: (id: string) => boolean;
  
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Reservation;
  updateReservation: (id: string, updates: Partial<Reservation>) => Reservation | null;
  deleteReservation: (id: string) => boolean;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

interface MockDataProviderProps {
  children: React.ReactNode;
  initialMockEnabled?: boolean;
}

export function MockDataProvider({ children, initialMockEnabled = true }: MockDataProviderProps) {
  // Mock data enabled state
  const [isMockDataEnabled, setIsMockDataEnabled] = useState(initialMockEnabled);
  
  // In-memory data storage
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  // Generate unique ID
  const generateId = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Data getters with filters
  const getCustomers = useCallback((filters?: any) => {
    if (!isMockDataEnabled) return customers;
    
    if (customers.length === 0) {
      return getMockCustomers(filters);
    }
    
    let filteredCustomers = [...customers];
    
    if (filters?.status && filters.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer => customer.status === filters.status);
    }
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.firstName?.toLowerCase().includes(searchLower) ||
        customer.lastName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.includes(filters.searchTerm)
      );
    }
    
    return filteredCustomers;
  }, [customers, isMockDataEnabled]);

  const getDrivers = useCallback((filters?: any) => {
    if (!isMockDataEnabled) return drivers;
    
    if (drivers.length === 0) {
      return getMockDrivers(filters);
    }
    
    let filteredDrivers = [...drivers];
    
    if (filters?.status && filters.status !== 'all') {
      filteredDrivers = filteredDrivers.filter(driver => driver.status === filters.status);
    }
    
    if (filters?.vehicleType && filters.vehicleType !== 'all') {
      filteredDrivers = filteredDrivers.filter(driver => driver.vehicleType === filters.vehicleType);
    }
    
    if (filters?.isActive !== undefined) {
      filteredDrivers = filteredDrivers.filter(driver => driver.isActive === filters.isActive);
    }
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredDrivers = filteredDrivers.filter(driver =>
        driver.firstName?.toLowerCase().includes(searchLower) ||
        driver.lastName?.toLowerCase().includes(searchLower) ||
        driver.email?.toLowerCase().includes(searchLower) ||
        driver.phone?.includes(filters.searchTerm)
      );
    }
    
    return filteredDrivers;
  }, [drivers, isMockDataEnabled]);

  const getVehicles = useCallback((filters?: any) => {
    if (!isMockDataEnabled) return vehicles;
    
    if (vehicles.length === 0) {
      return getMockVehicles(filters);
    }
    
    let filteredVehicles = [...vehicles];
    
    if (filters?.type && filters.type !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === filters.type);
    }
    
    if (filters?.status && filters.status !== 'all') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.status === filters.status);
    }
    
    if (filters?.isActive !== undefined) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.isActive === filters.isActive);
    }
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredVehicles = filteredVehicles.filter(vehicle =>
        vehicle.name?.toLowerCase().includes(searchLower) ||
        vehicle.model?.toLowerCase().includes(searchLower) ||
        vehicle.licensePlate?.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredVehicles;
  }, [vehicles, isMockDataEnabled]);

  const getReservations = useCallback((filters?: any) => {
    if (!isMockDataEnabled) return reservations;
    
    if (reservations.length === 0) {
      return getMockReservations(filters);
    }
    
    let filteredReservations = [...reservations];
    
    if (filters?.status && filters.status !== 'all') {
      filteredReservations = filteredReservations.filter(reservation => reservation.status === filters.status);
    }
    
    if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
      filteredReservations = filteredReservations.filter(reservation => reservation.paymentStatus === filters.paymentStatus);
    }
    
    if (filters?.customerId) {
      filteredReservations = filteredReservations.filter(reservation => reservation.customerId === filters.customerId);
    }
    
    if (filters?.driverId) {
      filteredReservations = filteredReservations.filter(reservation => reservation.driverId === filters.driverId);
    }
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredReservations = filteredReservations.filter(reservation =>
        reservation.customerName?.toLowerCase().includes(searchLower) ||
        reservation.customerEmail?.toLowerCase().includes(searchLower) ||
        reservation.customerPhone?.includes(filters.searchTerm) ||
        reservation.pickupLocation?.toLowerCase().includes(searchLower) ||
        reservation.dropoffLocation?.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredReservations;
  }, [reservations, isMockDataEnabled]);

  // Utility functions
  const getTodayReservations = useCallback(() => {
    if (!isMockDataEnabled) {
      const today = new Date().toISOString().split('T')[0];
      return reservations.filter(r => r.pickupDate === today);
    }
    
    if (reservations.length === 0) {
      return getTodayMockReservations();
    }
    
    const today = new Date().toISOString().split('T')[0];
    return reservations.filter(r => r.pickupDate === today);
  }, [reservations, isMockDataEnabled]);

  const getPendingReservations = useCallback(() => {
    if (!isMockDataEnabled) {
      return reservations.filter(r => r.status === 'pending');
    }
    
    if (reservations.length === 0) {
      return getPendingMockReservations();
    }
    
    return reservations.filter(r => r.status === 'pending');
  }, [reservations, isMockDataEnabled]);

  const getAvailableDrivers = useCallback(() => {
    if (!isMockDataEnabled) {
      return drivers.filter(d => d.isActive && d.status === 'available');
    }
    
    if (drivers.length === 0) {
      return getAvailableMockDrivers();
    }
    
    return drivers.filter(d => d.isActive && d.status === 'available');
  }, [drivers, isMockDataEnabled]);

  const getActiveVehicles = useCallback(() => {
    if (!isMockDataEnabled) {
      return vehicles.filter(v => v.isActive && v.status === 'active');
    }
    
    if (vehicles.length === 0) {
      return getActiveMockVehicles();
    }
    
    return vehicles.filter(v => v.isActive && v.status === 'active');
  }, [vehicles, isMockDataEnabled]);

  // Sample data functions
  const addSampleData = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      setCustomers([...mockCustomers]);
      setDrivers([...mockDrivers]);
      setVehicles([...mockVehicles]);
      setReservations([...mockReservations]);
      setCommissions([]);
    }
  }, []);

  const clearData = useCallback(() => {
    setCustomers([]);
    setDrivers([]);
    setVehicles([]);
    setReservations([]);
    setCommissions([]);
  }, []);

  // CRUD operations (in-memory only)
  const addCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      id: generateId('CUST'),
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  }, [generateId]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    let updatedCustomer: Customer | null = null;
    setCustomers(prev => prev.map(customer => {
      if (customer.id === id) {
        updatedCustomer = { ...customer, ...updates, updatedAt: new Date() };
        return updatedCustomer;
      }
      return customer;
    }));
    return updatedCustomer;
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    let deleted = false;
    setCustomers(prev => {
      const newCustomers = prev.filter(customer => customer.id !== id);
      deleted = newCustomers.length !== prev.length;
      return newCustomers;
    });
    return deleted;
  }, []);

  // Similar CRUD operations for drivers, vehicles, and reservations
  const addDriver = useCallback((driverData: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      id: generateId('DRV'),
      ...driverData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setDrivers(prev => [newDriver, ...prev]);
    return newDriver;
  }, [generateId]);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    let updatedDriver: Driver | null = null;
    setDrivers(prev => prev.map(driver => {
      if (driver.id === id) {
        updatedDriver = { ...driver, ...updates, updatedAt: new Date() };
        return updatedDriver;
      }
      return driver;
    }));
    return updatedDriver;
  }, []);

  const deleteDriver = useCallback((id: string) => {
    let deleted = false;
    setDrivers(prev => {
      const newDrivers = prev.filter(driver => driver.id !== id);
      deleted = newDrivers.length !== prev.length;
      return newDrivers;
    });
    return deleted;
  }, []);

  const addVehicle = useCallback((vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      id: generateId('VEH'),
      ...vehicleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setVehicles(prev => [newVehicle, ...prev]);
    return newVehicle;
  }, [generateId]);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    let updatedVehicle: Vehicle | null = null;
    setVehicles(prev => prev.map(vehicle => {
      if (vehicle.id === id) {
        updatedVehicle = { ...vehicle, ...updates, updatedAt: new Date() };
        return updatedVehicle;
      }
      return vehicle;
    }));
    return updatedVehicle;
  }, []);

  const deleteVehicle = useCallback((id: string) => {
    let deleted = false;
    setVehicles(prev => {
      const newVehicles = prev.filter(vehicle => vehicle.id !== id);
      deleted = newVehicles.length !== prev.length;
      return newVehicles;
    });
    return deleted;
  }, []);

  const addReservation = useCallback((reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    const newReservation: Reservation = {
      id: generateId('RES'),
      ...reservationData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setReservations(prev => [newReservation, ...prev]);
    return newReservation;
  }, [generateId]);

  const updateReservation = useCallback((id: string, updates: Partial<Reservation>) => {
    let updatedReservation: Reservation | null = null;
    setReservations(prev => prev.map(reservation => {
      if (reservation.id === id) {
        updatedReservation = { ...reservation, ...updates, updatedAt: new Date() };
        return updatedReservation;
      }
      return reservation;
    }));
    return updatedReservation;
  }, []);

  const deleteReservation = useCallback((id: string) => {
    let deleted = false;
    setReservations(prev => {
      const newReservations = prev.filter(reservation => reservation.id !== id);
      deleted = newReservations.length !== prev.length;
      return newReservations;
    });
    return deleted;
  }, []);

  const value: MockDataContextType = {
    // Data state
    customers,
    drivers,
    vehicles,
    reservations,
    commissions,
    
    // Mock data enabled state
    isMockDataEnabled,
    setMockDataEnabled: setIsMockDataEnabled,
    
    // Data getters with filters
    getCustomers,
    getDrivers,
    getVehicles,
    getReservations,
    
    // Utility functions
    getTodayReservations,
    getPendingReservations,
    getAvailableDrivers,
    getActiveVehicles,
    
    // Add sample data functions
    addSampleData,
    clearData,
    
    // CRUD operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addDriver,
    updateDriver,
    deleteDriver,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addReservation,
    updateReservation,
    deleteReservation
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
}