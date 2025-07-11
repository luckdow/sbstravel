import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Dashboard from '../../components/Admin/Dashboard/Dashboard';
import ErrorBoundary from '../../components/Error/ErrorBoundary';

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Admin Dashboard Error:', error);
        console.error('Error Info:', errorInfo);
      }}
    >
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </ErrorBoundary>
  );
}