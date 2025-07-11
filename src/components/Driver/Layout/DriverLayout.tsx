import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { useEffect } from 'react';
import { 
  Car, 
  QrCode, 
  DollarSign, 
  Clock, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  MapPin
} from 'lucide-react';
import DriverSidebar from './DriverSidebar';
import DriverHeader from './DriverHeader';

interface DriverLayoutProps {
  children: React.ReactNode;
}

export default function DriverLayout({ children }: DriverLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setCurrentDriver, drivers } = useStore();

  useEffect(() => {
    // Set demo driver for testing
    const demoDriver = drivers.find(d => d.id === 'DRV-001');
    if (demoDriver) {
      setCurrentDriver(demoDriver);
    }
  }, [drivers, setCurrentDriver]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DriverSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <DriverHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}