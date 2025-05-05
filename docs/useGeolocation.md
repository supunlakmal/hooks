# `useGeolocation` Hook

Tracks the user's current geographic location using the browser's Geolocation API. Provides coordinates, speed, heading, timestamp, and accuracy information, along with loading and error states.

## Usage

```typescript
import React from "react";
import { useGeolocation } from "@supunlakmal/hooks"; // Adjust the import path as needed

function GeolocationInfo() {
  const {
    loading,
    latitude,
    longitude,
    accuracy,
    altitude,
    altitudeAccuracy,
    heading,
    speed,
    timestamp,
    error,
  } = useGeolocation({ enableHighAccuracy: true }); // Request high accuracy

  if (loading) {
    return <div>Loading geolocation data... (Check browser permissions)</div>;
  }

  if (error) {
    return <div>Error getting location: {error.message}</div>;
  }

  return (
    <div>
      <h1>Geolocation Data</h1>
      {latitude !== null && longitude !== null ? (
        <ul>
          <li>Latitude: {latitude}</li>
          <li>Longitude: {longitude}</li>
          <li>Accuracy: {accuracy ? `${accuracy} meters` : "N/A"}</li>
          <li>Altitude: {altitude ? `${altitude} meters` : "N/A"}</li>
          <li>
            Altitude Accuracy:{" "}
            {altitudeAccuracy ? `${altitudeAccuracy} meters` : "N/A"}
          </li>
          <li>Heading: {heading !== null ? `${heading} degrees` : "N/A"}</li>
          <li>Speed: {speed !== null ? `${speed} m/s` : "N/A"}</li>
          <li>
            Timestamp:{" "}
            {timestamp ? new Date(timestamp).toLocaleString() : "N/A"}
          </li>
        </ul>
      ) : (
        <p>Location data not yet available.</p>
      )}
    </div>
  );
}

export default GeolocationInfo;
```

## API

### Parameters

- `options`: (Optional) An object (`PositionOptions`) passed directly to `navigator.geolocation.getCurrentPosition` and `navigator.geolocation.watchPosition`. Common options include:
  - `enableHighAccuracy`: `boolean` (default `false`) - Request a more accurate position (can consume more power and take longer).
  - `timeout`: `number` (milliseconds) - Maximum time allowed to return a position.
  - `maximumAge`: `number` (milliseconds) - Maximum acceptable age of a cached position.
  - See [MDN Geolocation PositionOptions](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions) for details.

### Returns

An object (`GeolocationState`) containing:

- `loading`: `boolean` - `true` initially or while fetching the first position, `false` otherwise.
- `latitude`: `number | null` - Decimal degrees.
- `longitude`: `number | null` - Decimal degrees.
- `accuracy`: `number | null` - Meters.
- `altitude`: `number | null` - Meters above the WGS 84 ellipsoid.
- `altitudeAccuracy`: `number | null` - Meters.
- `heading`: `number | null` - Degrees clockwise from true north.
- `speed`: `number | null` - Meters per second.
- `timestamp`: `number | null` - Milliseconds elapsed since the UNIX epoch.
- `error`: `GeolocationPositionError | Error | null` - An error object if geolocation failed (permission denied, unavailable, timeout) or if the API is not supported, `null` otherwise.

## How it Works

1.  **State Initialization**: Uses `useState` to manage the `GeolocationState`, initialized with `loading: true` and null values for position data.
2.  **API Check**: An `useEffect` hook first checks if `navigator.geolocation` is available in the browser. If not, it sets an error state and stops.
3.  **Callbacks**: Defines `onSuccess` and `onError` callback functions:
    - `onSuccess`: Takes a `GeolocationPosition` object, updates the state with the coordinates and other data, sets `loading` to `false`, and resets `error` to `null`.
    - `onError`: Takes a `GeolocationPositionError` object, updates the state with the `error`, and sets `loading` to `false`.
4.  **Initial Fetch**: Calls `navigator.geolocation.getCurrentPosition(onSuccess, onError, options)` to get the initial location immediately.
5.  **Watching**: Calls `navigator.geolocation.watchPosition(onSuccess, onError, options)` to start monitoring for location changes. It stores the returned `watchId`.
6.  **Cleanup**: The `useEffect` returns a cleanup function. This function calls `navigator.geolocation.clearWatch(watchId)` to stop monitoring when the component unmounts or if the `options` dependency changes.
7.  **Dependency Array**: The effect depends on `options`. If the `options` object changes, the effect re-runs, clearing the old watch and starting a new one with the new options.
