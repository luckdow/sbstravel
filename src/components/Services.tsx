import React from 'react';
import { Shield, Clock, MapPin, Headphones, CreditCard, Users, Award, Zap, Car, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Shield,
    title: "Kapsamlı Sigorta",
    description: "Tüm araçlarımız kasko ve trafik sigortası ile tam korumalı. Ek güvence için premium sigorta seçenekleri.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Clock,
    title: "7/24 Hizmet",
    description: "Günün her saati rezervasyon, teslimat ve müşteri desteği. Acil durumlar için anında yardım.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: MapPin,
    title: "Ücretsiz Teslimat",
    description: "İstediğiniz adrese araç teslimatı tamamen ücretsiz. Havalimanı, otel veya evinize kadar getiriyoruz.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Headphones,
    title: "Premium Destek",
    description: "Deneyimli müşteri hizmetleri ekibimiz tüm sorularınız için 7/24 hizmetinizde.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: CreditCard,
    title: "Esnek Ödeme",
    description: "Nakit, kredi kartı, havale ve taksit seçenekleri. Kurumsal müşteriler için özel faturalama.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: Users,
    title: "Deneyimli Ekip",
    description: "15+ yıllık sektör deneyimi ile profesyonel hizmet. Uzman ekibimiz her zaman yanınızda.",
    color: "from-indigo-500 to-indigo-600"
  }
];

const features = [
  "Ücretsiz araç değişimi",
  "Sınırsız kilometre",
  "24/7 yol yardımı",
  "Ücretsiz ek sürücü",
  "Temizlik garantisi",
  "Yakıt seçeneği"
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Award className="h-4 w-4" />
            <span>Premium Hizmetler</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Neden PremiumRent?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Müşteri memnuniyetini ön planda tutarak, sektörün en kaliteli hizmetlerini sunuyoruz. 
            Her detayda mükemmellik için çalışıyoruz.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2"></div>
              <div className="relative p-8 text-center space-y-6">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity`}></div>
                  <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl shadow-lg`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Tüm Kiralama Paketlerimizde 
                <span className="text-blue-600"> Dahil Olan Özellikler</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105">
                  Detaylı Bilgi Al
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
              <img 
                src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Premium araç hizmetleri"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { number: "500+", label: "Premium Araç", icon: Car },
            { number: "50K+", label: "Mutlu Müşteri", icon: Users },
            { number: "25+", label: "Şehir", icon: MapPin },
            { number: "99%", label: "Memnuniyet", icon: Award }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}