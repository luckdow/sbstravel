import React from 'react';
import { Calendar, Shield, Eye, Database, Users } from 'lucide-react';
import { LegalPageMeta } from '../../types/security';

const pageMetadata: LegalPageMeta = {
  title: 'Gizlilik Politikası',
  lastUpdated: new Date('2024-01-15'),
  version: '2.1'
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">{pageMetadata.title}</h1>
            <p className="text-xl opacity-90">
              Kişisel verilerinizin güvenliği bizim önceliğimizdir
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6 text-sm opacity-75">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Son güncelleme: {pageMetadata.lastUpdated.toLocaleDateString('tr-TR')}</span>
              </div>
              <span>•</span>
              <span>Versiyon {pageMetadata.version}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            
            {/* Giriş */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="h-6 w-6 mr-3 text-blue-600" />
                Giriş
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  PremiumRent olarak, kişisel verilerinizin korunması konusunda azami hassasiyet göstermekteyiz. 
                  Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili 
                  mevzuat çerçevesinde hazırlanmıştır.
                </p>
                <p>
                  Bu politika, hizmetlerimizi kullanırken hangi kişisel verileri topladığımızı, 
                  bu verileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
                </p>
              </div>
            </section>

            {/* Veri Sorumlusu */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-blue-600" />
                Veri Sorumlusu
              </h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="prose text-gray-700">
                  <p><strong>Şirket Adı:</strong> PremiumRent Araç Kiralama A.Ş.</p>
                  <p><strong>Adres:</strong> Maslak, Büyükdere Cad. No:123, Sarıyer/İstanbul</p>
                  <p><strong>E-posta:</strong> kvkk@premiumrent.com</p>
                  <p><strong>Telefon:</strong> 0850 123 45 67</p>
                </div>
              </div>
            </section>

            {/* Toplanan Veriler */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Database className="h-6 w-6 mr-3 text-blue-600" />
                Toplanan Kişisel Veriler
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kimlik Bilgileri</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Ad, soyad</li>
                    <li>T.C. kimlik numarası</li>
                    <li>Doğum tarihi ve yeri</li>
                    <li>Ehliyet bilgileri</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>E-posta adresi</li>
                    <li>Telefon numarası</li>
                    <li>Adres bilgileri</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Finansal Bilgiler</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Kredi kartı bilgileri (şifrelenmiş)</li>
                    <li>Ödeme geçmişi</li>
                    <li>Fatura bilgileri</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kullanım Verileri</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Web sitesi kullanım bilgileri</li>
                    <li>IP adresi ve cihaz bilgileri</li>
                    <li>Çerez verileri</li>
                    <li>Rezervasyon ve seyahat geçmişi</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Veri İşleme Amaçları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veri İşleme Amaçları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Hizmet Sunumu</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Araç kiralama rezervasyonları</li>
                    <li>• Transfer hizmetleri</li>
                    <li>• Müşteri destek hizmetleri</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Yasal Yükümlülükler</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vergi mevzuatı gereği</li>
                    <li>• Ticaret kanunu gereği</li>
                    <li>• Trafik mevzuatı gereği</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Pazarlama</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Kampanya bilgilendirmeleri</li>
                    <li>• Kişiselleştirilmiş teklifler</li>
                    <li>• Müşteri memnuniyeti araştırmaları</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Güvenlik</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Dolandırıcılık önleme</li>
                    <li>• Güvenlik denetimleri</li>
                    <li>• Risk analizi</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Çerez Politikası */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Çerez Kullanımı</h2>
              <div className="bg-amber-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanmaktayız. 
                  Çerezler hakkında detaylı bilgi için <a href="/cookie-policy" className="text-blue-600 hover:underline">Çerez Politikamızı</a> inceleyebilirsiniz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Zorunlu Çerezler</div>
                    <div className="text-sm text-gray-600">Site işlevselliği için gerekli</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Analitik Çerezler</div>
                    <div className="text-sm text-gray-600">Google Analytics</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Pazarlama Çerezleri</div>
                    <div className="text-sm text-gray-600">Reklam optimizasyonu</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Üçüncü Taraf Entegrasyonları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Üçüncü Taraf Hizmet Sağlayıcıları</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">PayTR</div>
                    <div className="text-sm text-gray-600">Ödeme işlemleri</div>
                  </div>
                  <div className="text-sm text-blue-600">PCI DSS Sertifikalı</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Google Maps</div>
                    <div className="text-sm text-gray-600">Harita ve konum hizmetleri</div>
                  </div>
                  <div className="text-sm text-blue-600">Google Gizlilik Politikası</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Firebase</div>
                    <div className="text-sm text-gray-600">Uygulama altyapısı</div>
                  </div>
                  <div className="text-sm text-blue-600">Google Cloud Security</div>
                </div>
              </div>
            </section>

            {/* Veri Saklama */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veri Saklama Süreleri</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Veri Türü</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Saklama Süresi</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Yasal Dayanak</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Kimlik Bilgileri</td>
                      <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Ticaret Kanunu</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Finansal Bilgiler</td>
                      <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Vergi Usul Kanunu</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">İletişim Bilgileri</td>
                      <td className="border border-gray-300 px-4 py-2">5 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">KVKK m.7</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Kullanım Verileri</td>
                      <td className="border border-gray-300 px-4 py-2">2 yıl</td>
                      <td className="border border-gray-300 px-4 py-2">Elektronik Ticaret Kanunu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Kullanıcı Hakları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veri Sahibi Hakları</h2>
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">KVKK kapsamında sahip olduğunuz haklar:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Kişisel verilerin işlenip işlenmediğini öğrenme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Yurt içinde/dışında aktarıldığı tarafları öğrenme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Eksik/yanlış verilerin düzeltilmesini isteme</span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Kanunlarda öngörülen şartlarda silinmesini isteme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>İşleme işlemlerinin üçüncü kişilere bildirilmesini isteme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Otomatik sistemle analiz edilmesine itiraz etme</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Zararın giderilmesini talep etme</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Başvuru Prosedürü */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Başvuru Prosedürü</h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  KVKK haklarınızı kullanmak için aşağıdaki kanallardan başvuruda bulunabilirsiniz:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-gray-700">E-posta: kvkk@premiumrent.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-gray-700">Posta: Maslak, Büyükdere Cad. No:123, Sarıyer/İstanbul</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-gray-700">Telefon: 0850 123 45 67 (KVKK Hattı)</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Başvurular en geç 30 gün içinde cevaplanır. Başvuru ücretsizdir, ancak bilgi kopyası istenmesi durumunda makul bir ücret talep edilebilir.
                </p>
              </div>
            </section>

            {/* İletişim */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold text-gray-900">E-posta</div>
                    <div className="text-blue-600">privacy@premiumrent.com</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <div className="text-gray-700">0850 123 45 67</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}