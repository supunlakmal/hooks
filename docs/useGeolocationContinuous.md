# useGeolocationContinuous

This hook provides continuous geolocation updates, allowing you to track the user's location in real-time. Unlike the `useGeolocation` hook, which only retrieves the user's location once, `useGeolocationContinuous` keeps updating the location as the user moves.

## API

### Return Value

*   `location`: `{ latitude: number; longitude: number } | null` - The current user's location. Initially `null`. It will be an object with `latitude` and `longitude` properties once the location is available.
*   `error`: `string | null` - An error message if there was a problem getting the location, otherwise `null`.
*   `loading`: `boolean` - Indicates whether the hook is currently trying to get the user's location.
*   `stop`: `() => void` - A function to stop the continuous geolocation updates. Call this function when you no longer need to track the user's location.

## Examples
```
tsx
import { useGeolocationContinuous } from '@supunlakmal/hooks';

function GeolocationContinuousExample() {
  const { location, error, loading, stop } = useGeolocationContinuous();

  return (
    <div>
      <h2>Continuous Geolocation Example</h2>
      {loading && <p>Loading location...</p>}
      {error && <p>Error: {error}</p>}
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
      <button onClick={stop}>Stop Tracking</button>
    </div>
  );
}
```
## How it Works

The `useGeolocationContinuous` hook utilizes the `navigator.geolocation.watchPosition` API to continuously monitor the user's location.

1.  **Starts Monitoring:** When the component mounts, the hook starts watching for position changes using `navigator.geolocation.watchPosition`.
2.  **Updates State:** As the user's location changes, the hook updates its internal state (`location`, `loading`, `error`).
3.  **Provides State:** The hook exposes `location`, `loading`, and `error` to the component.
4.  **Stop Tracking:** The hook returns a `stop` function to stop the updates. It uses `navigator.geolocation.clearWatch` to remove the location watcher.
5. **Diffrent with `useGeolocation`**: `useGeolocation` uses `navigator.geolocation.getCurrentPosition` that only provide the location once. `useGeolocationContinuous` use `navigator.geolocation.watchPosition` that provide the location continuously.