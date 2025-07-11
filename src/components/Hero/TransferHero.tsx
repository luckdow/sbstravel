import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Clock, Star, ArrowRight, Plane, Users, Shield, Phone } from 'lucide-react';

export default function TransferHero() {
  const [transferType, setTransferType] = useState('airport-hotel');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-blue-800/90 z-10"></div>
        <img 
          src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Antalya Airport Transfer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 z-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-30 container mx-auto px-4 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold">4.9/5 Müşteri Memnuniyeti</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Antalya Havalimanı
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Transfer Hizmeti
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-lg">
                  Antalya Havalimanı'ndan otel ve tatil beldelerine güvenli, konforlu ve 
                  🚗 Anında onay • 📱 QR kod ile doğrulama • 🎯 Profesyonel hizmet
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center space-x-3">
                  <span>Hemen Rezervasyon Yap</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="group bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-white/20 flex items-center justify-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+90 242 123 45 67</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
                    <Plane className="h-8 w-8 text-blue-300" />
                  </div>
                  <div className="text-2xl font-bold text-white">7/24</div>
                  <div className="text-blue-200 text-sm">Havalimanı Servisi</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
                    <Users className="h-8 w-8 text-green-300" />
                  </div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-blue-200 text-sm">Mutlu Müşteri</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
                    <Shield className="h-8 w-8 text-purple-300" />
                  </div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-blue-200 text-sm">Güvenli Transfer</div>
                </div>
              </div>
            </div>

            {/* Right Content - Quick Booking Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Hızlı Rezervasyon</h3>
                  <p className="text-gray-600">Antalya Havalimanı transfer rezervasyonunuzu hemen yapın</p>
                </div>

                {/* Transfer Type Selection */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                  <button
                    onClick={() => setTransferType('airport-hotel')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      transferType === 'airport-hotel'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Havalimanı → Otel
                  </button>
                  <button
                    onClick={() => setTransferType('hotel-airport')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm ${
                      transferType === 'hotel-airport'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Otel → Havalimanı
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {transferType === 'airport-hotel' ? 'Varış Noktası (Otel/Bölge)' : 'Kalkış Noktası (Otel/Bölge)'}
                    </label>
                    <input
                      type="text"
                      placeholder="Otel adı veya bölge girin (örn: Kemer, Belek, Side)"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                        Transfer Tarihi
                      </label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Transfer Saati
                      </label>
                      <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white">
                        <option>00:00</option>
                        <option>01:00</option>
                        <option>02:00</option>
                        <option>03:00</option>
                        <option>04:00</option>
                        <option>05:00</option>
                        <option>06:00</option>
                        <option>07:00</option>
                        <option>08:00</option>
                        <option>09:00</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                        <option>19:00</option>
                        <option>20:00</option>
                        <option>21:00</option>
                        <option>22:00</option>
                        <option>23:00</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        Yolcu Sayısı
                      </label>
                      <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white">
                        <option>1 Kişi</option>
                        <option>2 Kişi</option>
                        <option>3 Kişi</option>
                        <option>4 Kişi</option>
                        <option>5 Kişi</option>
                        <option>6 Kişi</option>
                        <option>7 Kişi</option>
                        <option>8+ Kişi</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Bagaj Sayısı</label>
                      <select className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white">
                        <option>1 Bagaj</option>
                        <option>2 Bagaj</option>
                        <option>3 Bagaj</option>
                        <option>4 Bagaj</option>
                        <option>5+ Bagaj</option>
                      </select>
                    </div>
                  </div>
                  
                  <Link to="/booking" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3">
                    <Search className="h-6 w-6" />
                    <span>Fiyat Hesapla & Rezervasyon Yap</span>
                  </Link>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    💳 Güvenli ödeme • 🚗 Anında onay • 📱 QR kod ile doğrulama
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}