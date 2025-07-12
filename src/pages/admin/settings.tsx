import React, { useState } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import SystemSettings from '../../components/Admin/Settings/SystemSettings';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <SystemSettings />
    </AdminLayout>
  );
}