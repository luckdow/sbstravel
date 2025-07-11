import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import About from '../components/About';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
    </div>
  );
}