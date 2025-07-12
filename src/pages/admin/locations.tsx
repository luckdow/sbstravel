import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import LocationManagement from '../../components/Admin/Locations/LocationManagement';

export default function AdminLocationsPage() {
  return (
    <AdminLayout>
      <LocationManagement />
    </AdminLayout>
  );
}