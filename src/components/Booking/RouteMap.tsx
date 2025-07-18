import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Clock, Route } from 'lucide-react';
import { googleMapsService } from '../../lib/google-maps';
import { LocationData } from '../../types';

interface RouteMapProps {
  origin: string | LocationData;
  destination: string | LocationData;
  onRouteCalculated?: (distance: number, duration: number) => void;
}

export default function RouteMap({ origin, destination, onRouteCalculated }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        if (!window.google) {
          await googleMapsService.loadGoogleMapsAPI();
        }

        if (mapRef.current && !map) {
          const newMap = new google.maps.Map(mapRef.current, {
            zoom: 10,
            center: { lat: 36.8987, lng: 30.7854 }, // Antalya Airport
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          const renderer = new google.maps.DirectionsRenderer({
            suppressMarkers: false,
            polylineOptions: {
              strokeColor: '#3B82F6',
              strokeWeight: 4,
            },
          });

          renderer.setMap(newMap);
          setMap(newMap);
          setDirectionsRenderer(renderer);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [map]);

  // Calculate and display route
  useEffect(() => {
    const calculateRoute = async () => {
      if (!origin || !destination || !directionsRenderer) return;
      
      // Check if both origin and destination have valid coordinates
      const hasValidOrigin = typeof origin === 'string' || (typeof origin === 'object' && origin.lat !== 0 && origin.lng !== 0);
      const hasValidDestination = typeof destination === 'string' || (typeof destination === 'object' && destination.lat !== 0 && destination.lng !== 0);
      
      if (!hasValidOrigin || !hasValidDestination) return;

      setIsLoading(true);
      try {
        const result = await googleMapsService.calculateRoute(origin, destination);
        
        if (result) {
          directionsRenderer.setDirections(result.route);
          setRouteInfo({
            distance: result.distance,
            duration: result.duration
          });
          
          onRouteCalculated?.(result.distance, result.duration);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateRoute();
  }, [origin, destination, directionsRenderer, onRouteCalculated]);

  // Listen for location selection events to auto-draw routes
  useEffect(() => {
    const handleLocationSelected = (event: CustomEvent) => {
      const selectedLocation = event.detail?.location;
      if (selectedLocation && selectedLocation.lat && selectedLocation.lng) {
        // Auto-calculate route when location is selected and we have both points
        // This will be triggered by the updated location selection in LocationSearch
      }
    };

    window.addEventListener('locationSelected', handleLocationSelected as EventListener);
    return () => {
      window.removeEventListener('locationSelected', handleLocationSelected as EventListener);
    };
  }, []);

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
      {routeInfo && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Mesafe</p>
                <p className="font-semibold text-gray-800">{routeInfo.distance.toFixed(1)} km</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Süre</p>
                <p className="font-semibold text-gray-800">{Math.round(routeInfo.duration)} dk</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div 
        ref={mapRef} 
        className="w-full h-48 rounded-xl overflow-hidden"
        style={{ minHeight: '192px' }}
      />

    </div>
  );
}