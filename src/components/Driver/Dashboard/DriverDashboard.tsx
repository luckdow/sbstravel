import React from 'react';
import DriverStats from './DriverStats';
import ActiveTransfers from './ActiveTransfers';
import TodayEarnings from './TodayEarnings';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';

export default function DriverDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Stats Cards */}
      <DriverStats />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Transfers */}
        <div className="lg:col-span-2">
          <ActiveTransfers />
        </div>
        
        {/* Today's Earnings */}
        <div className="lg:col-span-1">
          <TodayEarnings />
        </div>
      </div>
      
      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}