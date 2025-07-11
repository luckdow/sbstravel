import React from 'react';
import DriverLayout from '../../components/Driver/Layout/DriverLayout';
import DriverDashboard from '../../components/Driver/Dashboard/DriverDashboard';

export default function DriverPage() {
  return (
    <DriverLayout>
      <DriverDashboard />
    </DriverLayout>
  );
}