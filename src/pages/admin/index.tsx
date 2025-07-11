import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Dashboard from '../../components/Admin/Dashboard/Dashboard';

export default function AdminPage() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
}