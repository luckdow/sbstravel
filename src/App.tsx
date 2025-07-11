import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/Error/ErrorBoundary';

// Test Component
import SimpleTest from './components/SimpleTest';

// Public Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Pages
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminCustomersPage from './pages/admin/customers';
import AdminDriversPage from './pages/admin/drivers';
import AdminVehiclesPage from './pages/admin/vehicles';
import AdminSettingsPage from './pages/admin/settings';
import AdminNotificationsPage from './pages/admin/notifications';

// Driver Pages
import DriverLoginPage from './pages/auth/DriverLoginPage';
import DriverDashboardPage from './pages/driver/index';
import DriverQRScannerPage from './pages/driver/qr-scanner';
import DriverEarningsPage from './pages/driver/earnings';

// Customer Auth
import CustomerLoginPage from './pages/auth/CustomerLoginPage';

// Payment Pages
import PaymentSuccessPage from "./pages/payment/success";

// Legal Pages
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import KVKKPolicyPage from './pages/legal/KVKKPolicyPage';

// Quick Access Navigation
import QuickAccess from './components/Navigation/QuickAccess';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application Error:', error);
        console.error('Error Info:', errorInfo);
        // Here you could send error to logging service
      }}
    >
      <Routes>
        {/* Test Route */}
        <Route path="/test" element={<SimpleTest />} />
        
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/reservations" element={
          <ProtectedRoute requiredRole="admin">
            <AdminReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCustomersPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/drivers" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDriversPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/vehicles" element={
          <ProtectedRoute requiredRole="admin">
            <AdminVehiclesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute requiredRole="admin">
            <AdminSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedRoute requiredRole="admin">
            <AdminNotificationsPage />
          </ProtectedRoute>
        } />
        
        {/* Driver Routes */}
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver" element={
          <ProtectedRoute requiredRole="driver">
            <DriverDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/driver/qr-scanner" element={
          <ProtectedRoute requiredRole="driver">
            <DriverQRScannerPage />
          </ProtectedRoute>
        } />
        <Route path="/driver/earnings" element={
          <ProtectedRoute requiredRole="driver">
            <DriverEarningsPage />
          </ProtectedRoute>
        } />
        
        {/* Customer Auth */}
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        
        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />

        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/kvkk-policy" element={<KVKKPolicyPage />} />
      </Routes>
      
      {/* Quick Access Navigation */}
      <QuickAccess />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;