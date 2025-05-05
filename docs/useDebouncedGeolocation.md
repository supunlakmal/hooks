# useDebouncedGeolocation

A custom React hook that provides access to the device's geolocation information (latitude, longitude, accuracy, etc.) via the `useGeolocation` hook, but debounces the state updates using `useDebouncedState`.

This is particularly useful for performance optimization, especially in scenarios where the geolocation might update very frequently (e.g., on a moving device), preventing excessive component re-renders tied to location changes.

## Usage

```jsx
import { useDebouncedGeolocation } from '@supunlakmal/hooks'; // Adjust import path

function LocationDisplay() {
  // Get geolocation data, debounced by 1000ms (1 second)
  const {
    loading,
    error,
    latitude,
    longitude,
    accuracy,
    timestamp,
  } = useDebouncedGeolocation({ enableHighAccuracy: true }, 1000);

  if (loading) {
    return <p>Getting location (debounced)...</p>;
  }

  if (error) {
    return <p>Error getting location: {error.message}</p>;
  }

  return (
    <div>
      <h1>Debounced Geolocation</h1>
      <p>Updates will appear 1 second after the actual location changes stop or slow down.</p>
      {latitude !== null && longitude !== null ? (
        <>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
          <p>Accuracy: {accuracy ? `${accuracy} meters` : 'N/A'}</p>
          <p>Timestamp: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'}</p>
        </>
      ) : (
        <p>Location data not yet available.</p>
      )}
    </div>
  );
}

export default LocationDisplay;
```

## Parameters

-   **`options`**: `UseGeolocationOptions` (Optional)
    -   An options object passed directly to the underlying `useGeolocation` hook. Common options include:
        -   `enableHighAccuracy`: `boolean` - Request high accuracy (can consume more power).
        -   `timeout`: `number` - Maximum time (ms) allowed to return a position.
        -   `maximumAge`: `number` - Maximum age (ms) of a cached position that is acceptable.
-   **`delay`**: `number` (Optional, Default: `500`)
    -   The debounce delay in milliseconds. The returned geolocation state will only update `delay` milliseconds after the *last* update received from the underlying `useGeolocation` hook.

## Return Value

-   **`GeolocationState`**: An object containing the debounced geolocation state. It typically includes:
    -   `loading`: `boolean` - Indicates if the location is currently being fetched.
    -   `error`: `GeolocationPositionError | null` - Any error encountered while retrieving the location.
    -   `latitude`: `number | null` - The latitude.
    -   `longitude`: `number | null` - The longitude.
    -   `accuracy`: `number | null` - The accuracy radius in meters.
    -   `altitude`: `number | null` - The altitude in meters (if available).
    -   `altitudeAccuracy`: `number | null` - The altitude accuracy in meters (if available).
    -   `heading`: `number | null` - The direction of travel (degrees, 0-360).
    -   `speed`: `number | null` - The speed in meters per second.
    -   `timestamp`: `number | null` - The time the position was retrieved (DOMTimeStamp).

## Notes

-   Requires the browser's Geolocation API and user permission to access location.
-   Internally uses `useGeolocation` to get live data and `useDebouncedState` for debouncing.
-   Helps improve performance by reducing the rate of state updates from frequent geolocation changes.
