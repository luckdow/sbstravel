import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import DriverManagement from '../../components/Admin/Drivers/DriverManagement';

export default function AdminDriversPage() {
  return (
    <AdminLayout>
      <DriverManagement />
    </AdminLayout>
  );
}