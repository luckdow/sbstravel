import React from 'react';
import { Calendar, FileText, AlertCircle, Scale, CreditCard } from 'lucide-react';
import { LegalPageMeta } from '../../types/security';

const pageMetadata: LegalPageMeta = {
  title: 'Kullanım Şartları',
  lastUpdated: new Date('2024-01-15'),
  version: '2.1'
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-bold mb-4">{pageMetadata.title}</h1>
            <p className="text-xl opacity-90">
              Hizmetlerimizi kullanırken uymanız gereken şart ve koşullar
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
            
            {/* Genel Hükümler */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Scale className="h-6 w-6 mr-3 text-blue-600" />
                Genel Hükümler
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Bu Kullanım Şartları, PremiumRent Araç Kiralama A.Ş. ("Şirket") tarafından sunulan 
                  araç kiralama ve transfer hizmetlerinin kullanım koşullarını düzenler.
                </p>
                <p className="mb-4">
                  Web sitemizi kullanarak veya hizmetlerimizden yararlanarak bu şartları kabul etmiş sayılırsınız. 
                  Bu şartları kabul etmiyorsanız, lütfen hizmetlerimizi kullanmayın.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium">Önemli Uyarı</p>
                      <p className="text-amber-700 text-sm mt-1">
                        Bu şartlar zaman zaman güncellenebilir. Güncel versiyonu düzenli olarak kontrol ediniz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Hizmet Kapsamı */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hizmet Kapsamı</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Araç Kiralama Hizmetleri</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Kısa ve uzun dönem araç kiralama</li>
                    <li>• Şoförlü/şoförsüz araç hizmetleri</li>
                    <li>• Farklı kategorilerde araç seçenekleri</li>
                    <li>• 7/24 yol yardım hizmetleri</li>
                  </ul>
                </div>
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Transfer Hizmetleri</h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li>• Havalimanı transfer hizmetleri</li>
                    <li>• Şehir içi ve şehirlerarası transferler</li>
                    <li>• VIP transfer hizmetleri</li>
                    <li>• Grup transfer organizasyonları</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Rezervasyon Şartları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Şartları</h2>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Genel Rezervasyon Kuralları</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Rezervasyonlar minimum 2 saat önceden yapılmalıdır</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Geçerli ehliyet ve kimlik belgesi zorunludur</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Minimum yaş sınırı 21, ehliyet yaşı minimum 2 yıldır</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Rezervasyon onayı e-posta ve SMS ile bildirilir</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rezervasyon Değişiklikleri</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Değişiklik Zamanı</th>
                          <th className="text-left py-2">Değişiklik Ücreti</th>
                          <th className="text-left py-2">Koşullar</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b border-gray-100">
                          <td className="py-2">24 saat öncesi</td>
                          <td className="py-2 text-green-600">Ücretsiz</td>
                          <td className="py-2">Müsaitlik durumuna göre</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">2-24 saat arası</td>
                          <td className="py-2 text-orange-600">%25 değişiklik ücreti</td>
                          <td className="py-2">Sınırlı seçenekler</td>
                        </tr>
                        <tr>
                          <td className="py-2">2 saat öncesi</td>
                          <td className="py-2 text-red-600">Değişiklik yapılamaz</td>
                          <td className="py-2">İptal şartları geçerli</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* İptal Politikası */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">İptal Politikası</h2>
              
              <div className="bg-red-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-red-900 mb-3">İptal Şartları</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">48+ Saat</div>
                    <div className="text-sm text-gray-700">%100 İade</div>
                    <div className="text-xs text-gray-500">Tam iade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">24-48 Saat</div>
                    <div className="text-sm text-gray-700">%50 İade</div>
                    <div className="text-xs text-gray-500">Yarı iade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">0-24 Saat</div>
                    <div className="text-sm text-gray-700">İade Yok</div>
                    <div className="text-xs text-gray-500">Ücretsiz iptal yok</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Force Majeure (Mücbir Sebep)</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Doğal afetler, savaş, pandemi gibi kontrolümüz dışındaki durumlarda tam iade yapılır.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Hastalık/Kaza</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Tıbbi rapor ile belgelenen durumlar için özel iptal koşulları uygulanır.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-gray-900">Araç Arızası</h4>
                  <p className="text-gray-700 text-sm mt-1">
                    Bizim kaynaklı teknik sorunlarda tam iade veya alternatif araç sağlanır.
                  </p>
                </div>
              </div>
            </section>

            {/* Ödeme Şartları */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                Ödeme ve Faturalama
              </h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Kabul Edilen Ödeme Yöntemleri</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <div className="text-sm font-medium">Kredi Kartı</div>
                      </div>
                      <div className="text-xs text-gray-600">Visa, MasterCard</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <div className="text-sm font-medium">Banka Kartı</div>
                      </div>
                      <div className="text-xs text-gray-600">Debit kartlar</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <div className="text-sm font-medium">Havale/EFT</div>
                      </div>
                      <div className="text-xs text-gray-600">Kurumsal müşteri</div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-lg p-3 mb-2">
                        <div className="text-sm font-medium">Nakit</div>
                      </div>
                      <div className="text-xs text-gray-600">Ofiste ödeme</div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ödeme Zamanları</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>Rezervasyon:</strong> %30 kapora alınır</li>
                    <li>• <strong>Araç Teslimi:</strong> Kalan tutar ve depozit alınır</li>
                    <li>• <strong>Araç İadesi:</strong> Depozit iadesinde hasar kontrolü yapılır</li>
                    <li>• <strong>Kurumsal:</strong> Faturalandırma sonrası 30 gün vade</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Depozit ve Teminat</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Ekonomi Sınıfı</span>
                      <span className="font-semibold text-gray-900">1.500 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Konfor Sınıfı</span>
                      <span className="font-semibold text-gray-900">2.500 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Lüks Sınıfı</span>
                      <span className="font-semibold text-gray-900">5.000 TL</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Premium Sınıfı</span>
                      <span className="font-semibold text-gray-900">10.000 TL</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sorumluluklar */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sorumluluklar ve Yükümlülükler</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">Müşteri Sorumlulukları</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Araç teslim alırken eksik/hasar tespiti</li>
                    <li>• Trafik kurallarına uygun araç kullanımı</li>
                    <li>• Araç bakım ve temizlik sorumluluğu</li>
                    <li>• Yakıt seviyesini koruma</li>
                    <li>• Sigara içilmemesi (100 TL ceza)</li>
                    <li>• Evcil hayvan taşıma yasağı</li>
                    <li>• Kaza/hasar durumunda derhal bildirim</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">Şirket Sorumlulukları</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Temiz ve bakımlı araç teslimi</li>
                    <li>• Yasal evrakların tam olması</li>
                    <li>• Sigorta kapsamının geçerliliği</li>
                    <li>• 7/24 yol yardım hizmeti</li>
                    <li>• Acil durum müdahale ekibi</li>
                    <li>• Rezervasyon onayı bildirimi</li>
                    <li>• Gizlilik ve veri güvenliği</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-red-50 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-3">Sorumluluk Sınırları</h3>
                <ul className="space-y-2 text-red-800 text-sm">
                  <li>• Müşteri kusuru olan hasarlarda tam sorumluluk müşteriye aittir</li>
                  <li>• Araç içinde unutulan eşyalardan sorumluluk kabul edilmez</li>
                  <li>• Trafik cezaları ve yasal yaptırımlar müşteri sorumluluğundadır</li>
                  <li>• Yakıt maliyetleri müşteri tarafından karşılanır</li>
                </ul>
              </div>
            </section>

            {/* Kaza ve Hasar */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Kaza ve Hasar Prosedürleri</h2>
              
              <div className="space-y-6">
                <div className="bg-orange-50 rounded-xl p-6">
                  <h3 className="font-semibold text-orange-900 mb-3">Kaza Anında Yapılması Gerekenler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Acil Durum Adımları</h4>
                      <ol className="space-y-1 text-sm text-gray-700">
                        <li>1. Güvenlik önlemlerini alın</li>
                        <li>2. Yaralı varsa 112'yi arayın</li>
                        <li>3. Polis merkezini bilgilendirin</li>
                        <li>4. Foto-belgeleme yapın</li>
                        <li>5. Şirketimizi derhal arayın</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">İletişim Bilgileri</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><strong>Acil Hat:</strong> 0850 123 45 67</p>
                        <p><strong>WhatsApp:</strong> 0533 123 45 67</p>
                        <p><strong>E-posta:</strong> acil@premiumrent.com</p>
                        <p><strong>7/24 Yol Yardım:</strong> 444 12 34</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Hasar Bedeli Hesaplaması</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Hasar Türü</th>
                          <th className="text-left py-2">Müşteri Katılımı</th>
                          <th className="text-left py-2">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Kasko Dahili</td>
                          <td className="py-2 text-blue-600">Muafiyet tutarı</td>
                          <td className="py-2">Sigorta kapsamında</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">Kasko Dışı</td>
                          <td className="py-2 text-orange-600">%100</td>
                          <td className="py-2">Cam, lastik, jant</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">İç Aksam</td>
                          <td className="py-2 text-red-600">%100</td>
                          <td className="py-2">Müşteri kusuru</td>
                        </tr>
                        <tr>
                          <td className="py-2">Total Hasar</td>
                          <td className="py-2 text-purple-600">Depozit + Fark</td>
                          <td className="py-2">Araç değerinin tamamı</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Uyuşmazlık Çözümü */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Uyuşmazlık Çözümü</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Alternatif Çözüm Yolları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                      <h4 className="font-medium text-gray-900">Müşteri Hizmetleri</h4>
                      <p className="text-sm text-gray-600 mt-1">İlk başvuru noktası</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                      <h4 className="font-medium text-gray-900">Arabuluculuk</h4>
                      <p className="text-sm text-gray-600 mt-1">Tüketici hakem heyeti</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                      <h4 className="font-medium text-gray-900">Yasal Süreç</h4>
                      <p className="text-sm text-gray-600 mt-1">Mahkeme başvurusu</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Yetki ve Kanun</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• İstanbul Mahkemeleri yetkilidir</li>
                    <li>• Türk Hukuku uygulanır</li>
                    <li>• Tüketici Hukuku korumaları geçerlidir</li>
                    <li>• Elektronik İmza Kanunu kapsamında dijital imzalar geçerlidir</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Son Hükümler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Son Hükümler</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li>• Bu şartlar, yürürlükteki mevzuat çerçevesinde hazırlanmıştır</li>
                  <li>• Şartların herhangi bir maddesinin geçersizliği, diğer maddelerin geçerliliğini etkilemez</li>
                  <li>• Şirket, bu şartları önceden bildirimde bulunarak değiştirebilir</li>
                  <li>• Güncel şartlar web sitesinde yayınlanır ve yürürlüğe girer</li>
                  <li>• Bu döküman 15 Ocak 2024 tarihinde son güncellenmiştir</li>
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Sorularınız için:</p>
                    <div className="flex justify-center space-x-6 text-sm">
                      <span><strong>E-posta:</strong> legal@premiumrent.com</span>
                      <span><strong>Telefon:</strong> 0850 123 45 67</span>
                    </div>
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