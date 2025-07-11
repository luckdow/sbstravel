import React from 'react';
import Header from '../components/Layout/Header';
import TransferHero from '../components/Hero/TransferHero';
import VehicleFleet from '../components/Fleet/VehicleFleet';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <TransferHero />
      <VehicleFleet />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}