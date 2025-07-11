import React from 'react';
import DriverLayout from '../../components/Driver/Layout/DriverLayout';
import QRScanner from '../../components/Driver/QRScanner/QRScanner';

export default function QRScannerPage() {
  return (
    <DriverLayout>
      <QRScanner />
    </DriverLayout>
  );
}