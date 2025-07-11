import React from 'react';
import { Award, Users, Car, MapPin, Target, Eye, Heart, Zap } from 'lucide-react';

const stats = [
  {
    icon: Car,
    number: "500+",
    label: "Premium Araç Filosu",
    description: "Son model ve lüks araçlar"
  },
  {
    icon: Users,
    number: "50.000+",
    label: "Mutlu Müşteri",
    description: "Memnuniyet garantisi"
  },
  {
    icon: MapPin,
    number: "25+",
    label: "Hizmet Noktası",
    description: "Türkiye genelinde"
  },
  {
    icon: Award,
    number: "15+",
    label: "Yıl Deneyim",
    description: "Sektör liderliği"
  }
];

const values = [
  {
    icon: Target,
    title: "Misyonumuz",
    description: "Müşterilerimize en kaliteli araç kiralama deneyimini sunarak, yolculuklarını güvenli ve konforlu hale getirmek."
  },
  {
    icon: Eye,
    title: "Vizyonumuz",
    description: "Türkiye'nin en güvenilir ve tercih edilen premium araç kiralama markası olmak."
  },
  {
    icon: Heart,
    title: "Değerlerimiz",
    description: "Güven, kalite, müşteri memnuniyeti ve sürekli gelişim ilkelerimizle hizmet veriyoruz."
  }
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Award className="h-4 w-4" />
            <span>Hakkımızda</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Türkiye'nin Lider
            </span>
            <br />
            Araç Kiralama Şirketi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            2009 yılından beri sektörde öncü konumda olan PremiumRent, 
            müşteri memnuniyetini ön planda tutarak premium hizmet sunmaktadır.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                15 Yıllık Deneyim ile 
                <span className="text-blue-600"> Güvenilir Hizmet</span>
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                PremiumRent olarak 2009 yılından beri müşterilerimize en kaliteli araç kiralama hizmetini sunmaktayız. 
                Sektördeki derin deneyimimiz ve sürekli gelişen teknolojimizle, her geçen gün daha iyi hizmet vermeye odaklanıyoruz.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Geniş araç filomuz, profesyonel ekibimiz ve müşteri odaklı yaklaşımımızla, 
                araç kiralama deneyiminizi mükemmel kılmak için elimizden geleni yapıyoruz. 
                Her bütçeye uygun seçeneklerimizle hayalinizdeki yolculuğu gerçekleştirmenize yardımcı oluyoruz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="PremiumRent araç filosu"
                className="w-full h-80 object-cover"
              />
              <div className="p-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-4">Premium Araç Filosu</h4>
                <p className="text-gray-600 leading-relaxed">
                  Son model ve lüks araçlarımız düzenli bakım ve kontrolden geçerek, 
                  size en güvenli ve konforlu sürüş deneyimini sunmaktadır.
                </p>
                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Elektrikli Araçlar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Premium Modeller</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl shadow-xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Rakamlarla PremiumRent</h3>
            <p className="text-gray-600 text-lg">Başarılarımız ve büyüklüğümüzü gösteren önemli veriler</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <stat.icon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Bizimle Yolculuğa Çıkmaya Hazır mısınız?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Premium araç filomuz ve profesyonel hizmetimizle unutulmaz bir deneyim yaşayın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors">
                Araç Kirala
              </button>
              <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}