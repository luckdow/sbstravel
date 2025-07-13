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
      await this.loadGoogleMapsAPI();
      
      // Use the new Places API (Text Search)
      // For now, we'll use a fallback approach that works with both old and new APIs
      const { Place } = google.maps.places;
      
      if (Place && Place.searchByText) {
        // Use new Places API if available
        try {
          const request = {
            textQuery: `${query} Antalya Turkey`,
            fields: ['displayName', 'formattedAddress', 'location'],
            locationBias: {
              center: { lat: 36.8969, lng: 30.7133 }, // Antalya center
              radius: 50000 // 50km radius
            },
            maxResultCount: 8
          };

          const results = await Place.searchByText(request);
          
          // Convert new API response to old format for compatibility
          return results.places.map((place: any) => ({
            name: place.displayName,
            formatted_address: place.formattedAddress,
            geometry: {
              location: {
                lat: () => place.location.lat,
                lng: () => place.location.lng
              }
            },
            place_id: place.id
          }));
        } catch (newApiError) {
          console.warn('New Places API failed, falling back to legacy API:', newApiError);
          // Fall through to legacy API
        }
      }
      
      // Fallback to legacy API if new API is not available or fails
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
            } else {
              console.warn(`Legacy Places API failed: ${status}`);
              // Return empty array instead of rejecting to prevent breaking the flow
              resolve([]);
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