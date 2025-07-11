import React from 'react';
import StatsCards from './StatsCards';
import RecentReservations from './RecentReservations';
import RevenueChart from './RevenueChart';
import DriverStatus from './DriverStatus';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        
        {/* Driver Status */}
        <div className="lg:col-span-1">
          <DriverStatus />
        </div>
      </div>
      
      {/* Recent Reservations */}
      <RecentReservations />
    </div>
  );
}