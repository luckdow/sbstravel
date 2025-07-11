import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader2, Star, Clock } from 'lucide-react';
import { googleMapsService } from '../../lib/google-maps';
import { LocationData } from '../../types';

interface LocationSearchProps {
  value: LocationData | null;
  onChange: (value: LocationData) => void;
  placeholder?: string;
  label?: string;
  showRecentSearches?: boolean;
}

interface PopularLocation extends LocationData {
  category: 'hotel' | 'district' | 'attraction';
  description?: string;
  rating?: number;
}

export default function LocationSearch({ 
  value, 
  onChange, 
  placeholder, 
  label,
  showRecentSearches = true 
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<LocationData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced popular destinations with categories and ratings
  const popularDestinations: PopularLocation[] = [
    { 
      name: 'Kemer', 
      lat: 36.6021, 
      lng: 30.5594, 
      category: 'district',
      description: 'Tatil köyü ve plajlar',
      rating: 4.5
    },
    { 
      name: 'Belek', 
      lat: 36.8625, 
      lng: 31.0556, 
      category: 'district',
      description: 'Golf ve lüks oteller',
      rating: 4.7
    },
    { 
      name: 'Side', 
      lat: 36.7673, 
      lng: 31.3890, 
      category: 'district',
      description: 'Antik şehir ve plajlar',
      rating: 4.6
    },
    { 
      name: 'Alanya', 
      lat: 36.5444, 
      lng: 32.0000, 
      category: 'district',
      description: 'Kale ve plajlar',
      rating: 4.4
    },
    { 
      name: 'Kaş', 
      lat: 36.2021, 
      lng: 29.6417, 
      category: 'district',
      description: 'Butik otel ve diving',
      rating: 4.8
    },
    { 
      name: 'Kalkan', 
      lat: 36.2667, 
      lng: 29.4167, 
      category: 'district',
      description: 'Lüks villa ve restoran',
      rating: 4.7
    },
    { 
      name: 'Olympos', 
      lat: 36.4000, 
      lng: 30.4667, 
      category: 'attraction',
      description: 'Doğa ve antik kalıntılar',
      rating: 4.5
    },
    { 
      name: 'Çıralı', 
      lat: 36.4167, 
      lng: 30.4833, 
      category: 'district',
      description: 'Sakin plaj ve doğa',
      rating: 4.6
    },
    { 
      name: 'Manavgat', 
      lat: 36.7869, 
      lng: 31.4444, 
      category: 'district',
      description: 'Şelale ve nehir',
      rating: 4.3
    },
    { 
      name: 'Serik', 
      lat: 36.9167, 
      lng: 31.1000, 
      category: 'district',
      description: 'Antalya merkeze yakın',
      rating: 4.2
    }
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('ayt_recent_searches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    const searchPlaces = async () => {
      if (value?.name && value.name.length > 2) {
        setIsLoading(true);
        try {
          // First try to find in popular destinations
          const popularMatches = popularDestinations.filter(dest => 
            dest.name.toLowerCase().includes(value.name.toLowerCase())
          );

          // Then search with Google Places (simulated for now)
          const mockResults = [
            {
              name: `${value.name} - Otel`,
              formatted_address: `${value.name}, Antalya, Türkiye`,
              geometry: {
                location: {
                  lat: () => 36.8969 + Math.random() * 0.5,
                  lng: () => 30.7133 + Math.random() * 0.5
                }
              }
            },
            {
              name: `${value.name} Resort`,
              formatted_address: `${value.name} Resort, Antalya, Türkiye`,
              geometry: {
                location: {
                  lat: () => 36.8969 + Math.random() * 0.5,
                  lng: () => 30.7133 + Math.random() * 0.5
                }
              }
            }
          ];

          setSuggestions([...popularMatches, ...mockResults].slice(0, 8));
        } catch (error) {
          console.error('Error searching places:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(searchPlaces, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [value?.name]);

  const saveRecentSearch = (location: LocationData) => {
    const newRecentSearches = [
      location,
      ...recentSearches.filter(item => item.name !== location.name)
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(newRecentSearches);
    localStorage.setItem('ayt_recent_searches', JSON.stringify(newRecentSearches));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange({ name: newValue, lat: 0, lng: 0 });
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: google.maps.places.PlaceResult | LocationData | PopularLocation) => {
    let locationData: LocationData;
    
    if ('category' in suggestion) {
      // Popular destination
      locationData = {
        name: suggestion.name,
        lat: suggestion.lat,
        lng: suggestion.lng,
        formatted_address: `${suggestion.name}, Antalya, Türkiye`
      };
    } else if ('lat' in suggestion) {
      // Recent search
      locationData = suggestion;
    } else {
      // Google Places result
      const place = suggestion as google.maps.places.PlaceResult;
      locationData = {
        name: place.name || place.formatted_address || '',
        formatted_address: place.formatted_address,
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0
      };
    }
    
    onChange(locationData);
    saveRecentSearch(locationData);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearInput = () => {
    onChange({ name: '', lat: 0, lng: 0 });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <MapPin className="h-4 w-4 inline mr-2 text-blue-600" />
          {label}
        </label>
      )}
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value?.name || ''}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || "Otel adı veya bölge girin..."}
          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        {value?.name && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {/* Recent searches */}
          {showRecentSearches && recentSearches.length > 0 && (!value?.name || value.name.length === 0) && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Son Aramalar
              </h4>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{search.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular destinations when no input */}
          {(!value?.name || value.name.length === 0) && (
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Popüler Destinasyonlar
              </h4>
              <div className="space-y-2">
                {popularDestinations.slice(0, 6).map((destination, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(destination)}
                    className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Navigation className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-800">{destination.name}</div>
                          <div className="text-sm text-gray-500">{destination.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{destination.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {suggestions.length > 0 && value?.name && value.name.length > 2 && (
            <div className="p-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 px-2">Arama Sonuçları</h4>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {'name' in suggestion ? suggestion.name : (suggestion as any).name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {'formatted_address' in suggestion 
                          ? suggestion.formatted_address 
                          : `${'name' in suggestion ? suggestion.name : ''}, Antalya, Türkiye`
                        }
                      </div>
                      {'category' in suggestion && (
                        <div className="text-xs text-blue-600 mt-1 capitalize">
                          {suggestion.category === 'hotel' ? 'Otel' : 
                           suggestion.category === 'district' ? 'Bölge' : 'Cazibe Merkezi'}
                        </div>
                      )}
                    </div>
                    {'rating' in suggestion && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500">{suggestion.rating}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {value?.name && value.name.length > 2 && suggestions.length === 0 && !isLoading && (
            <div className="p-6 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">Sonuç bulunamadı</p>
              <p className="text-sm">Farklı bir arama terimi deneyin</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}