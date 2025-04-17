# `useDeviceMotion` Hook

Tracks device motion information, including acceleration and rotation rate, using the [`devicemotion` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event).

**Note:**

- **HTTPS Required:** Like Device Orientation, accessing Device Motion typically requires a secure context (HTTPS).
- **User Permission Required:** Unlike Device Orientation, the `devicemotion` event often **requires explicit user permission** via the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API). This hook currently **does not** handle requesting this permission. You might need to use it in conjunction with `usePermission` or handle permission requests manually.
- **Availability:** Requires appropriate hardware sensors (accelerometer, gyroscope) which may not be present on all devices (especially desktops).

## Usage

Call the hook to get the current motion state. Remember to handle permissions separately if needed.

```typescript
import React from "react";
import { useDeviceMotion } from "@supunlakmal/hooks"; // Adjust path

function DeviceMotionExample() {
  const {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
    isSupported,
  } = useDeviceMotion();

  const formatMotionData = (
    data: DeviceMotionEventAcceleration | DeviceMotionEventRotationRate | null
  ): string => {
    if (!data) return "N/A";
    const x = data.x?.toFixed(2) ?? "N/A";
    const y = data.y?.toFixed(2) ?? "N/A";
    const z = data.z?.toFixed(2) ?? "N/A";
    return `X: ${x}, Y: ${y}, Z: ${z}`;
  };

  const formatRotationRate = (
    data: DeviceMotionEventRotationRate | null
  ): string => {
    if (!data) return "N/A";
    const alpha = data.alpha?.toFixed(2) ?? "N/A";
    const beta = data.beta?.toFixed(2) ?? "N/A";
    const gamma = data.gamma?.toFixed(2) ?? "N/A";
    return `Alpha: ${alpha}, Beta: ${beta}, Gamma: ${gamma}`;
  };

  return (
    <div>
      <h1>useDeviceMotion Example</h1>
      {!isSupported ? (
        <p style={{ color: "red" }}>
          Device Motion API not supported or permission might be denied.
        </p>
      ) : (
        <div>
          <p>
            Move or shake your device (if supported and permission granted) to
            see values change.
          </p>
          <ul>
            <li>Acceleration: {formatMotionData(acceleration)} (m/s²)</li>
            <li>
              Acceleration Incl. Gravity:{" "}
              {formatMotionData(accelerationIncludingGravity)} (m/s²)
            </li>
            <li>Rotation Rate: {formatRotationRate(rotationRate)} (deg/s)</li>
            <li>Interval: {interval !== null ? interval : "N/A"} (ms)</li>
          </ul>
          {/* Potential use cases: shake detection, simple gesture recognition, game controls */}
        </div>
      )}
    </div>
  );
}

export default DeviceMotionExample;
```

## API

```typescript
interface DeviceMotionState {
  acceleration: DeviceMotionEventAcceleration | null;
  accelerationIncludingGravity: DeviceMotionEventAcceleration | null;
  rotationRate: DeviceMotionEventRotationRate | null;
  interval: number | null;
  isSupported: boolean;
}

// Represents the structure of acceleration data
interface DeviceMotionEventAcceleration {
  x: number | null;
  y: number | null;
  z: number | null;
}

// Represents the structure of rotation rate data
interface DeviceMotionEventRotationRate {
  alpha: number | null; // Rotation around Z axis
  beta: number | null; // Rotation around X axis
  gamma: number | null; // Rotation around Y axis
}

function useDeviceMotion(): DeviceMotionState;
```

### Parameters

- None.

### Returns

- `DeviceMotionState`: An object containing:
  - `acceleration`: `DeviceMotionEventAcceleration | null` - Acceleration excluding gravity (if available), in m/s², along X, Y, and Z axes.
  - `accelerationIncludingGravity`: `DeviceMotionEventAcceleration | null` - Acceleration including the effect of gravity, in m/s², along X, Y, and Z axes.
  - `rotationRate`: `DeviceMotionEventRotationRate | null` - Rate of rotation change, in deg/s, around Z (alpha), X (beta), and Y (gamma) axes.
  - `interval`: `number | null` - Interval, in milliseconds, at which data is obtained from the device.
  - `isSupported`: `boolean` - True if the `DeviceMotionEvent` API seems to be supported by the browser. Note: This does **not** guarantee permission has been granted or data will be received.

## How it Works

1.  **State**: Uses `useState` to store the motion data (`acceleration`, `accelerationIncludingGravity`, `rotationRate`, `interval`) and an `isSupported` flag.
2.  **Support Check**: An `useEffect` runs once on mount to check if `window.DeviceMotionEvent` exists, setting the initial `isSupported` state.
3.  **Event Listener**: Uses the `useEventListener` hook (conditionally, based on `isSupported`) to add a listener for the `'devicemotion'` event to the `window` object.
4.  **Handler**: The `handleMotionChange` function receives the `DeviceMotionEvent`, updates the `isSupported` flag to `true` (since an event was received), and updates the state with the latest motion data.
5.  **Cleanup**: `useEventListener` handles the removal of the event listener when the component unmounts or if `isSupported` becomes false (though it usually won't after the initial check).
