import { useState, useCallback, useEffect } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}

// Default to Mumbai, India for demo purposes (matches shelter locations)
const DEFAULT_LOCATION = {
  latitude: 19.076,
  longitude: 72.8777,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    // Try to restore coordinates from sessionStorage
    try {
      const saved = sessionStorage.getItem('user_location');
      if (saved) {
        const { latitude, longitude } = JSON.parse(saved);
        return {
          latitude,
          longitude,
          error: null,
          loading: false,
          permissionDenied: false,
        };
      }
    } catch (e) {
      console.error('Failed to restore location from storage:', e);
    }

    return {
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
      permissionDenied: false,
    };
  });

  // Save coordinates to sessionStorage whenever they change
  useEffect(() => {
    if (state.latitude !== null && state.longitude !== null) {
      sessionStorage.setItem('user_location', JSON.stringify({
        latitude: state.latitude,
        longitude: state.longitude
      }));
    }
  }, [state.latitude, state.longitude]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        let permissionDenied = false;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            permissionDenied = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        setState({
          latitude: null,
          longitude: null,
          error: errorMessage,
          loading: false,
          permissionDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setState({
      latitude: lat,
      longitude: lng,
      error: null,
      loading: false,
      permissionDenied: false,
    });
  }, []);

  const useDefaultLocation = useCallback(() => {
    setState({
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      error: null,
      loading: false,
      permissionDenied: false,
    });
  }, []);

  // Get coordinates with fallback
  const coordinates = {
    latitude: state.latitude ?? DEFAULT_LOCATION.latitude,
    longitude: state.longitude ?? DEFAULT_LOCATION.longitude,
  };

  return {
    ...state,
    coordinates,
    requestLocation,
    setManualLocation,
    useDefaultLocation,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
