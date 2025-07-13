// sbstravel-main/src/utils/pricing.ts

import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { calculateDistance } from './googleMaps'; // calculateDistance fonksiyonunun projenizde olduğunu varsayıyoruz

// Firestore veritabanı bağlantısı
const db = getFirestore();

// Ekstra servis ücretlerini ve son alınma zamanını önbelleğe almak için değişkenler
let extraServicesCache: { [key: string]: number } = {};
let extraServicesLastFetched = 0;

/**
 * Firestore'dan ekstra servis ücretlerini çeker ve 5 dakika boyunca önbellekte tutar.
 */
async function getExtraServices(): Promise<{ [key: string]: number }> {
  const now = Date.now();
  // Önbellek 5 dakikadan daha yeniyse ve boş değilse, önbellekten dön
  if (now - extraServicesLastFetched < 300000 && Object.keys(extraServicesCache).length > 0) {
    return extraServicesCache;
  }

  try {
    const servicesDocRef = doc(db, 'config', 'extraServices');
    const servicesDocSnap = await getDoc(servicesDocRef);

    if (servicesDocSnap.exists()) {
      const servicesData = servicesDocSnap.data();
      // Firestore'dan gelen veriyi { serviceKey: price } formatına dönüştür
      extraServicesCache = Object.entries(servicesData).reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null && typeof value.price === 'number') {
          acc[key] = value.price;
        }
        return acc;
      }, {} as { [key: string]: number });

      extraServicesLastFetched = now; // Son alınma zamanını güncelle
      console.log('Fetched extra services from Firestore:', extraServicesCache);
      return extraServicesCache;
    } else {
      console.error("Ekstra servis ayarları Firestore'da bulunamadı.");
      return {};
    }
  } catch (error) {
    console.error("Ekstra servisler alınırken hata oluştu:", error);
    return {}; // Hata durumunda boş nesne dön
  }
}

/**
 * Verilen parametrelere göre transfer ücretini hesaplar.
 */
export async function calculatePrice(params: {
  destination: string | { name: string; [key: string]: any }; // Hedefin string veya nesne olabileceğini belirtir
  vehicleType: string;
  passengerCount: number;
  luggageCount: number;
  extraServices: string[];
  transferType: string;
}): Promise<{
  distance: number;
  basePrice: number;
  servicesPrice: number;
  total: number;
  totalPrice: number;
}> {
  console.log('=== PRICE CALCULATION STARTED ===');
  console.log('Destination:', params.destination);
  console.log('Vehicle type:', params.vehicleType);
  console.log('Transfer type:', params.transferType);

  // Gerekli alanların kontrolü
  if (!params.destination || !params.vehicleType) {
    console.log('Fiyat hesaplama atlandı - gerekli alanlar eksik');
    const missingFields: { [key: string]: any } = {};
    if (!params.destination) missingFields.destination = params.destination;
    if (!params.vehicleType) missingFields.vehicleType = params.vehicleType;
    console.log('Eksik alan kontrolü:', missingFields);
    throw new Error("Gerekli alanlar eksik: Varış noktası ve araç tipi belirtilmelidir.");
  }

  console.log('Fiyat hesaplama parametreleri:', params);

  // =================================================================
  // *** HATA DÜZELTMESİ BURADA ***
  // `destination` parametresini normalleştiriyoruz.
  // Bu parametre, bir metin (örneğin "Kemer") veya Google Places'ten
  // gelen bir konum nesnesi ({ name: "Kemer", ... }) olabilir.
  // `destinationName` değişkeninin her zaman metin olmasını sağlıyoruz.
  const destinationName = typeof params.destination === 'string'
    ? params.destination
    : params.destination.name;
  // *** HATA DÜZELTMESİ SONU ***
  // =================================================================

  // Araç bilgilerini Firestore'dan al
  const vehicleDocRef = doc(db, 'vehicles', params.vehicleType);
  const vehicleSnap = await getDoc(vehicleDocRef);

  if (!vehicleSnap.exists()) {
    console.error("Araç bulunamadı!");
    throw new Error('Seçilen araç veritabanında bulunamadı!');
  }

  const vehicleData = vehicleSnap.data();
  const pricePerKm = vehicleData.pricePerKm;

  if (typeof pricePerKm !== 'number') {
      console.error('Geçersiz pricePerKm değeri:', pricePerKm);
      throw new Error('Araç için geçerli bir kilometre ücreti bulunamadı.');
  }
  console.log(`Kullanılan araç km ücreti: ${pricePerKm}`);

  // Başlangıç noktasını sabit olarak belirliyoruz (Örn: Antalya Havalimanı)
  const origin = { lat: 36.8987, lng: 30.8005 };

  // Mesafeyi hesapla
  console.log(`Rota hesaplanıyor:`, origin, `-> ${destinationName}`);
  const distanceInKm = await calculateDistance(origin, destinationName);
  console.log(`Google Maps mesafesi: ${distanceInKm}km`);

  // Temel ücreti hesapla (mesafe * km ücreti)
  const basePrice = distanceInKm * pricePerKm;

  // Ekstra servislerin toplam ücretini hesapla
  const allExtraServices = await getExtraServices();
  const servicesPrice = params.extraServices.reduce((total, serviceKey) => {
    return total + (allExtraServices[serviceKey] || 0);
  }, 0);

  // Toplam ücreti hesapla
  const total = basePrice + servicesPrice;

  const result = {
    distance: distanceInKm,
    basePrice,
    servicesPrice,
    total,
    totalPrice: total, // Bazı API'ler bu alanı bekleyebilir diye ekliyoruz
  };

  console.log('Fiyat hesaplama sonucu:', result);
  console.log('✅ Fiyat hesaplama başarılı:', result);
  console.log('=== PRICE CALCULATION ENDED ===');

  return result;
}
