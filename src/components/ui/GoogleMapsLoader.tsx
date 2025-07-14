import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../../config/google-maps';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
}

export default function GoogleMapsLoader({ children }: GoogleMapsLoaderProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
    region: 'TR',
    language: 'tr'
  });

  if (loadError) {
    console.warn('Google Maps failed to load, showing form without maps:', loadError);
    // Show the form without maps functionality for testing
    return (
      <div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-yellow-800">
            Google Maps yüklenmedi, ancak form çalışmaya devam ediyor. 
            (API key doğrulama veya ağ kısıtlaması olabilir)
          </p>
        </div>
        {children}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Google Maps yükleniyor...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}