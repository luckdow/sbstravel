import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';
import { googleMapsService } from '../../lib/google-maps';

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function LocationSearch({ value, onChange, placeholder, label }: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular destinations in Antalya
  const popularDestinations = [
    'Kemer',
    'Belek',
    'Side',
    'Alanya',
    'Kaş',
    'Kalkan',
    'Olympos',
    'Çıralı',
    'Manavgat',
    'Serik'
  ];

  useEffect(() => {
    const searchPlaces = async () => {
      if (value.length > 2) {
        setIsLoading(true);
        try {
          const results = await googleMapsService.searchPlaces(value);
          setSuggestions(results.slice(0, 5)); // Limit to 5 results
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
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: google.maps.places.PlaceResult | string) => {
    const locationString = typeof suggestion === 'string' 
      ? suggestion 
      : suggestion.formatted_address || suggestion.name || '';
    onChange(locationString);
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
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder || "Otel adı veya bölge girin..."}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (value.length > 0 || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {/* Popular destinations when no input */}
          {value.length === 0 && (
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Popüler Destinasyonlar</h4>
              <div className="space-y-2">
                {popularDestinations.map((destination, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(destination)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span>{destination}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search results */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium text-gray-800">{suggestion.name}</div>
                      <div className="text-sm text-gray-600">{suggestion.formatted_address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {value.length > 2 && suggestions.length === 0 && !isLoading && (
            <div className="p-4 text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>Sonuç bulunamadı</p>
              <p className="text-sm">Farklı bir arama terimi deneyin</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}