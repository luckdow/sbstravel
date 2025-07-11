import React, { useState } from 'react';
import CarCard from './CarCard';
import { Car, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

const cars = [
  {
    id: 1,
    name: "BMW 3 Series 2024",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lüks Sedan",
    price: 850,
    originalPrice: 950,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Otomatik",
      rating: 4.8,
      reviews: 124
    },
    popular: true,
    discount: 10,
    badges: ["Yeni Model", "Premium", "Navigasyon"]
  },
  {
    id: 2,
    name: "Audi A4 Quattro",
    image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lüks Sedan",
    price: 780,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Otomatik",
      rating: 4.7,
      reviews: 89
    },
    badges: ["AWD", "Deri Döşeme", "Sunroof"]
  },
  {
    id: 3,
    name: "Mercedes C-Class AMG",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Lüks Sedan",
    price: 920,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Otomatik",
      rating: 4.9,
      reviews: 156
    },
    badges: ["AMG Paket", "Premium Sound", "Adaptive Cruise"]
  },
  {
    id: 4,
    name: "Volkswagen Passat Elegance",
    image: "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Konfor",
    price: 450,
    originalPrice: 520,
    features: {
      passengers: 5,
      fuel: "Dizel",
      transmission: "Otomatik",
      rating: 4.5,
      reviews: 67
    },
    popular: true,
    discount: 15,
    badges: ["Ekonomik", "Geniş Bagaj", "LED Farlar"]
  },
  {
    id: 5,
    name: "Ford Focus Titanium",
    image: "https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Ekonomi",
    price: 320,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Manuel",
      rating: 4.3,
      reviews: 43
    },
    badges: ["Yakıt Tasarrufu", "Şehir İçi", "Kompakt"]
  },
  {
    id: 6,
    name: "Renault Megane GT Line",
    image: "https://images.pexels.com/photos/35967/mini-cooper-auto-model-vehicle.jpg?auto=compress&cs=tinysrgb&w=800",
    category: "Ekonomi",
    price: 280,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Manuel",
      rating: 4.2,
      reviews: 38
    },
    badges: ["Genç Sürücü", "Ekonomik", "Şehir Aracı"]
  },
  {
    id: 7,
    name: "Range Rover Evoque",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "SUV",
    price: 1200,
    features: {
      passengers: 5,
      fuel: "Benzin",
      transmission: "Otomatik",
      rating: 4.9,
      reviews: 92
    },
    badges: ["4x4", "Lüks İç Mekan", "Panoramik Tavan"]
  },
  {
    id: 8,
    name: "Tesla Model 3",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "Elektrikli",
    price: 650,
    features: {
      passengers: 5,
      fuel: "Elektrik",
      transmission: "Otomatik",
      rating: 4.8,
      reviews: 78
    },
    badges: ["Çevre Dostu", "Autopilot", "Süper Şarj"]
  }
];

export default function CarList() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState('price-low');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Tümü', 'Ekonomi', 'Konfor', 'Lüks Sedan', 'SUV', 'Elektrikli'];

  const filteredCars = cars
    .filter(car => {
      const matchesCategory = selectedCategory === 'Tümü' || car.category === selectedCategory;
      const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.features.rating - a.features.rating;
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const handleBooking = (carId: number) => {
    const car = cars.find(c => c.id === carId);
    alert(`${car?.name} için rezervasyon başlatılıyor...`);
  };

  return (
    <section id="cars" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Car className="h-4 w-4" />
            <span>Premium Araç Filosu</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lüks Araç Koleksiyonu
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Her bütçeye uygun, son model ve bakımlı araçlarımız arasından size en uygun olanı seçin. 
            Tüm araçlarımız kapsamlı sigorta ve 7/24 yol yardımı ile korunmaktadır.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Araç modeli ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filtreler</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="price-low">Fiyat (Düşük → Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek → Düşük)</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="popular">En Popüler</option>
              </select>

              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Fiyat Aralığı</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₺{priceRange[0]}</span>
                      <span>₺{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-gray-600">
            <span className="font-semibold text-gray-800">{filteredCars.length}</span> araç bulundu
          </div>
        </div>

        {/* Car Grid */}
        <div className={`grid gap-8 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredCars.map(car => (
            <CarCard key={car.id} car={car} onBook={handleBooking} />
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Araç bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
          </div>
        )}
      </div>
    </section>
  );
}