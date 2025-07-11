import React from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import ReservationManagement from '../../components/Admin/Reservations/ReservationManagement';

export default function AdminReservationsPage() {
  return (
    <AdminLayout>
      <ReservationManagement />
    </AdminLayout>
  );
}