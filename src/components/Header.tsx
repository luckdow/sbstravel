import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, Phone, MapPin, ChevronDown, User } from 'lucide-react';
import SSLIndicator from './Security/SSLIndicator';
import SecurityBadge from './Security/SecurityBadge';
import { isCustomerSessionValid, getCustomerSession } from '../utils/customerSession';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  useEffect(() => {
    // Müşteri oturumunu kontrol et
    const sessionValid = isCustomerSessionValid();
    setIsLoggedIn(sessionValid);
    
    if (sessionValid) {
      const session = getCustomerSession();
      if (session) {
        setCustomerName(`${session.firstName} ${session.lastName}`);
      }
    }
  }, []);
  
  // Oturum durumunu kontrol eden yardımcı fonksiyon
  const checkIsLoggedIn = () => {
    const customerSession = localStorage.getItem('sbs_customer_session');
    return !!customerSession;
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100' 
        : 'bg-black/20 backdrop-blur-md shadow-lg border-b border-white/10'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isScrolled ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-white drop-shadow-lg'}`}>
                SBS TRAVEL
              </h1>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link 
                to="/profile"
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                } transition-colors`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">{customerName || 'Profilim'}</span>
              </Link>
            ) : (
              <Link 
                to="/customer/login" 
                className={`flex items-center space-x-2 ${
                  isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'
                } transition-colors`}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Giriş Yap</span>
              </Link>
            )}
            
            <Link to="/booking" className="relative group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
              <span className="relative z-10">Rezervasyon</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { name: 'Ana Sayfa', href: '/' },
              { name: 'Hakkımızda', href: '/about' },
              { name: 'Transfer Bilgileri', href: '/transfer-info' },
              { name: 'SSS', href: '/faq' },
              { name: 'KVKK/Gizlilik', href: '/kvkk-policy' },
              { name: 'İletişim', href: '/contact' }
            ].map((item, index) => (
              <Link 
                key={index}
                to={item.href}
                className={`relative font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200 drop-shadow-lg font-semibold'
                } group`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-6">
            <SSLIndicator className={isScrolled ? 'text-gray-600' : 'text-white drop-shadow-lg'} />
            <div className={`flex items-center space-x-2 text-sm ${isScrolled ? 'text-gray-600' : 'text-white/90 drop-shadow-lg'}`}>
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">0850 123 45 67</p>
                <p className="text-xs opacity-75">7/24 Destek</p>
              </div>
            </div>
            <Link to="/booking" className="relative group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105">
              <span className="relative z-10">Rezervasyon</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          {/* Customer Login/Profile Button */}
          <Link
            to={isLoggedIn ? "/profile" : "/customer/login"}
            className={`p-2 rounded-full ${
              isScrolled 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-white/10 text-white hover:bg-white/20'
            } transition-colors mr-4`}
            title={isLoggedIn ? "Profilim" : "Giriş Yap"}
          >
            <User className="h-5 w-5" />
          </Link>

          <button 
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl">
            <nav className="p-6 space-y-4">
              {[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Hakkımızda', href: '/about' },
                { name: 'Transfer Bilgileri', href: '/transfer-info' },
                { name: 'SSS', href: '/faq' },
                { name: 'KVKK/Gizlilik', href: '/kvkk-policy' },
                { name: 'İletişim', href: '/contact' }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.href}
                  className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/booking" className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold mt-4 text-center">
                Rezervasyon
              </Link>
              
              <Link to={isLoggedIn ? "/profile" : "/customer/login"}>
                <button className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold mt-4">
                  {isLoggedIn() ? "Profilim" : "Giriş Yap"}
                </button>
              </Link>
              {!isLoggedIn && (
                <Link to="/customer/login">
                  <button className="w-full bg-gray-600 text-white py-3 rounded-xl font-semibold mt-2">
                    Giriş Yap
                  </button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}