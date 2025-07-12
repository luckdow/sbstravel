import React, { useState } from 'react';
import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useStore } from '../../../store/useStore';
import toast from 'react-hot-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { initializeMockData } = useStore();
  
  useEffect(() => {
    // Always initialize mock data for admin panel to ensure consistent experience
    try {
      initializeMockData();
    } catch (error) {
      console.error("Error initializing mock data:", error);
      toast.error("Demo veriler yüklenirken hata oluştu");
    }
  }, [initializeMockData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}