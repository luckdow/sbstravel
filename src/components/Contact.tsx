import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar, User } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Merkez Ofis",
      details: ["Adres bilgisi güncellenecek", "İstanbul/Türkiye"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Telefon",
      details: ["0850 123 45 67 (Ücretsiz)", "Transfer Rezervasyon"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "E-posta",
      details: ["sbstravelinfo@gmail.com", "Genel Bilgi & Rezervasyon"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Çalışma Saatleri",
      details: ["7/24 Online Rezervasyon", "Telefon: 08:00 - 22:00"],
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <MessageCircle className="h-4 w-4" />
            <span>İletişim</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bizimle İletişime
            </span>
            <br />
            Geçin
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transfer rezervasyonu, sorularınız veya önerileriniz için 7/24 hizmetinizdeyiz. 
            Size en iyi şekilde yardımcı olmak için buradayız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">İletişim Bilgileri</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Müşteri memnuniyeti önceliğimiz. Transfer hizmetlerimiz hakkında size en hızlı şekilde dönüş yapabilmek için 
                birden fazla iletişim kanalımız bulunmaktadır.
              </p>
            </div>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="group">
                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">{info.title}</h4>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 mb-4">Hızlı İşlemler</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 text-left">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Transfer Rezervasyonu</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 text-left">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-700">Hemen Ara</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-white rounded-xl hover:shadow-md transition-all duration-300 text-left">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Canlı Destek</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Mesaj Gönderin</h3>
                <p className="text-gray-600">Formu doldurarak bize ulaşabilir, en kısa sürede size dönüş yapabiliriz.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Adınızı ve soyadınızı girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="E-posta adresinizi girin"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Telefon numaranızı girin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Konu</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                    >
                      <option value="">Konu seçin</option>
                      <option value="reservation">Transfer Rezervasyonu</option>
                      <option value="support">Teknik Destek</option>
                      <option value="complaint">Şikayet</option>
                      <option value="suggestion">Öneri</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mesaj *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Mesajınızı detaylı olarak yazın..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3"
                >
                  <Send className="h-5 w-5" />
                  <span>Mesajı Gönder</span>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  * işaretli alanlar zorunludur. Mesajınıza 24 saat içinde dönüş yapılacaktır.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Bizi Ziyaret Edin</h3>
            <p className="text-gray-600 mb-6">
              Merkez ofisimiz İstanbul'da bulunmaktadır. Transfer hizmetlerimiz hakkında detaylı bilgi için randevu alarak bizi ziyaret edebilirsiniz.
            </p>
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="h-64 bg-gray-300 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600">Harita Yükleniyor...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}