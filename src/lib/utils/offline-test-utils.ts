import { FirebasePersistence } from '../services/persistence-service';
import { Vehicle, Driver, Customer } from '../../types';

/**
 * Offline mode testing utilities
 */
export class OfflineTestUtils {
  
  // Simulate offline state by mocking Firebase functions to throw network errors
  static simulateOfflineState(): void {
    console.warn('Simulating offline state for testing');
    
    // This would be used for testing purposes
    // In production, this would detect actual network connectivity
  }

  // Restore online state
  static simulateOnlineState(): void {
    console.log('Simulating online state restored');
  }

  // Test data persistence
  static testPersistence(): boolean {
    try {
      const testVehicle: Vehicle = {
        id: 'test-vehicle',
        type: 'standard',
        name: 'Test Vehicle',
        model: 'Test Model',
        image: '/test.jpg',
        licensePlate: '07 TST 123',
        passengerCapacity: 4,
        baggageCapacity: 4,
        pricePerKm: 2.5,
        features: ['test'],
        isActive: true
      };

      const testDriver: Driver = {
        id: 'test-driver',
        firstName: 'Test',
        lastName: 'Driver',
        email: 'test@test.com',
        phone: '+90 555 123 4567',
        licenseNumber: 'TEST123',
        vehicleType: 'standard',
        status: 'available',
        rating: 5.0,
        totalEarnings: 0,
        completedTrips: 0,
        isActive: true
      };

      const testCustomer: Customer = {
        id: 'test-customer',
        firstName: 'Test',
        lastName: 'Customer',
        email: 'customer@test.com',
        phone: '+90 555 987 6543'
      };

      // Test saving
      const vehiclesSaved = FirebasePersistence.saveVehicles([testVehicle]);
      const driversSaved = FirebasePersistence.saveDrivers([testDriver]);
      const customersSaved = FirebasePersistence.saveCustomers([testCustomer]);

      // Test loading
      const loadedVehicles = FirebasePersistence.getVehicles();
      const loadedDrivers = FirebasePersistence.getDrivers();
      const loadedCustomers = FirebasePersistence.getCustomers();

      // Test offline changes
      FirebasePersistence.addOfflineChange({
        type: 'create',
        entity: 'vehicle',
        data: testVehicle,
        timestamp: new Date()
      });

      const offlineChanges = FirebasePersistence.getOfflineChanges();

      // Verify results
      const testResults = {
        vehiclesSaved,
        driversSaved,
        customersSaved,
        vehiclesLoaded: loadedVehicles.length > 0,
        driversLoaded: loadedDrivers.length > 0,
        customersLoaded: loadedCustomers.length > 0,
        offlineChangesTracked: offlineChanges.length > 0
      };

      console.log('Persistence test results:', testResults);

      // Cleanup
      FirebasePersistence.clearFirebaseCache();

      return Object.values(testResults).every(result => result === true);
    } catch (error) {
      console.error('Persistence test failed:', error);
      return false;
    }
  }

  // Check if data is stale
  static checkDataFreshness(): {
    isStale: boolean;
    lastSync: Date | null;
    hasVehicles: boolean;
    hasDrivers: boolean;
    hasCustomers: boolean;
  } {
    return {
      isStale: FirebasePersistence.isDataStale(30), // 30 minutes
      lastSync: FirebasePersistence.getLastSync(),
      hasVehicles: FirebasePersistence.hasVehicles(),
      hasDrivers: FirebasePersistence.hasDrivers(),
      hasCustomers: FirebasePersistence.hasCustomers()
    };
  }

  // Get offline changes summary
  static getOfflineChangesSummary(): {
    totalChanges: number;
    byType: Record<string, number>;
    byEntity: Record<string, number>;
  } {
    const changes = FirebasePersistence.getOfflineChanges();
    
    const summary = {
      totalChanges: changes.length,
      byType: {} as Record<string, number>,
      byEntity: {} as Record<string, number>
    };

    changes.forEach(change => {
      summary.byType[change.type] = (summary.byType[change.type] || 0) + 1;
      summary.byEntity[change.entity] = (summary.byEntity[change.entity] || 0) + 1;
    });

    return summary;
  }

  // Validate Firebase connection
  static async testFirebaseConnection(): Promise<{
    isConnected: boolean;
    latency?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      // In a real implementation, this would ping Firebase
      // For now, we'll simulate a connection test
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random connection result for testing
          if (Math.random() > 0.2) {
            resolve(true);
          } else {
            reject(new Error('Simulated connection failure'));
          }
        }, Math.random() * 2000 + 500); // 500-2500ms delay
      });

      const latency = Date.now() - startTime;
      return { isConnected: true, latency };
    } catch (error) {
      return { 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Run all tests
  static async runAllTests(): Promise<{
    persistenceTest: boolean;
    connectionTest: { isConnected: boolean; latency?: number; error?: string };
    dataFreshness: ReturnType<typeof OfflineTestUtils.checkDataFreshness>;
    offlineChanges: ReturnType<typeof OfflineTestUtils.getOfflineChangesSummary>;
  }> {
    console.log('Running offline functionality tests...');

    const results = {
      persistenceTest: this.testPersistence(),
      connectionTest: await this.testFirebaseConnection(),
      dataFreshness: this.checkDataFreshness(),
      offlineChanges: this.getOfflineChangesSummary()
    };

    console.log('Test results:', results);
    return results;
  }
}