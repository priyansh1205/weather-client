import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { geoLocation } from '@/lib/constants';

interface GeolocationState {
  loaded: boolean;
  coordinates?: { lat: number; lon: number };
  error?: { code: number; message: string };
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    loaded: false,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setLocation({
        loaded: true,
        error: { code: 0, message: 'Geolocation not supported' },
      });
      logger.warn('Geolocation not supported');
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
      });
      logger.debug('Geolocation success:', position.coords);
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation({
        loaded: true,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      logger.warn('Geolocation error:', error.message);
    };
    
    const options = {
      enableHighAccuracy: geoLocation.highAccuracy, 
      timeout: geoLocation.timeout, 
      maximumAge: geoLocation.maxAge, 
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }, []);

  return location;
}