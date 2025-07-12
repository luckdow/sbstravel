import { GOOGLE_MAPS_CONFIG, ANTALYA_AIRPORT, POPULAR_DESTINATIONS } from '../config/google-maps';
import { RouteResult, Location, LocationData } from '../types';

export class GoogleMapsService {
  private static instance: GoogleMapsService;
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  async loadGoogleMapsAPI(): Promise<void> {
    if (this.isLoaded && window.google) {
      return;
    }

    // If already loading, return the existing promise
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript && window.google) {
      this.isLoaded = true;
      return;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=${GOOGLE_MAPS_CONFIG.libraries.join(',')}&region=${GOOGLE_MAPS_CONFIG.region}&language=${GOOGLE_MAPS_CONFIG.language}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        this.loadingPromise = null;
        resolve();
      };
      script.onerror = () => {
        this.loadingPromise = null;
        reject(new Error('Failed to load Google Maps API'));
      };
      
      // Only append if not already exists
      if (!existingScript) {
        document.head.appendChild(script);
      }
    });

    return this.loadingPromise;
  }

  async calculateRoute(
    origin: string | google.maps.LatLngLiteral | LocationData,
    destination: string | google.maps.LatLngLiteral | LocationData
  ): Promise<RouteResult | null> {
    try {
      await this.loadGoogleMapsAPI();
      
      const directionsService = new google.maps.DirectionsService();
      
      // Convert LocationData to LatLngLiteral if needed
      const processLocation = (location: string | google.maps.LatLngLiteral | LocationData) => {
        if (typeof location === 'string') {
          return location;
        }
        if ('name' in location) {
          return { lat: location.lat, lng: location.lng };
        }
        return location;
      };
      
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin: processLocation(origin),
            destination: processLocation(destination),
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error(`Directions request failed: ${status}`));
            }
          }
        );
      });
      
      const route = result.routes[0];
      const leg = route.legs[0];
      
      return {
        distance: leg.distance?.value ? leg.distance.value / 1000 : 0, // Convert to KM
        duration: leg.duration?.value ? leg.duration.value / 60 : 0, // Convert to minutes
        route: result
      };
      
    } catch (error) {
      console.error('Error calculating route:', error);
      return null;
    }
  }

  async searchPlaces(query: string): Promise<google.maps.places.PlaceResult[]> {
    try {
      // If Google Maps API is not configured, return empty array
      if (!GOOGLE_MAPS_CONFIG.useRealAPI) {
        console.log('Google Maps API not configured, using fallback');
        return [];
      }

      await this.loadGoogleMapsAPI();
      
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      
      return new Promise((resolve, reject) => {
        service.textSearch(
          {
            query: `${query} Antalya Turkey`,
            region: 'tr'
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              console.warn(`Places search returned status: ${status}`);
              resolve([]); // Return empty array instead of rejecting
            }
          }
        );
      });
      
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  // Get distance from Antalya Airport to destination
  async getDistanceFromAirport(destination: LocationData): Promise<number> {
    try {
      const result = await this.calculateRoute(ANTALYA_AIRPORT, destination);
      return result?.distance || 0;
    } catch (error) {
      console.error('Error calculating distance from airport:', error);
      
      // Fallback: Use predefined distances for popular destinations
      const popularDest = POPULAR_DESTINATIONS.find(dest => 
        destination.name.toLowerCase().includes(dest.name.toLowerCase())
      );
      
      return popularDest?.distance || 50; // Default 50km if not found
    }
  }

  // Get popular destinations
  getPopularDestinations(): Location[] {
    return POPULAR_DESTINATIONS.map(dest => ({
      name: dest.name,
      lat: dest.lat,
      lng: dest.lng,
      distance: dest.distance
    }));
  }
}

// Export singleton instance
export const googleMapsService = GoogleMapsService.getInstance();