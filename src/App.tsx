import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';

// Driver Pages
import DriverDashboardPage from './pages/driver/index';
import DriverQRScannerPage from './pages/driver/qr-scanner';
import DriverEarningsPage from './pages/driver/earnings';

// Payment Pages
import PaymentSuccessPage from "./pages/payment/success";
import CustomerPanelPage from "./pages/customer-panel";

// Quick Access Navigation
import QuickAccess from './components/Navigation/QuickAccess';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/reservations" element={<AdminReservationsPage />} />
        
        {/* Driver Routes */}
        <Route path="/driver" element={<DriverDashboardPage />} />
        <Route path="/driver/qr-scanner" element={<DriverQRScannerPage />} />
        <Route path="/driver/earnings" element={<DriverEarningsPage />} />
        
        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        
        {/* Customer Panel */}
        <Route path="/customer-panel" element={<CustomerPanelPage />} />
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
    </>
  );
}

export default App;