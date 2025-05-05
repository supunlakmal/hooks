# useBatteryStatus

A custom React hook that provides real-time information about the device's battery status by utilizing the browser's [Battery Status API](https://developer.mozilla.org/en-US/docs/Web/API/Battery_Status_API) (`navigator.getBattery`).

It tracks whether the device is charging, the current battery level, and estimates for time until fully charged or fully discharged.

## Usage

```jsx
import { useBatteryStatus } from '@supunlakmal/hooks'; // Adjust import path

function BatteryInfoDisplay() {
  const {
    isSupported,
    loading,
    charging,
    level,
    chargingTime,
    dischargingTime,
    error,
  } = useBatteryStatus();

  if (!isSupported) {
    return <p>Battery Status API is not supported by your browser.</p>;
  }

  if (loading) {
    return <p>Loading battery status...</p>;
  }

  if (error) {
    return <p>Error retrieving battery status: {error.message}</p>;
  }

  // Format level as percentage
  const levelPercent = level !== null ? Math.round(level * 100) : 'N/A';

  // Format time nicely (optional helper function)
  const formatTime = (seconds: number | null): string => {
    if (seconds === null || !isFinite(seconds)) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div>
      <h1>Battery Status</h1>
      <p>Charging: {charging === null ? 'N/A' : charging ? 'Yes' : 'No'}</p>
      <p>Level: {levelPercent}%</p>
      {charging ? (
         <p>Time until full: {formatTime(chargingTime)}</p>
      ) : (
         <p>Time until empty: {formatTime(dischargingTime)}</p>
      )}
    </div>
  );
}

export default BatteryInfoDisplay;
```

## Parameters

-   This hook does not accept any parameters.

## Return Value

-   **`BatteryState`**: An object containing the following properties:
    -   `isSupported`: `boolean` - Indicates whether the Battery Status API (`navigator.getBattery`) is supported by the user's browser.
    -   `loading`: `boolean` - `true` while the hook is initially attempting to fetch the battery status, `false` afterwards.
    -   `charging`: `boolean | null` - `true` if the device is currently charging, `false` if discharging, `null` if the status is unknown or not yet determined.
    -   `level`: `number | null` - The current battery charge level as a value between `0.0` (empty) and `1.0` (full), or `null` if unknown.
    -   `chargingTime`: `number | null` - An estimate in seconds of the time remaining until the battery is fully charged. Returns `null` if the device is not charging, the time is unknown, or the value is `Infinity`.
    -   `dischargingTime`: `number | null` - An estimate in seconds of the time remaining until the battery is empty. Returns `null` if the device is charging, the time is unknown, or the value is `Infinity`.
    -   `error`: `Error | null` - An `Error` object if there was a problem accessing the Battery Status API, `null` otherwise.

## Notes

-   The availability and accuracy of the Battery Status API can vary significantly between browsers and operating systems. Some browsers may not support it (`isSupported` will be `false`), or may return estimated values (especially for `chargingTime` and `dischargingTime`).
-   The hook automatically adds and removes event listeners to the `BatteryManager` object to update the state when changes occur (e.g., plugging/unplugging the charger, battery level changes).
-   `chargingTime` and `dischargingTime` might be `Infinity`, which the hook converts to `null` for easier handling.
