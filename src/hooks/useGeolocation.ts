import { useState, useEffect } from "react";

interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | Error | null;
}

interface UseGeolocationOptions extends PositionOptions {}

const initialGeolocationState: GeolocationState = {
  loading: true,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  latitude: null,
  longitude: null,
  speed: null,
  timestamp: null,
  error: null,
};

/**
 * Custom hook to track the user's geolocation.
 *
 * @param {UseGeolocationOptions} [options] - Optional configuration for the geolocation request (e.g., enableHighAccuracy).
 * @returns {GeolocationState} An object containing the geolocation data, loading state, and error state.
 */
export const useGeolocation = (options?: UseGeolocationOptions): GeolocationState => {
  const [state, setState] = useState<GeolocationState>(initialGeolocationState);
  let watchId: number | null = null;

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: new Error("Geolocation is not supported by this browser."),
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
        error: null,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error,
      }));
    };

    // Initial fetch
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Watch for changes
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    // Cleanup
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]); // Re-run if options change

  return state;
}

