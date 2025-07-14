import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, Clock, Route } from 'lucide-react';
import { ANTALYA_AIRPORT } from '../../config/google-maps';

interface SelectedPlace {
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
}

interface TransferRouteMapProps {
  destination: SelectedPlace;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: ANTALYA_AIRPORT.lat,
  lng: ANTALYA_AIRPORT.lng
};

const mapOptions = {
  disableDefaultUI: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
};

export default function TransferRouteMap({ destination, onRouteCalculated }: TransferRouteMapProps) {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if Google Maps API is available
  const hasGoogleMaps = typeof window !== 'undefined' && window.google?.maps;

  const calculateRoute = useCallback(async () => {
    if (!destination || !destination.lat || !destination.lng) return;

    setIsLoading(true);
    
    if (hasGoogleMaps) {
      try {
        const directionsService = new google.maps.DirectionsService();
        
        const result = await directionsService.route({
          origin: { lat: ANTALYA_AIRPORT.lat, lng: ANTALYA_AIRPORT.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirectionsResponse(result);
        
        if (result.routes[0] && result.routes[0].legs[0]) {
          const leg = result.routes[0].legs[0];
          const distanceText = leg.distance?.text || '';
          const durationText = leg.duration?.text || '';
          
          setDistance(distanceText);
          setDuration(durationText);
          
          // Call callback with numeric values
          if (onRouteCalculated && leg.distance?.value && leg.duration?.value) {
            onRouteCalculated(
              leg.distance.value / 1000, // Convert to km
              leg.duration.value / 60    // Convert to minutes
            );
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        // Fallback to estimated distance
        const estimatedDistance = calculateEstimatedDistance(destination.name);
        setDistance(`${estimatedDistance} km`);
        setDuration(`${Math.round(estimatedDistance * 1.2)} dk`);
        
        if (onRouteCalculated) {
          onRouteCalculated(estimatedDistance, estimatedDistance * 1.2);
        }
      }
    } else {
      // Fallback when Google Maps is not available
      const estimatedDistance = calculateEstimatedDistance(destination.name);
      setDistance(`${estimatedDistance} km`);
      setDuration(`${Math.round(estimatedDistance * 1.2)} dk`);
      
      if (onRouteCalculated) {
        onRouteCalculated(estimatedDistance, estimatedDistance * 1.2);
      }
    }
    
    setIsLoading(false);
  }, [destination, onRouteCalculated, hasGoogleMaps]);

  const calculateEstimatedDistance = (destinationName: string): number => {
    const distances: { [key: string]: number } = {
      'kemer': 42,
      'belek': 35,
      'side': 65,
      'alanya': 120,
      'kas': 190,
      'kalkan': 200,
    };
    
    const name = destinationName.toLowerCase();
    for (const [key, dist] of Object.entries(distances)) {
      if (name.includes(key)) {
        return dist;
      }
    }
    return 45; // Default distance
  };

  useEffect(() => {
    calculateRoute();
  }, [calculateRoute]);

  if (!hasGoogleMaps) {
    // Fallback UI when Google Maps is not available
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Route className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Transfer Güzergahı</h3>
            <div className="text-sm text-yellow-600">(Tahmini)</div>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>

        {/* Route Info */}
        {distance && duration && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Mesafe (Tahmini)</p>
                  <p className="font-semibold text-gray-800">{distance}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Süre (Tahmini)</p>
                  <p className="font-semibold text-gray-800">{duration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback map placeholder */}
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Route className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Harita Görünümü</p>
            <p className="text-sm">Google Maps yüklenemedi</p>
            <p className="text-xs mt-2">
              {ANTALYA_AIRPORT.name} ↔ {destination.name}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full Google Maps component when available
  try {
    const { GoogleMap, DirectionsRenderer } = require('@react-google-maps/api');

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Route className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Transfer Güzergahı</h3>
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
        </div>

        {/* Route Info */}
        {distance && duration && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Mesafe</p>
                  <p className="font-semibold text-gray-800">{distance}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Süre</p>
                  <p className="font-semibold text-gray-800">{duration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          options={mapOptions}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#3B82F6',
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    );
  } catch (error) {
    console.warn('Google Maps components not available, using fallback');
    // Return the fallback UI
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Route className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Transfer Güzergahı</h3>
            <div className="text-sm text-yellow-600">(Yükleme hatası)</div>
          </div>
        </div>
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Route className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Harita Yüklenemedi</p>
            <p className="text-sm">Bileşen hatası</p>
          </div>
        </div>
      </div>
    );
  }
}