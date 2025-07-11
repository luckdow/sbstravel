export interface StorageConfig {
  key: string;
  version: string;
  ttl?: number; // Time to live in milliseconds
}

export interface StoredData<T> {
  data: T;
  timestamp: number;
  version: string;
  ttl?: number;
}

export class PersistenceService {
  private static instance: PersistenceService;

  public static getInstance(): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService();
    }
    return PersistenceService.instance;
  }

  // Save data to localStorage with versioning and TTL
  save<T>(config: StorageConfig, data: T): boolean {
    try {
      const storedData: StoredData<T> = {
        data,
        timestamp: Date.now(),
        version: config.version,
        ttl: config.ttl
      };

      localStorage.setItem(config.key, JSON.stringify(storedData));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  // Load data from localStorage with TTL and version checks
  load<T>(config: StorageConfig): T | null {
    try {
      const item = localStorage.getItem(config.key);
      if (!item) return null;

      const storedData: StoredData<T> = JSON.parse(item);

      // Check version compatibility
      if (storedData.version !== config.version) {
        console.warn(`Version mismatch for ${config.key}. Expected: ${config.version}, Found: ${storedData.version}`);
        this.remove(config.key);
        return null;
      }

      // Check TTL
      if (storedData.ttl && Date.now() - storedData.timestamp > storedData.ttl) {
        console.info(`Data expired for ${config.key}`);
        this.remove(config.key);
        return null;
      }

      return storedData.data;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // Remove data from localStorage
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  // Clear all application data
  clearAll(keyPrefix: string = 'ayt_'): boolean {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(keyPrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Get storage usage statistics
  getStorageStats(): {
    usedBytes: number;
    totalKeys: number;
    appKeys: number;
    freeSpace: number;
  } {
    let usedBytes = 0;
    let totalKeys = 0;
    let appKeys = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalKeys++;
          const value = localStorage.getItem(key);
          if (value) {
            usedBytes += new Blob([key + value]).size;
          }
          if (key.startsWith('ayt_')) {
            appKeys++;
          }
        }
      }

      // Estimate free space (5MB is typical localStorage limit)
      const maxStorage = 5 * 1024 * 1024; // 5MB
      const freeSpace = maxStorage - usedBytes;

      return {
        usedBytes,
        totalKeys,
        appKeys,
        freeSpace
      };
    } catch (error) {
      console.error('Error calculating storage stats:', error);
      return {
        usedBytes: 0,
        totalKeys: 0,
        appKeys: 0,
        freeSpace: 0
      };
    }
  }

  // Export all application data
  exportData(keyPrefix: string = 'ayt_'): Record<string, any> {
    const exportData: Record<string, any> = {};
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(keyPrefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              exportData[key] = JSON.parse(value);
            } catch {
              exportData[key] = value;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }

    return exportData;
  }

  // Import data
  importData(data: Record<string, any>): boolean {
    try {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object') {
          localStorage.setItem(key, JSON.stringify(value));
        } else {
          localStorage.setItem(key, String(value));
        }
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Backup management
  createBackup(): string {
    const backup = {
      timestamp: Date.now(),
      version: '1.0.0',
      data: this.exportData()
    };
    return JSON.stringify(backup);
  }

  restoreBackup(backupString: string): boolean {
    try {
      const backup = JSON.parse(backupString);
      
      if (!backup.data || !backup.timestamp) {
        throw new Error('Invalid backup format');
      }

      // Clear existing data
      this.clearAll();
      
      // Import backup data
      return this.importData(backup.data);
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
}

// Application-specific persistence configurations
export const STORAGE_CONFIGS = {
  AUTH_STATE: {
    key: 'ayt_auth_state',
    version: '1.0.0',
    ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  USER_PREFERENCES: {
    key: 'ayt_user_preferences',
    version: '1.0.0'
  },
  BOOKING_DRAFT: {
    key: 'ayt_booking_draft',
    version: '1.0.0',
    ttl: 24 * 60 * 60 * 1000 // 24 hours
  },
  RECENT_SEARCHES: {
    key: 'ayt_recent_searches',
    version: '1.0.0',
    ttl: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  TRANSACTIONS: {
    key: 'ayt_transactions',
    version: '1.0.0'
  },
  NOTIFICATION_LOGS: {
    key: 'ayt_notification_logs',
    version: '1.0.0',
    ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  USERS: {
    key: 'ayt_users',
    version: '1.0.0'
  },
  APP_SETTINGS: {
    key: 'ayt_app_settings',
    version: '1.0.0'
  }
} as const;

// User preferences interface
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'tr' | 'en';
  currency: 'USD' | 'EUR' | 'TRY';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  dashboard: {
    defaultView: 'cards' | 'list';
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
  };
}

// Default user preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'tr',
  currency: 'USD',
  notifications: {
    email: true,
    sms: true,
    push: true,
    marketing: false
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  },
  dashboard: {
    defaultView: 'cards',
    autoRefresh: true,
    refreshInterval: 30
  }
};

export const persistenceService = PersistenceService.getInstance();