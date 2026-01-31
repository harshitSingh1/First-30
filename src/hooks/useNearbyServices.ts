import { useState, useCallback, useEffect } from 'react';
import { NearbyService } from '@/types/emergency';
import { 
  getUserLocation, 
  fetchNearbyServices, 
  UserLocation, 
  LocationError 
} from '@/services/locationService';
import { mockNearbyServices } from '@/data/emergencyFlows';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseNearbyServicesReturn {
  services: NearbyService[];
  userLocation: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  permissionState: 'prompt' | 'granted' | 'denied' | 'unknown';
  requestLocation: () => Promise<void>;
  refresh: () => Promise<void>;
  useFallback: boolean;
}

export const useNearbyServices = (): UseNearbyServicesReturn => {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [useFallback, setUseFallback] = useState(false);
  const { language } = useLanguage();

  // Check permission state on mount
  useEffect(() => {
    const checkPermission = async () => {
      if ('permissions' in navigator) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          
          result.onchange = () => {
            setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
          };
        } catch {
          setPermissionState('unknown');
        }
      }
    };
    checkPermission();
  }, []);

  const fetchServices = useCallback(async (location: UserLocation) => {
    try {
      // Pass language preference to get localized names
      const nearbyServices = await fetchNearbyServices(location, language);
      if (nearbyServices.length > 0) {
        setServices(nearbyServices);
        setUseFallback(false);
      } else {
        // No results from API, use fallback
        setServices(mockNearbyServices);
        setUseFallback(true);
      }
    } catch (e) {
      console.error('Failed to fetch services from Overpass API:', e);
      // Use mock data as fallback
      setServices(mockNearbyServices);
      setUseFallback(true);
    }
  }, [language]);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setPermissionState('granted');
      await fetchServices(location);
    } catch (e) {
      const locationError = e as LocationError;
      setError(locationError.message);
      if (locationError.code === 1) {
        setPermissionState('denied');
      }
      // Use fallback data
      setServices(mockNearbyServices);
      setUseFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchServices]);

  const refresh = useCallback(async () => {
    if (userLocation) {
      setIsLoading(true);
      await fetchServices(userLocation);
      setIsLoading(false);
    } else {
      await requestLocation();
    }
  }, [userLocation, fetchServices, requestLocation]);

  // Auto-request if permission was already granted
  useEffect(() => {
    if (permissionState === 'granted' && !userLocation && !isLoading) {
      requestLocation();
    }
  }, [permissionState, userLocation, isLoading, requestLocation]);

  return {
    services,
    userLocation,
    isLoading,
    error,
    permissionState,
    requestLocation,
    refresh,
    useFallback,
  };
};
