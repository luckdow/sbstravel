import React from 'react';
import DriverLayout from '../../components/Driver/Layout/DriverLayout';
import EarningsOverview from '../../components/Driver/Earnings/EarningsOverview';

export default function DriverEarningsPage() {
  return (
    <DriverLayout>
      <EarningsOverview />
    </DriverLayout>
  );
}