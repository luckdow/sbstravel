import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import ExtraServiceManagement from '../../components/Admin/ExtraServices/ExtraServiceManagement';

export default function AdminExtraServicesPage() {
  return (
    <AdminLayout>
      <ExtraServiceManagement />
    </AdminLayout>
  );
}