import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface SelectedPlace {
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
}

interface HotelAutocompleteProps {
  onPlaceSelected: (place: SelectedPlace) => void;
  placeholder?: string;
  label?: string;
}

export default function HotelAutocomplete({ 
  onPlaceSelected, 
  placeholder = "Otel adı veya adres girin...",
  label = "Varış Noktası"
}: HotelAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular destinations for fallback
  const popularDestinations = [
    { name: 'Kemer', lat: 36.6021, lng: 30.5594, formatted_address: 'Kemer, Antalya, Turkey' },
    { name: 'Belek', lat: 36.8625, lng: 31.0556, formatted_address: 'Belek, Antalya, Turkey' },
    { name: 'Side', lat: 36.7673, lng: 31.3890, formatted_address: 'Side, Antalya, Turkey' },
    { name: 'Alanya', lat: 36.5444, lng: 32.0000, formatted_address: 'Alanya, Antalya, Turkey' },
    { name: 'Kaş', lat: 36.2021, lng: 29.6417, formatted_address: 'Kaş, Antalya, Turkey' },
    { name: 'Kalkan', lat: 36.2667, lng: 29.4167, formatted_address: 'Kalkan, Antalya, Turkey' },
  ];

  const filteredDestinations = popularDestinations.filter(dest =>
    dest.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (destination: typeof popularDestinations[0]) => {
    setInputValue(destination.name);
    setShowSuggestions(false);
    onPlaceSelected(destination);
  };

  // Check if Google Maps API is available
  const hasGoogleMaps = typeof window !== 'undefined' && window.google?.maps;

  if (hasGoogleMaps) {
    // Use the full Google Maps Autocomplete component
    try {
      const { Autocomplete } = require('@react-google-maps/api');
      const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

      const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
        autocompleteInstance.setComponentRestrictions({ country: 'tr' });
        autocompleteInstance.setBounds(new google.maps.LatLngBounds(
          { lat: 36.0, lng: 29.0 },
          { lat: 37.5, lng: 32.0 }
        ));
        autocompleteInstance.setFields(['name', 'formatted_address', 'geometry']);
        autocompleteInstance.setOptions({
          types: ['establishment', 'geocode'],
          strictBounds: false
        });
        setAutocomplete(autocompleteInstance);
      };

      const onPlaceChanged = () => {
        if (autocomplete !== null) {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const selectedPlace: SelectedPlace = {
              name: place.name || place.formatted_address || '',
              formatted_address: place.formatted_address || '',
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            onPlaceSelected(selectedPlace);
            setInputValue(selectedPlace.name);
          }
        }
      };

      return (
        <div className="space-y-3">
          {label && (
            <label className="block text-sm font-semibold text-gray-700">
              <MapPin className="h-4 w-4 inline mr-2 text-blue-600" />
              {label}
            </label>
          )}
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </Autocomplete>
          </div>
        </div>
      );
    } catch (error) {
      console.warn('Google Maps Autocomplete not available, using fallback');
    }
  }

  // Fallback UI when Google Maps is not available
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          <MapPin className="h-4 w-4 inline mr-2 text-blue-600" />
          {label}
        </label>
      )}
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />

        {/* Fallback suggestions dropdown */}
        {showSuggestions && (inputValue.length > 0 || filteredDestinations.length > 0) && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 px-2">Popüler Destinasyonlar</h4>
              {(inputValue.length > 0 ? filteredDestinations : popularDestinations).map((destination, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(destination)}
                  className="w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{destination.name}</div>
                      <div className="text-sm text-gray-600">{destination.formatted_address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}