import { useState, useEffect } from 'react';
import { useGeolocation } from './useGeolocation'; // Assuming path and export
import { useFetch } from './useFetch'; // Assuming path and export

// Define necessary types locally if not exported
type GeolocationState = ReturnType<typeof useGeolocation>;
type UseFetchReturn<T = any> = ReturnType<typeof useFetch<T>>; // Infer or use 'any'

/**
 * A hook that fetches data from an API based on the user's current geolocation.
 *
 * @param urlBuilder A function that takes latitude and longitude and returns the URL string or Request object.
 * @param fetchOptions Options for the underlying useFetch hook (standard RequestInit).
 * @param geolocationOptions Options for the underlying useGeolocation hook.
 * @returns An object containing geolocation state and fetch state.
 */
export function useLocationBasedFetch<T = any>(
  urlBuilder: (latitude: number, longitude: number) => string | undefined, // Simplified builder
  fetchOptions: RequestInit = {},
  geolocationOptions: PositionOptions = {}
): { geolocation: GeolocationState; fetch: UseFetchReturn<T> } {
  const geolocationState = useGeolocation(geolocationOptions);
  const [fetchUrl, setFetchUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (geolocationState.latitude && geolocationState.longitude) {
      // Pass lat/lon directly to simplified builder
      const newUrl = urlBuilder(
        geolocationState.latitude,
        geolocationState.longitude
      );
      setFetchUrl(newUrl);
    } else {
      // Optionally clear fetchUrl or handle cases where location is not available
      setFetchUrl(undefined);
    }
  }, [
    geolocationState.latitude,
    geolocationState.longitude,
    urlBuilder, // Remove other geolocation state dependencies if only lat/lon are used
  ]);

  const fetchState = useFetch<T>(fetchUrl, fetchOptions);

  return {
    geolocation: geolocationState,
    fetch: fetchState,
  };
}
