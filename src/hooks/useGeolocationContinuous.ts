import { useState, useEffect, useCallback } from 'react';

export const useGeolocationContinuous = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let watchId: number | null = null;

  const stop = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      stop();
    };
  }, [stop]);

  return { location, error, loading, stop };
};
