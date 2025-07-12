import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Footer';
import { 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Clock,
  Shield,
  CreditCard,
  MapPin,
  Users,
  Luggage
} from 'lucide-react';

const faqCategories = [
  {
    title: "Genel Sorular",
    icon: HelpCircle,
    questions: [
      {
        question: "SBS TRAVEL nedir ve hangi hizmetleri sunuyorsunuz?",
        answer: "SBS TRAVEL, Türkiye'nin güvenilir transfer hizmeti markasıdır. Havalimanı-otel ve otel-havalimanı transferlerinde 7/24 hizmet sunmaktayız. Modern araç filomuz ve deneyimli şoförlerimizle konforlu ve güvenli yolculuk deneyimi sağlıyoruz."
      },
      {
        question: "Hangi şehirlerde hizmet veriyorsunuz?",
        answer: "Antalya başta olmak üzere İstanbul, İzmir, Bodrum, Marmaris, Fethiye ve diğer turistik bölgelerde transfer hizmeti sunmaktayız. Detaylı bilgi için müşteri hizmetlerimizle iletişime geçebilirsiniz."
      },
      {
        question: "Transfer rezervasyonu nasıl yapabilirim?",
        answer: "Online rezervasyon formumuzu kullanarak, telefon ile arayarak veya WhatsApp üzerinden rezervasyon yapabilirsiniz. Rezervasyon işlemi çok basit ve hızlıdır."
      },
      {
        question: "Rezervasyon için ne kadar önceden haber vermem gerekir?",
        answer: "Minimum 2 saat önceden rezervasyon yapmanızı öneriyoruz. Ancak acil durumlar için müsaitlik durumuna göre daha kısa sürelerde de hizmet verebiliriz."
      }
    ]
  },
  {
    title: "Rezervasyon & Ödeme",
    icon: CreditCard,
    questions: [
      {
        question: "Ödeme yöntemleri nelerdir?",
        answer: "Nakit, kredi kartı, banka kartı ve online ödeme seçenekleri mevcuttur. Güvenli ödeme altyapımızla tüm işlemleriniz korunur."
      },
      {
        question: "Rezervasyonu iptal edebilir miyim?",
        answer: "Evet, transfer saatinden 4 saat öncesine kadar ücretsiz iptal edebilirsiniz. 4 saatten sonraki iptallerde ücret politikamız geçerlidir."
      },
      {
        question: "Rezervasyon değişikliği yapabilir miyim?",
        answer: "Transfer tarih, saat ve yer değişiklikleri müsaitlik durumuna göre yapılabilir. Değişiklik için mümkün olduğunca erken haber veriniz."
      },
      {
        question: "Çocuk koltuğu isteyebilir miyim?",
        answer: "Evet, bebek koltuğu ve çocuk koltuğu hizmeti sunuyoruz. Rezervasyon sırasında çocuk yaşını ve kilosunu belirtmeniz yeterlidir."
      }
    ]
  },
  {
    title: "Transfer Hizmeti",
    icon: MapPin,
    questions: [
      {
        question: "Şoför beni nasıl bulacak?",
        answer: "Şoförümüz havalimanında isim tabelası ile sizi bekler. Ayrıca şoför iletişim bilgileri transfer günü size SMS ile gönderilir."
      },
      {
        question: "Uçağım gecikirse ne olur?",
        answer: "Uçak takip sistemimiz sayesinde gecikmeleri anlık olarak takip ederiz. Şoförümüz maksimum 1 saat ücretsiz bekletme hizmeti sunar."
      },
      {
        question: "Bagaj limiti var mı?",
        answer: "Her araç tipinin farklı bagaj kapasitesi vardır. Standart araçlarda 4, premium araçlarda 8 bagaja kadar taşıma imkanı vardır. Fazla bagaj durumunda bildiriniz."
      },
      {
        question: "Transfer süresince ara verebilir miyim?",
        answer: "Kısa molalar mümkündür. Uzun mesafe transferlerde şoförümüzle koordineli olarak uygun yerlerde mola verebilirsiniz."
      }
    ]
  },
  {
    title: "Güvenlik & Konfor",
    icon: Shield,
    questions: [
      {
        question: "Araçlarınız güvenli mi?",
        answer: "Tüm araçlarımız düzenli bakım ve kontrolden geçer. Kasko ve trafik sigortası mevcuttur. Araçlarımız temizlik ve hijyen standartlarına uygun olarak hazırlanır."
      },
      {
        question: "Şoförleriniz deneyimli mi?",
        answer: "Şoförlerimiz minimum 5 yıl deneyimli, ehliyet ve sürücü sertifikalı profesyonellerdir. Bölge bilgisi olan ve müşteri memnuniyetine odaklı çalışırlar."
      },
      {
        question: "Araçlarda klima var mı?",
        answer: "Evet, tüm araçlarımızda klima sistemi mevcuttur. Ayrıca müzik sistemi, temiz interior ve konforlu koltuklar bulunur."
      },
      {
        question: "COVID-19 önlemleri alıyor musunuz?",
        answer: "Evet, araçlarımız her kullanım sonrası dezenfekte edilir. Şoförlerimiz hijyen kurallarına uyar ve maske kullanır."
      }
    ]
  },
  {
    title: "Destek & İletişim",
    icon: Phone,
    questions: [
      {
        question: "7/24 destek hizmeti var mı?",
        answer: "Evet, 7/24 müşteri destek hattımız mevcuttur. Her türlü sorun ve talep için 0850 123 45 67 numarasından bize ulaşabilirsiniz."
      },
      {
        question: "Transfer sırasında sorun yaşarsam ne yapmalıyım?",
        answer: "Acil durumlarda müşteri hizmetlerimizi arayın. Ayrıca şoförünüzün direkt iletişim bilgileri de size verilir."
      },
      {
        question: "Şikayet veya önerim var, nereye iletebilirim?",
        answer: "Tüm geri bildirimlerinizi sbstravelinfo@gmail.com adresine veya müşteri hizmetleri hattımıza iletebilirsiniz. Her geri bildirimi değerlendiriyoruz."
      },
      {
        question: "WhatsApp üzerinden iletişim kurabilir miyim?",
        answer: "Evet, WhatsApp üzerinden rezervasyon yapabilir ve destek alabilirsiniz. Hızlı iletişim için tercih edilen yöntemlerden biridir."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (questionIndex: number) => {
    setOpenQuestions(prev =>
      prev.includes(questionIndex)
        ? prev.filter(index => index !== questionIndex)
        : [...prev, questionIndex]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Sıkça Sorulan Sorular</h1>
            <p className="text-xl opacity-90 mb-8">
              Transfer hizmetlerimiz hakkında merak ettiklerinizin yanıtları burada
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Kategoriler</h3>
                <div className="space-y-2">
                  {faqCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveCategory(index)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-left ${
                        activeCategory === index
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'hover:bg-white hover:shadow-md text-gray-700'
                      }`}
                    >
                      <category.icon className="h-5 w-5" />
                      <span className="font-medium text-sm">{category.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  {React.createElement(faqCategories[activeCategory].icon, {
                    className: "h-6 w-6 text-blue-600"
                  })}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {faqCategories[activeCategory].title}
                  </h2>
                </div>
                <p className="text-gray-600">
                  Bu kategorideki sık sorulan sorular ve yanıtları
                </p>
              </div>

              <div className="space-y-4">
                {faqCategories[activeCategory].questions.map((faq, questionIndex) => {
                  const globalIndex = activeCategory * 1000 + questionIndex;
                  const isOpen = openQuestions.includes(globalIndex);
                  
                  return (
                    <div
                      key={questionIndex}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleQuestion(globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 pr-4">
                          {faq.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">7/24</div>
            <div className="text-gray-600 text-sm">Destek Hizmeti</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">25K+</div>
            <div className="text-gray-600 text-sm">Mutlu Müşteri</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">100%</div>
            <div className="text-gray-600 text-sm">Güvenli Transfer</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-3">
              <Luggage className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">99%</div>
            <div className="text-gray-600 text-sm">Zamanında Teslimat</div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Sorunuz Burada Yok mu?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Merak ettiğiniz herhangi bir konu varsa, 7/24 müşteri hizmetlerimiz 
            size yardımcı olmaktan mutluluk duyar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              İletişime Geç
            </a>
            <a 
              href="tel:+908501234567" 
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20 inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Hemen Ara
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}