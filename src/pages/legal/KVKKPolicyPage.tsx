import React from 'react';
import { Calendar, Shield, Database, Users, FileText, Phone, Mail } from 'lucide-react';
import { LegalPageMeta } from '../../types/security';

const pageMetadata: LegalPageMeta = {
  title: 'KVKK Aydınlatma Metni',
  lastUpdated: new Date('2024-01-15'),
  version: '2.1'
};

export default function KVKKPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Database className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">{pageMetadata.title}</h1>
            <p className="text-xl opacity-90">
              6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme
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
            
            {/* Veri Sorumlusu Kimliği */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-3 text-blue-600" />
                Veri Sorumlusu Kimliği
              </h2>
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Şirket Bilgileri</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Ticaret Unvanı:</strong> PremiumRent Araç Kiralama A.Ş.</p>
                      <p><strong>Faaliyet Konusu:</strong> Araç kiralama ve transfer hizmetleri</p>
                      <p><strong>Vergi No:</strong> 1234567890</p>
                      <p><strong>Ticaret Sicil No:</strong> 123456</p>
                      <p><strong>MERSİS No:</strong> 0123456789012345</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Kayıtlı Adres:</strong> Maslak, Büyükdere Cad. No:123 K:15 D:45, Sarıyer/İstanbul</p>
                      <p><strong>Telefon:</strong> 0850 123 45 67</p>
                      <p><strong>E-posta:</strong> info@premiumrent.com</p>
                      <p><strong>KVKK E-posta:</strong> kvkk@premiumrent.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kişisel Verilerin Hangi Amaçla İşleneceği */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-blue-600" />
                Kişisel Verilerin İşlenme Amaçları
              </h2>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Birincil İşleme Amaçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Araç kiralama sözleşmesi yapılması</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Transfer hizmetlerinin sunulması</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Müşteri kimlik doğrulaması</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Ödeme işlemlerinin gerçekleştirilmesi</span>
                      </li>
                    </ul>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Müşteri destek hizmetleri</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Güvenlik ve dolandırıcılık önleme</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">Yasal yükümlülüklerin yerine getirilmesi</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">İstatistiksel analiz ve raporlama</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">İkincil İşleme Amaçları</h3>
                  <div className="bg-amber-50 p-4 rounded-lg mb-4">
                    <p className="text-amber-800 text-sm">
                      <strong>Not:</strong> Aşağıdaki amaçlar için açık rızanız alınacaktır.
                    </p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Pazarlama faaliyetleri ve kampanya bilgilendirmeleri</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Kişiselleştirilmiş ürün ve hizmet önerileri</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Müşteri memnuniyeti araştırmaları</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Profilleme ve hedefleme çalışmaları</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Kişisel Verilerin Toplanma Yöntemi */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Toplama Yöntemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Doğrudan Toplama</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Web sitesi üzerinden online rezervasyon</li>
                        <li>• Telefonla rezervasyon</li>
                        <li>• Ofis ziyareti ile kişisel başvuru</li>
                        <li>• Mobil uygulama kullanımı</li>
                        <li>• Sözleşme imzalama süreçleri</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dolaylı Toplama</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Çerezler ve web analitik araçları</li>
                        <li>• Sosyal medya etkileşimleri</li>
                        <li>• Üçüncü taraf entegrasyonları</li>
                        <li>• Kamera kayıtları (güvenlik)</li>
                        <li>• Çağrı merkezi kayıtları</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Hukuki Sebepler</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Veri Kategorisi</th>
                          <th className="text-left py-2">Hukuki Sebep</th>
                          <th className="text-left py-2">KVKK Madde</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Kimlik/İletişim</td>
                          <td className="py-2">Sözleşme kurulması ve ifası</td>
                          <td className="py-2">5/2-c</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Finansal Bilgiler</td>
                          <td className="py-2">Hukuki yükümlülük</td>
                          <td className="py-2">5/2-d</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Pazarlama</td>
                          <td className="py-2">Açık rıza</td>
                          <td className="py-2">5/1</td>
                        </tr>
                        <tr>
                          <td className="py-2">Güvenlik</td>
                          <td className="py-2">Meşru menfaat</td>
                          <td className="py-2">5/2-f</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kişisel Verilerin Aktarımı</h2>
              
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-900 mb-3">Yurt İçi Aktarımlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Kamu Kurum ve Kuruluşları</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Vergi Dairesi (vergi mevzuatı gereği)</li>
                        <li>• Emniyet Müdürlüğü (trafik mevzuatı)</li>
                        <li>• Adli makamlar (yasal talep)</li>
                        <li>• BDDK/SPK (finansal denetim)</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Özel Şirketler</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Sigorta şirketleri (hasar süreçleri)</li>
                        <li>• Ödeme kuruluşları (PayTR)</li>
                        <li>• Bilgi işlem hizmeti sağlayıcıları</li>
                        <li>• Muhasebe ve hukuk firmaları</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Yurt Dışı Aktarımlar</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Google LLC (ABD)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Hizmet:</span> Google Maps, Analytics
                        </div>
                        <div>
                          <span className="font-medium">Güvence:</span> Privacy Shield
                        </div>
                        <div>
                          <span className="font-medium">Veri:</span> Konum, kullanım bilgileri
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Firebase (Google Cloud)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Hizmet:</span> Uygulama altyapısı
                        </div>
                        <div>
                          <span className="font-medium">Güvence:</span> SCCs + DPA
                        </div>
                        <div>
                          <span className="font-medium">Veri:</span> Kullanıcı profilleri
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kişisel Veri Saklama Süreleri */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kişisel Veri Saklama ve İmha Süreleri</h2>
              
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left">Veri Kategorisi</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Saklama Süresi</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Yasal Dayanak</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">İmha Yöntemi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Kimlik Bilgileri</td>
                        <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">Ticaret Kanunu m.64</td>
                        <td className="border border-gray-300 px-4 py-2">Güvenli silme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Mali/Finansal Bilgiler</td>
                        <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">VUK m.253</td>
                        <td className="border border-gray-300 px-4 py-2">Güvenli silme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">İletişim Bilgileri</td>
                        <td className="border border-gray-300 px-4 py-2">5 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">KVKK m.7</td>
                        <td className="border border-gray-300 px-4 py-2">Sistem silme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Sözleşme Bilgileri</td>
                        <td className="border border-gray-300 px-4 py-2">10 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">TBK m.146</td>
                        <td className="border border-gray-300 px-4 py-2">Arşivleme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Web Kullanım Bilgileri</td>
                        <td className="border border-gray-300 px-4 py-2">2 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">ETK m.5</td>
                        <td className="border border-gray-300 px-4 py-2">Otomatik silme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Pazarlama Rızaları</td>
                        <td className="border border-gray-300 px-4 py-2">Rıza geri alınana kadar</td>
                        <td className="border border-gray-300 px-4 py-2">KVKK m.5/1</td>
                        <td className="border border-gray-300 px-4 py-2">Derhal silme</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Güvenlik Kayıtları</td>
                        <td className="border border-gray-300 px-4 py-2">1 yıl</td>
                        <td className="border border-gray-300 px-4 py-2">Güvenlik amacı</td>
                        <td className="border border-gray-300 px-4 py-2">Şifrelenmiş arşiv</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="font-semibold text-red-900 mb-3">Özel Durumlar</h3>
                  <ul className="space-y-2 text-red-800 text-sm">
                    <li>• Devam eden dava süreçlerinde ilgili veriler dava sonuçlanana kadar saklanır</li>
                    <li>• Kamu kurumları tarafından talep edilen veriler yasal süre boyunca muhafaza edilir</li>
                    <li>• Dolandırıcılık şüphesi bulunan işlemlerde güvenlik amaçlı ek saklama süresi uygulanabilir</li>
                    <li>• Açık rızaya dayalı işlemlerde rıza geri alındığında veriler derhal silinir</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Veri Sahibinin Hakları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-blue-600" />
                Veri Sahibinin Hakları
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-900 mb-4">KVKK Kapsamındaki Haklarınız</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Temel Haklar</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Kişisel verilerinin işlenip işlenmediğini öğrenme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Yurt içinde/dışında aktarıldığı üçüncü kişileri öğrenme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Eksik/yanlış işlenmiş verilerin düzeltilmesini isteme</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">İleri Düzey Haklar</h4>
                      <ul className="space-y-2 text-gray-700 text-sm">
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>KVKK'da öngörülen şartlarda silinmesini/yok edilmesini isteme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Düzeltme/silme işlemlerinin aktarıldığı taraflara bildirilmesini isteme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Otomatik sistemle analiz edilmesi nedeniyle aleyhine sonuç doğurmasına itiraz etme</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Kanuna aykırı işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Hakların Kullanım Sınırları</h3>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm mb-3">
                      <strong>Dikkat:</strong> Aşağıdaki durumlarda hakların kullanımı sınırlanabilir:
                    </p>
                    <ul className="space-y-1 text-amber-700 text-sm">
                      <li>• Millî savunma, millî güvenlik, kamu güvenliği ile ilgili durumlarda</li>
                      <li>• Suç işlenmesinin önlenmesi veya suç soruşturması kapsamında</li>
                      <li>• Kişinin kendisi tarafından alenileştirilmiş veriler için</li>
                      <li>• Yasal yükümlülüklerimizin yerine getirilmesi kapsamındaki veriler için</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Başvuru Yöntemleri */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">KVKK Hakları Başvuru Prosedürü</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Başvuru Kanalları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">E-posta</h4>
                      <p className="text-sm text-gray-700">kvkk@premiumrent.com</p>
                      <p className="text-xs text-gray-500 mt-1">7/24 otomatik kayıt</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">Telefon</h4>
                      <p className="text-sm text-gray-700">0850 123 45 67</p>
                      <p className="text-xs text-gray-500 mt-1">Dahili: 444 (KVKK)</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-medium text-gray-900 mb-2">Posta</h4>
                      <p className="text-sm text-gray-700">Kayıtlı adresimize</p>
                      <p className="text-xs text-gray-500 mt-1">KVKK Birimi'ne</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Başvuru Şartları</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Gerekli Bilgiler</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Ad, soyad ve imza</li>
                        <li>• T.C. kimlik numarası</li>
                        <li>• İletişim bilgileri (adres, e-posta, telefon)</li>
                        <li>• Talep konusu ve gerekçesi</li>
                        <li>• Kimlik belgesi fotokopisi</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">İşlem Süreçleri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-sm">
                        <div>
                          <div className="font-semibold text-blue-600">1. Başvuru</div>
                          <div className="text-gray-600">Talep iletimi</div>
                        </div>
                        <div>
                          <div className="font-semibold text-orange-600">2. İnceleme</div>
                          <div className="text-gray-600">Kimlik doğrulama</div>
                        </div>
                        <div>
                          <div className="font-semibold text-purple-600">3. Değerlendirme</div>
                          <div className="text-gray-600">Hukuki analiz</div>
                        </div>
                        <div>
                          <div className="font-semibold text-green-600">4. Cevap</div>
                          <div className="text-gray-600">30 gün içinde</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-green-900 mb-3">Cevaplama Süreleri ve Ücretler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Süre Tablosu</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• <strong>Basit Talepler:</strong> 15 gün</li>
                        <li>• <strong>Karmaşık Talepler:</strong> 30 gün</li>
                        <li>• <strong>Teknik Talepler:</strong> 30 gün + 30 gün uzatma</li>
                        <li>• <strong>Üçüncü Taraf Gerektiren:</strong> 60 gün</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Ücret Bilgileri</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• <strong>Başvuru:</strong> Ücretsiz</li>
                        <li>• <strong>Bilgi Edinme:</strong> Ücretsiz</li>
                        <li>• <strong>Belge Kopyası:</strong> Makul ücret</li>
                        <li>• <strong>CD/DVD:</strong> 25 TL</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Veri Güvenliği */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veri Güvenliği Önlemleri</h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="font-semibold text-purple-900 mb-3">Teknik Güvenlik Önlemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Erişim Kontrolü</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Çok faktörlü kimlik doğrulama</li>
                        <li>• Rol tabanlı erişim yetkilendirmesi</li>
                        <li>• Düzenli erişim denetimleri</li>
                        <li>• Güçlü parola politikaları</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Veri Koruma</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 256-bit SSL/TLS şifreleme</li>
                        <li>• Veritabanı şifreleme</li>
                        <li>• Güvenli yedekleme sistemleri</li>
                        <li>• DLP (Data Loss Prevention)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-900 mb-3">İdari Güvenlik Önlemleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Personel Güvenliği</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• KVKK farkındalık eğitimleri</li>
                        <li>• Güvenlik taahhütnameleri</li>
                        <li>• Düzenli güvenlik denetimleri</li>
                        <li>• Gizlilik sözleşmeleri</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Süreç Güvenliği</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Güvenlik politika ve prosedürleri</li>
                        <li>• Olay müdahale planları</li>
                        <li>• Düzenli risk değerlendirmeleri</li>
                        <li>• Sürekli güvenlik izleme</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Veri İhlali Prosedürü</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-800 text-sm mb-3">
                      Herhangi bir veri güvenliği ihlali durumunda:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-red-900">72 Saat</div>
                        <div className="text-xs text-red-700">KVKK Kurumu'na bildirim</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-900">Derhal</div>
                        <div className="text-xs text-red-700">Etkilenen kişilere bildirim</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-900">Sürekli</div>
                        <div className="text-xs text-red-700">İyileştirme çalışmaları</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* İletişim ve Güncellemeler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İletişim ve Güncellemeler</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">KVKK İletişim Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Veri Sorumlusu</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><strong>Şirket:</strong> PremiumRent Araç Kiralama A.Ş.</p>
                        <p><strong>KVKK Sorumlusu:</strong> Av. Mehmet Yılmaz</p>
                        <p><strong>E-posta:</strong> kvkk@premiumrent.com</p>
                        <p><strong>Telefon:</strong> 0850 123 45 67 (dahili: 444)</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Veri Koruma Kurulu</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><strong>Web:</strong> www.kvkk.gov.tr</p>
                        <p><strong>E-posta:</strong> bilgi@kvkk.gov.tr</p>
                        <p><strong>Telefon:</strong> 0312 216 50 50</p>
                        <p><strong>Adres:</strong> Ankara/Çankaya</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Politika Güncellemeleri</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• Bu aydınlatma metni mevzuat değişiklikleri doğrultusunda güncellenebilir</li>
                      <li>• Güncellemeler web sitemizde yayınlanır ve kayıtlı e-posta adreslerinize bildirilir</li>
                      <li>• Önemli değişiklikler için ayrıca onayınız talep edilebilir</li>
                      <li>• Güncel versiyonu takip etmek sizin sorumluluğunuzdadır</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Bu KVKK Aydınlatma Metni <strong>15 Ocak 2024</strong> tarihinde güncellenmiş olup, 
                      <strong>16 Ocak 2024</strong> tarihinde yürürlüğe girmiştir.
                    </p>
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