import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Admin Pages
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Simple placeholder components
const SimplePage = ({ title }: { title: string }) => (
  <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
    <h1 style={{ color: '#333' }}>{title}</h1>
    <p>This page is working correctly.</p>
  </div>
);

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SimplePage title="Homepage" />} />
        <Route path="/booking" element={<SimplePage title="Booking Page" />} />
        <Route path="/about" element={<SimplePage title="About Page" />} />
        <Route path="/services" element={<SimplePage title="Services Page" />} />
        <Route path="/contact" element={<SimplePage title="Contact Page" />} />
        <Route path="/unauthorized" element={<SimplePage title="Unauthorized" />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<SimplePage title="Admin Dashboard" />} />
        
        {/* Driver Routes */}
        <Route path="/driver/login" element={<SimplePage title="Driver Login" />} />
        <Route path="/driver" element={<SimplePage title="Driver Dashboard" />} />
        
        {/* Customer Auth */}
        <Route path="/customer/login" element={<SimplePage title="Customer Login" />} />
        
        {/* Legal Pages */}
        <Route path="/privacy-policy" element={<SimplePage title="Privacy Policy" />} />
        <Route path="/terms-of-service" element={<SimplePage title="Terms of Service" />} />
        <Route path="/kvkk-policy" element={<SimplePage title="KVKK Policy" />} />
      </Routes>
      
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