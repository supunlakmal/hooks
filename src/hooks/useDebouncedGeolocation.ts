import { useEffect } from 'react';
import { useGeolocation, GeolocationState, UseGeolocationOptions } from './useGeolocation'; 
import { useDebouncedState } from './useDebouncedState'; 

/**
 * A hook that provides debounced geolocation data.
 * Uses useGeolocation internally but debounces the resulting state updates.
 * Useful for reducing re-renders when location potentially updates frequently.
 *
 * @param options Options for the useGeolocation hook (e.g., enableHighAccuracy).
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced GeolocationState object.
 */
export function useDebouncedGeolocation(
  options?: UseGeolocationOptions, 
  delay: number = 500 
): GeolocationState {
  // Get the live geolocation state
  const liveGeolocationState = useGeolocation(options);

  // Create debounced state, initialized with the current live state
  // We need a stable initial state reference for useDebouncedState
  const [debouncedState, setDebouncedState] = useDebouncedState<GeolocationState>(
    liveGeolocationState,
    delay
  );

  // Effect to update the debounced state when the live state changes
  useEffect(() => {
    setDebouncedState(liveGeolocationState);
    // Depend on the live state object. If useGeolocation doesn't return
    // a stable object reference, this might debounce unnecessarily often.
    // A deep comparison effect might be better if the object reference changes
    // even when values are the same, but let's start simple.
  }, [liveGeolocationState, setDebouncedState]);

  // Return the debounced state
  return debouncedState;
}

// Re-export the state type if it's defined in useGeolocation
export type { GeolocationState };
export type { UseGeolocationOptions };
