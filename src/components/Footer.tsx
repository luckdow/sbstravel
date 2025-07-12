import React from 'react';
import { Car, Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight, Award, Shield, Clock } from 'lucide-react';
import SecurityBadge from './Security/SecurityBadge';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                  <Car className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SBS TRAVEL
                </h3>
                <p className="text-sm text-gray-400">Transfer Hizmeti</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Türkiye'nin en güvenilir transfer hizmeti. Havalimanı-otel ve otel-havalimanı 
              transferlerinizde konforlu ve güvenli yolculuk deneyimi sunuyoruz.
            </p>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-2">
                  <Award className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-xs text-gray-400">15+ Yıl</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-2">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <p className="text-xs text-gray-400">Güvenli</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-2">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <p className="text-xs text-gray-400">7/24</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'hover:text-blue-400' },
                { icon: Twitter, color: 'hover:text-sky-400' },
                { icon: Instagram, color: 'hover:text-pink-400' },
                { icon: Youtube, color: 'hover:text-red-400' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className={`p-3 bg-gray-800 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Hızlı Bağlantılar</h4>
            <ul className="space-y-3">
              {[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Hakkımızda', href: '/about' },
                { name: 'Transfer Bilgileri', href: '/transfer-info' },
                { name: 'SSS', href: '/faq' },
                { name: 'İletişim', href: '/contact' }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Transfer Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Transfer Hizmetlerimiz</h4>
            <ul className="space-y-3">
              {[
                'Havalimanı - Otel Transfer',
                'Otel - Havalimanı Transfer', 
                'Şehirler Arası Transfer',
                'VIP Transfer Hizmeti',
                'Grup Transfer',
                '7/24 Transfer'
              ].map((category, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    <span>{category}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">İletişim</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Phone className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">0850 123 45 67</p>
                  <p className="text-gray-400 text-sm">7/24 Rezervasyon Hattı</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">sbstravelinfo@gmail.com</p>
                  <p className="text-gray-400 text-sm">Genel Bilgi</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">İstanbul Merkez</p>
                  <p className="text-gray-400 text-sm">Adres bilgisi güncellenecek</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-gray-700">
              <h5 className="font-semibold text-white mb-2">Transfer Fırsatlarından Haberdar Olun</h5>
              <p className="text-gray-400 text-sm mb-4">Özel transfer fırsatları kaçırmayın!</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 SBS TRAVEL. Tüm hakları saklıdır.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Türkiye'nin en güvenilir transfer hizmeti platformu
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
              {[
                { name: 'Gizlilik Politikası', href: '/privacy-policy' },
                { name: 'Kullanım Şartları', href: '/terms-of-service' }, 
                { name: 'Çerez Politikası', href: '/privacy-policy#cerezler' },
                { name: 'KVKK', href: '/kvkk-policy' }
              ].map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Security Badges */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 mt-4">
              <SecurityBadge type="ssl" size="sm" />
              <SecurityBadge type="payment" size="sm" />
              <SecurityBadge type="data" size="sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}