# useIdleDetection

**Note:** The Idle Detection API is currently an experimental feature and may not be available in all browsers or may require specific flags to be enabled.

The `useIdleDetection` hook interacts with the experimental Idle Detection API to monitor the user's idle state (system-wide) and screen lock status.

## Usage

```jsx
import React from 'react';
import { useIdleDetection } from '@supunlakmal/hooks'; // Assuming installation

function IdleDetectionComponent() {
  const {
    isSupported,
    permissionState,
    userState,
    screenState,
    requestPermission,
    startDetection,
    stopDetection,
    error,
  } = useIdleDetection({
    threshold: 60000, // Idle threshold in milliseconds (e.g., 60 seconds)
    onUserIdle: () => console.log('User went idle.'),
    onUserActive: () => console.log('User became active.'),
    onScreenLocked: () => console.log('Screen was locked.'),
    onScreenUnlocked: () => console.log('Screen was unlocked.'),
    onError: (err) => console.error('Idle detection error:', err),
  });

  const handleRequestPermission = async () => {
    const status = await requestPermission();
    console.log('Permission status:', status);
    if (status === 'granted') {
      startDetection(); // Start detection if permission granted
    }
  };

  if (!isSupported) {
    return (
      <div>Idle Detection API is not supported or enabled in this browser.</div>
    );
  }

  return (
    <div>
      <h2>useIdleDetection Example (Experimental API)</h2>
      <p>Idle Detection API Supported: {isSupported ? 'Yes' : 'No'}</p>
      <p>
        Permission State: <strong>{permissionState}</strong>
      </p>
      <p>User State: {userState ?? 'unknown'}</p>
      <p>Screen State: {screenState ?? 'unknown'}</p>

      {permissionState !== 'granted' && (
        <button onClick={handleRequestPermission}>Request Permission</button>
      )}

      {permissionState === 'granted' && (
        <>
          <button onClick={startDetection}>Start Detection</button>
          <button onClick={stopDetection}>Stop Detection</button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

export default IdleDetectionComponent;
```

## API

### Parameters

- `options?`: `UseIdleDetectionOptions`
  - Optional object to configure the hook:
  - `threshold?`: `number` - The minimum time in milliseconds the user must be inactive before being considered idle. Defaults to 60000 (60 seconds). Must be at least 60000.
  - `onUserIdle?`: `() => void` - Callback when the user state changes to 'idle'.
  - `onUserActive?`: `() => void` - Callback when the user state changes to 'active'.
  - `onScreenLocked?`: `() => void` - Callback when the screen state changes to 'locked'.
  - `onScreenUnlocked?`: `() => void` - Callback when the screen state changes to 'unlocked'.
  - `onError?`: `(error: Error) => void` - Callback for errors during detection.

### Return Value

The hook returns an object with the following properties:

- `isSupported`: `boolean`
  - Indicates whether the Idle Detection API (`IdleDetector`) is available in the global scope.
- `permissionState`: `IdlePermissionState` (`'granted'`, `'denied'`, or `'prompt'`)
  - The current permission status for 'idle-detection'.
- `userState`: `UserIdleState | null` (`'active'` or `'idle'`)
  - The current detected user idle state, or `null` if unknown or not started.
- `screenState`: `ScreenIdleState | null` (`'locked'` or `'unlocked'`)
  - The current detected screen lock state, or `null` if unknown or not started.
- `requestPermission`: `() => Promise<IdlePermissionState>`
  - An asynchronous function to request permission for idle detection. Returns the resulting permission state.
- `startDetection`: `() => Promise<void>`
  - An asynchronous function to start the idle detection process. Requires permission to be granted.
- `stopDetection`: `() => void`
  - A function to stop the idle detection process and clean up resources.
- `error`: `Error | null`
  - Stores any error encountered during permission requests or detection.

## Behavior

- Checks for Idle Detection API support on mount.
- `requestPermission` uses `IdleDetector.requestPermission()`.
- `startDetection` creates an `IdleDetector` instance and starts monitoring based on the `threshold`.
- Updates `userState` and `screenState` based on events from the `IdleDetector`.
- Calls the corresponding `onUserIdle`, `onUserActive`, `onScreenLocked`, `onScreenUnlocked` callbacks.
- `stopDetection` aborts the detector and cleans up.
- Automatically calls `stopDetection` on component unmount.
- Includes a `@ts-expect-error` directive internally to handle the experimental nature of the `'idle-detection'` permission name in TypeScript.
