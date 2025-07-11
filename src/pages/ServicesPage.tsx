import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import Services from '../components/Services';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <Services />
      </div>
      <Footer />
    </div>
  );
}