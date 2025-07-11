import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import DriverAssignment from '../../components/Admin/Drivers/DriverAssignment';

export default function AdminDriverAssignmentPage() {
  return (
    <AdminLayout>
      <DriverAssignment />
    </AdminLayout>
  );
}