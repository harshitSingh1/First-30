import { NearbyService } from '@/types/emergency';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface LocationError {
  code: number;
  message: string;
}

// Request user's geolocation
export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ code: 0, message: 'Geolocation is not supported by your browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        console.log('[LocationService] Got user location:', location);
        resolve(location);
      },
      (error) => {
        let message = 'Unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        console.error('[LocationService] Geolocation error:', error.code, message);
        reject({ code: error.code, message });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0, // Don't use cached location - always get fresh
      }
    );
  });
};

// Overpass API query for nearby amenities
const buildOverpassQuery = (lat: number, lng: number, radius: number = 5000): string => {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="pharmacy"](around:${radius},${lat},${lng});
      node["amenity"="police"](around:${radius},${lat},${lng});
      node["amenity"="fire_station"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="pharmacy"](around:${radius},${lat},${lng});
      way["amenity"="police"](around:${radius},${lat},${lng});
      way["amenity"="fire_station"](around:${radius},${lat},${lng});
    );
    out center;
  `;
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Estimate travel time based on distance (rough estimate)
export const estimateTravelTime = (distanceKm: number): string => {
  // Assume average speed of 30 km/h in urban areas
  const minutes = Math.round((distanceKm / 30) * 60);
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
};

// Map Overpass amenity type to our service type
const mapAmenityType = (amenity: string): NearbyService['type'] | null => {
  const typeMap: Record<string, NearbyService['type']> = {
    'hospital': 'hospital',
    'pharmacy': 'pharmacy',
    'police': 'police',
    'fire_station': 'fire',
  };
  return typeMap[amenity] || null;
};

// Get the best available name based on language preference
const getLocalizedName = (tags: any, preferredLang: string = 'en'): string | null => {
  // Language code mapping for Overpass tags
  const langCodeMap: Record<string, string> = {
    'en': 'en',
    'de': 'de', 
    'hi': 'hi',
    'es': 'es',
    'fr': 'fr',
  };
  
  const langCode = langCodeMap[preferredLang] || 'en';
  
  // Try preferred language first, then English, then default name
  return tags?.[`name:${langCode}`] || tags?.['name:en'] || tags?.name || null;
};

// Get type label in preferred language
const getTypeLabel = (type: NearbyService['type']): string => {
  const labels: Record<NearbyService['type'], string> = {
    hospital: 'Hospital',
    pharmacy: 'Pharmacy',
    police: 'Police Station',
    fire: 'Fire Station',
  };
  return labels[type];
};

// Fetch nearby services from Overpass API
export const fetchNearbyServices = async (
  userLocation: UserLocation, 
  preferredLang: string = 'en'
): Promise<NearbyService[]> => {
  const query = buildOverpassQuery(userLocation.lat, userLocation.lng);
  
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    const services: NearbyService[] = data.elements
      .map((element: any, index: number) => {
        const lat = element.lat || element.center?.lat;
        const lng = element.lon || element.center?.lon;
        
        if (!lat || !lng) return null;

        const type = mapAmenityType(element.tags?.amenity);
        if (!type) return null;

        const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        const distanceStr = distance < 1 
          ? `${Math.round(distance * 1000)} m` 
          : `${distance.toFixed(1)} km`;

        // Get localized name, fallback to type label
        const name = getLocalizedName(element.tags, preferredLang) || getTypeLabel(type);
        
        // Build address from available tags
        const addressParts = [];
        if (element.tags?.['addr:housenumber']) addressParts.push(element.tags['addr:housenumber']);
        if (element.tags?.['addr:street']) addressParts.push(element.tags['addr:street']);
        if (element.tags?.['addr:city']) addressParts.push(element.tags['addr:city']);
        
        const address = addressParts.length > 0 
          ? addressParts.join(', ')
          : 'Address not available';

        return {
          id: `service-${element.id || index}`,
          name,
          type,
          address,
          distance: distanceStr,
          eta: estimateTravelTime(distance),
          phone: element.tags?.phone || element.tags?.['contact:phone'],
          isOpen24h: element.tags?.opening_hours === '24/7',
          lat,
          lng,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => {
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      })
      .slice(0, 20); // Limit to 20 results

    return services;
  } catch (error) {
    console.error('Failed to fetch nearby services:', error);
    throw error;
  }
};

// Generate Google Maps directions URL
export const getGoogleMapsDirectionsUrl = (
  userLocation: UserLocation,
  destination: { lat: number; lng: number; name?: string }
): string => {
  const origin = `${userLocation.lat},${userLocation.lng}`;
  const dest = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
};

// Fallback: Generate Google Maps search URL for nearby services
export const getGoogleMapsSearchUrl = (userLocation: UserLocation, serviceType: string): string => {
  const searchTerms: Record<string, string> = {
    hospital: 'hospital+emergency',
    pharmacy: 'pharmacy+24h',
    police: 'police+station',
    fire: 'fire+station',
  };
  const term = searchTerms[serviceType] || serviceType;
  return `https://www.google.com/maps/search/${term}/@${userLocation.lat},${userLocation.lng},14z`;
};
