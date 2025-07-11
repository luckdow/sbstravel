import React from 'react';
import { Users, Luggage, Star, Shield, Zap, Car } from 'lucide-react';

const vehicles = [
  {
    id: 1,
    type: 'standard',
    name: 'Standart Transfer Aracı',
    model: 'Volkswagen Caddy / Ford Tourneo',
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 4,
    baggageCapacity: 4,
    pricePerKm: 4.5,
    features: ['Klima', 'Müzik Sistemi', 'Güvenli Sürüş', 'Temiz Araç'],
    description: 'Ekonomik ve konforlu transfer çözümü. Küçük gruplar için ideal.',
    popular: false
  },
  {
    id: 2,
    type: 'premium',
    name: 'Premium Transfer Aracı',
    model: 'Mercedes Vito / Volkswagen Caravelle',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 8,
    baggageCapacity: 8,
    pricePerKm: 6.5,
    features: ['Premium İç Mekan', 'Wi-Fi', 'Su İkramı', 'Profesyonel Şoför'],
    description: 'Konfor ve kaliteyi bir arada sunan premium araç seçeneği.',
    popular: true
  },
  {
    id: 3,
    type: 'luxury',
    name: 'Lüks & VIP Transfer',
    model: 'Mercedes V-Class / BMW X7',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800',
    passengerCapacity: 6,
    baggageCapacity: 6,
    pricePerKm: 8.5,
    features: ['Lüks Deri Döşeme', 'VIP Karşılama', 'Soğuk İçecek', 'Özel Şoför'],
    description: 'En üst düzey konfor ve prestij arayanlar için VIP transfer hizmeti.',
    popular: false
  }
];

export default function VehicleFleet() {
  return (
    <section id="fleet" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Car className="h-4 w-4" />
            <span>Araç Filosu</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Transfer Araçları
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Her bütçeye uygun, konforlu ve güvenli araç seçenekleri. 
            Tüm araçlarımız düzenli bakım ve temizlikten geçmektedir.
          </p>
        </div>

        {/* Vehicle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
              {/* Badge */}
              {vehicle.popular && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ⭐ En Popüler
                  </div>
                </div>
              )}
              
              {/* Image */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 right-4 z-20">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {vehicle.type}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{vehicle.model}</p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{vehicle.description}</p>
                </div>
                
                {/* Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <Users className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors mb-1" />
                    <span className="text-sm font-medium text-gray-700">{vehicle.passengerCapacity} Kişi</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <Luggage className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors mb-1" />
                    <span className="text-sm font-medium text-gray-700">{vehicle.baggageCapacity} Bagaj</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Özellikler:</h4>
                  <div className="flex flex-wrap gap-1">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">Premium Hizmet</div>
                      <div className="text-sm text-gray-500">Kaliteli Transfer</div>
                    </div>
                  </div>
                  
                  <button className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Seç</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fiyatlandırma Nasıl Çalışır?</h3>
            <p className="text-gray-600">Antalya Havalimanı'ndan varış noktanıza olan mesafeye göre şeffaf fiyatlandırma</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Otomatik Hesaplama</h4>
              <p className="text-gray-600 text-sm">Varış noktanızı girin, sistem otomatik olarak mesafeyi hesaplayıp fiyatı gösterir</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Sabit Fiyat</h4>
              <p className="text-gray-600 text-sm">Rezervasyon sırasında gördüğünüz fiyat kesindir, ek ücret yoktur</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">Premium Hizmet</h4>
              <p className="text-gray-600 text-sm">Tüm fiyatlara sigorta, yakıt ve profesyonel şoför hizmeti dahildir</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}