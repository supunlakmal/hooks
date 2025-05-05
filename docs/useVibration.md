# useVibration

A React hook to interact with the browser's Vibration API, allowing you to trigger device vibration.

## Usage

```tsx
import { useVibration } from './hooks/useVibration'; // Adjust import path

function VibrationComponent() {
  const { isSupported, vibrate, cancelVibration } = useVibration();

  const handleSimpleVibrate = () => {
    vibrate(200); // Vibrate for 200ms
  };

  const handlePatternVibrate = () => {
    // Vibrate 500ms, pause 200ms, vibrate 100ms
    vibrate([500, 200, 100]);
  };

  if (!isSupported) {
    return <p>Vibration API not supported on this device/browser.</p>;
  }

  return (
    <div>
      <h2>Vibration Controls</h2>
      <button onClick={handleSimpleVibrate}>Vibrate (200ms)</button>
      <button onClick={handlePatternVibrate}>Vibrate Pattern</button>
      <button onClick={cancelVibration}>Cancel Vibration</button>
    </div>
  );
}
```

## API

`useVibration(): UseVibrationReturn`

### Return Value (`UseVibrationReturn`)

- `isSupported: boolean`: Indicates if the Vibration API is available in the browser.
- `vibrate(pattern: VibrationPattern): void`: Triggers vibration.
  - `pattern`: A number (duration in ms) or an array of numbers (duration, pause, duration, ...).
- `cancelVibration(): void`: Stops any currently active vibration pattern.

### Notes

- Support for the Vibration API varies across browsers and devices (especially desktops).
- Vibration might not work if the device is in silent mode or the user has disabled vibration.
- Excessive use of vibration can be annoying to users and drain battery.
