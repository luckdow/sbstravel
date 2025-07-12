import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Users, 
  Luggage, 
  Shield, 
  Phone,
  CheckCircle,
  AlertCircle,
  Car,
  CreditCard,
  MessageCircle
} from 'lucide-react';

export default function TransferInfoPage() {
  const transferSteps = [
    {
      step: 1,
      title: "Rezervasyon",
      description: "Online veya telefon ile transfer rezervasyonunuzu yapın",
      icon: Phone,
      details: ["Kalkış ve varış noktalarını belirtin", "Tarih ve saat bilgilerini girin", "Yolcu sayısını seçin", "Araç tipini belirleyin"]
    },
    {
      step: 2,
      title: "Onay",
      description: "Rezervasyonunuz onaylanır ve detaylar size gönderilir",
      icon: CheckCircle,
      details: ["E-posta ile onay alırsınız", "SMS ile hatırlatma gelir", "Şoför bilgileri paylaşılır", "QR kod ile doğrulama"]
    },
    {
      step: 3,
      title: "Transfer",
      description: "Belirlenen zamanda şoförümüz sizi karşılar",
      icon: Car,
      details: ["Şoför isim tabelası ile bekler", "Bagajlarınız taşınır", "Konforlu yolculuk başlar", "Güvenli ulaşım sağlanır"]
    }
  ];

  const services = [
    {
      title: "Havalimanı → Otel Transfer",
      description: "Havalimanından otel ve tatil beldelerine güvenli transfer",
      features: ["Uçak takibi", "Bekletme hizmeti", "Bagaj yardımı", "24/7 hizmet"],
      icon: Plane
    },
    {
      title: "Otel → Havalimanı Transfer",
      description: "Otel ve tatil beldelerinden havalimanına transfer",
      features: ["Zamanında kalkış", "Trafik hesaplama", "Erken rezervasyon", "Güvenli ulaşım"],
      icon: MapPin
    },
    {
      title: "Şehirler Arası Transfer",
      description: "Farklı şehirlere konforlu transfer hizmeti",
      features: ["Uzun mesafe konfor", "Molalar", "Deneyimli şoförler", "Güvenli araçlar"],
      icon: Car
    }
  ];

  const vehicleTypes = [
    {
      name: "Standart Transfer",
      capacity: "1-4 Kişi",
      luggage: "4 Bagaj",
      features: ["Klima", "Müzik sistemi", "Temiz araç"],
      description: "Ekonomik ve konforlu transfer çözümü"
    },
    {
      name: "Premium Transfer", 
      capacity: "1-8 Kişi",
      luggage: "8 Bagaj",
      features: ["Wi-Fi", "Su ikramı", "Premium konfor"],
      description: "Konfor ve kaliteyi bir arada sunan seçenek"
    },
    {
      name: "VIP Transfer",
      capacity: "1-6 Kişi", 
      luggage: "6 Bagaj",
      features: ["Lüks döşeme", "VIP karşılama", "Özel şoför"],
      description: "En üst düzey konfor ve prestij"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transfer Bilgileri</h1>
            <p className="text-xl opacity-90 mb-8">
              SBS TRAVEL transfer hizmetleri hakkında detaylı bilgiler
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Transfer Süreci */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Transfer Süreci Nasıl İşler?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              3 basit adımda transfer rezervasyonunuzu tamamlayın ve konforlu yolculuğun keyfini çıkarın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {transferSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hizmet Türleri */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Transfer Hizmet Türleri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun transfer hizmeti seçeneklerimiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-6">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Araç Tipleri */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Araç Seçenekleri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grup büyüklüğünüze ve konfor ihtiyacınıza uygun araç seçenekleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicleTypes.map((vehicle, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{vehicle.name}</h3>
                <p className="text-gray-600 mb-4">{vehicle.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium">{vehicle.capacity}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Luggage className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm font-medium">{vehicle.luggage}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {vehicle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Önemli Bilgiler */}
        <section className="mb-20">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Önemli Transfer Bilgileri</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Transfer rezervasyonları en az 2 saat önceden yapılmalıdır</li>
                  <li>• Uçak gecikmelerinde şoförlerimiz maksimum 1 saat bekletme hizmeti sunar</li>
                  <li>• Bagaj limiti araç tipine göre değişir, fazla bagaj için önceden bildirim yapın</li>
                  <li>• İptal işlemleri transfer saatinden 4 saat öncesine kadar ücretsizdir</li>
                  <li>• Şoför iletişim bilgileri transfer günü SMS ile gönderilir</li>
                  <li>• Bebek koltuğu ihtiyacı rezervasyon sırasında belirtilmelidir</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* İletişim CTA */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Daha Fazla Bilgi mi İstiyorsunuz?</h3>
            <p className="text-blue-100 mb-6">
              Transfer hizmetlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                İletişime Geç
              </a>
              <a href="/booking" className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20 inline-flex items-center justify-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Hemen Rezervasyon Yap
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}