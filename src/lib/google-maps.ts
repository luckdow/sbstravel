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

      // First try the new Distance Matrix API for more reliable results
      try {
        const distanceMatrixService = new google.maps.DistanceMatrixService();
        
        const distanceResult = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
          distanceMatrixService.getDistanceMatrix(
            {
              origins: [processLocation(origin)],
              destinations: [processLocation(destination)],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
            },
            (response, status) => {
              if (status === google.maps.DistanceMatrixStatus.OK && response) {
                resolve(response);
              } else {
                reject(new Error(`Distance Matrix request failed: ${status}`));
              }
            }
          );
        });

        if (distanceResult.rows?.[0]?.elements?.[0]?.status === 'OK') {
          const element = distanceResult.rows[0].elements[0];
          
          // Also get the route for visualization using DirectionsService
          let routeResult = null;
          try {
            const directionsService = new google.maps.DirectionsService();
            routeResult = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
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
                    // Don't fail if directions fail, we have distance data
                    resolve(null as any);
                  }
                }
              );
            });
          } catch (dirError) {
            console.warn('Directions service failed, but distance data available:', dirError);
          }

          return {
            distance: element.distance?.value ? element.distance.value / 1000 : 0, // Convert to KM
            duration: element.duration?.value ? element.duration.value / 60 : 0, // Convert to minutes
            route: routeResult
          };
        }
      } catch (distanceError) {
        console.warn('Distance Matrix API failed, falling back to DirectionsService:', distanceError);
      }

      // Fallback to DirectionsService if Distance Matrix fails
      const directionsService = new google.maps.DirectionsService();
      
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
      console.error('Error calculating route with all methods:', error);
      
      // Final fallback: use predefined distances
      const fallbackDistances = {
        'kemer': 42,
        'belek': 35,
        'side': 65,
        'alanya': 120,
        'kas': 190,
        'kalkan': 200,
        'antalya': 12
      };
      
      const destName = (typeof destination === 'string' ? destination : 
                       ('name' in destination ? destination.name : '')).toLowerCase();
      
      for (const [key, distance] of Object.entries(fallbackDistances)) {
        if (destName.includes(key)) {
          console.warn(`Using fallback distance for ${destName}: ${distance}km`);
          return {
            distance,
            duration: distance * 1.2, // Rough estimate: 50km/h average speed
            route: null as any
          };
        }
      }
      
      // Last resort default
      console.warn('Using default fallback distance: 45km');
      return {
        distance: 45,
        duration: 54, // 45km at 50km/h
        route: null as any
      };
    }
  }

  async searchPlaces(query: string): Promise<google.maps.places.PlaceResult[]> {
    try {
      await this.loadGoogleMapsAPI();
      
      // First try to use the newer Autocomplete Service for better results
      try {
        const autocompleteService = new google.maps.places.AutocompleteService();
        
        const autocompleteResults = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
          autocompleteService.getPlacePredictions(
            {
              input: query,
              componentRestrictions: { country: 'tr' },
              bounds: new google.maps.LatLngBounds(
                { lat: 36.0, lng: 29.0 }, // Southwest corner of Antalya region
                { lat: 37.5, lng: 32.0 }  // Northeast corner
              ),
              types: ['establishment', 'geocode'] // Include hotels, attractions, etc.
            },
            (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                resolve(predictions);
              } else {
                reject(new Error(`Autocomplete failed: ${status}`));
              }
            }
          );
        });

        // If we have autocomplete results, get detailed place information
        if (autocompleteResults && autocompleteResults.length > 0) {
          const placesService = new google.maps.places.PlacesService(document.createElement('div'));
          
          const detailedPlaces = await Promise.allSettled(
            autocompleteResults.slice(0, 8).map(prediction => 
              new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
                placesService.getDetails(
                  {
                    placeId: prediction.place_id,
                    fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types']
                  },
                  (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                      resolve(place);
                    } else {
                      reject(new Error(`Place details failed: ${status}`));
                    }
                  }
                );
              })
            )
          );

          const validPlaces = detailedPlaces
            .filter((result): result is PromiseFulfilledResult<google.maps.places.PlaceResult> => 
              result.status === 'fulfilled')
            .map(result => result.value);

          if (validPlaces.length > 0) {
            return validPlaces;
          }
        }
      } catch (autocompleteError) {
        console.warn('Autocomplete service failed, falling back to text search:', autocompleteError);
      }

      // Fallback to the newer Places API if available
      if (window.google?.maps?.places?.Place?.searchByText) {
        try {
          const { Place } = google.maps.places;
          
          const request = {
            textQuery: `${query} Antalya Turkey`,
            fields: ['displayName', 'formattedAddress', 'location', 'id'],
            locationBias: {
              center: { lat: 36.8969, lng: 30.7133 }, // Antalya center
              radius: 50000 // 50km radius
            },
            maxResultCount: 8
          };

          const results = await Place.searchByText(request);
          
          // Convert new API response to legacy format for compatibility
          if (results?.places && results.places.length > 0) {
            return results.places.map((place: any) => ({
              name: place.displayName?.text || place.displayName,
              formatted_address: place.formattedAddress,
              geometry: {
                location: {
                  lat: () => place.location?.lat || place.location?.latitude,
                  lng: () => place.location?.lng || place.location?.longitude
                }
              },
              place_id: place.id
            }));
          }
        } catch (newApiError) {
          console.warn('New Places API failed, falling back to legacy text search:', newApiError);
        }
      }
      
      // Final fallback to legacy Places Service
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      
      return new Promise((resolve, reject) => {
        service.textSearch(
          {
            query: `${query} Antalya Turkey`,
            bounds: new google.maps.LatLngBounds(
              { lat: 36.0, lng: 29.0 }, // Southwest corner
              { lat: 37.5, lng: 32.0 }  // Northeast corner
            ),
            region: 'tr'
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              console.warn(`Legacy Places API failed: ${status}`);
              // Return popular destinations as fallback
              const popularDestinations = POPULAR_DESTINATIONS
                .filter(dest => dest.name.toLowerCase().includes(query.toLowerCase()))
                .map(dest => ({
                  name: dest.name,
                  formatted_address: `${dest.name}, Antalya, Turkey`,
                  geometry: {
                    location: {
                      lat: () => dest.lat,
                      lng: () => dest.lng
                    }
                  },
                  place_id: `popular_${dest.name.toLowerCase()}`
                }));
              
              resolve(popularDestinations);
            }
          }
        );
      });
      
    } catch (error) {
      console.error('Error in all place search methods:', error);
      
      // Final fallback: return popular destinations that match the query
      const popularDestinations = POPULAR_DESTINATIONS
        .filter(dest => dest.name.toLowerCase().includes(query.toLowerCase()))
        .map(dest => ({
          name: dest.name,
          formatted_address: `${dest.name}, Antalya, Turkey`,
          geometry: {
            location: {
              lat: () => dest.lat,
              lng: () => dest.lng
            }
          },
          place_id: `fallback_${dest.name.toLowerCase()}`
        }));
      
      return popularDestinations;
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