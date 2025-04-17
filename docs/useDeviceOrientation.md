# `useDeviceOrientation` Hook

Tracks the physical orientation of the hosting device relative to the Earth's coordinate frame, using the [`deviceorientation` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event).

**Note:**

- **HTTPS Required:** Most modern browsers require a secure context (HTTPS) to expose device orientation data.
- **User Permission:** While often not requiring an explicit prompt like geolocation, browser settings or subtle prompts might be involved, and support can be inconsistent.
- **Availability:** Not available on all devices/browsers (e.g., many desktop browsers lack the necessary sensors).

## Usage

Call the hook to get the current orientation state.

```typescript
import React from "react";
import { useDeviceOrientation } from "@supunlakmal/hooks"; // Adjust path

function DeviceOrientationExample() {
  const { alpha, beta, gamma, absolute, isSupported } = useDeviceOrientation();

  const formatAngle = (angle: number | null): string => {
    return angle !== null ? angle.toFixed(2) + "°" : "N/A";
  };

  return (
    <div>
      <h1>useDeviceOrientation Example</h1>
      {!isSupported ? (
        <p style={{ color: "red" }}>
          Device Orientation API not supported or available on this
          device/browser/context.
        </p>
      ) : (
        <div>
          <p>Move your device (if supported) to see the values change.</p>
          <ul>
            <li>Alpha (Z-axis rotation): {formatAngle(alpha)}</li>
            <li>Beta (X-axis tilt): {formatAngle(beta)}</li>
            <li>Gamma (Y-axis tilt): {formatAngle(gamma)}</li>
            <li>Absolute: {absolute ? "Yes" : "No"}</li>
          </ul>
          {/* You could use these values to rotate a 3D model, create a compass, etc. */}
          <div
            style={{
              marginTop: "20px",
              width: "100px",
              height: "100px",
              backgroundColor: "lightblue",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2em",
              transform: `rotateZ(${alpha || 0}deg) rotateX(${
                beta || 0
              }deg) rotateY(${gamma || 0}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            🧭
          </div>
        </div>
      )}
    </div>
  );
}

export default DeviceOrientationExample;
```

## API

```typescript
interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
  isSupported: boolean;
}

function useDeviceOrientation(): DeviceOrientationState;
```

### Parameters

- None.

### Returns

- `DeviceOrientationState`: An object containing:
  - `alpha`: `number | null` - Rotation around the Z axis, range [0, 360). Represents the compass direction if the device is level.
  - `beta`: `number | null` - Rotation around the X axis (front to back tilt), range [-180, 180).
  - `gamma`: `number | null` - Rotation around the Y axis (left to right tilt), range [-90, 90).
  - `absolute`: `boolean` - Indicates if the orientation is provided as absolute values relative to the Earth's coordinate system (`true`) or relative to some arbitrary initial orientation (`false`).
  - `isSupported`: `boolean` - True if the `DeviceOrientationEvent` API seems to be supported by the browser.

## How it Works

1.  **State**: Uses `useState` to store the orientation angles (`alpha`, `beta`, `gamma`), the `absolute` flag, and the `isSupported` flag.
2.  **Support Check**: An `useEffect` runs once on mount to check if `window.DeviceOrientationEvent` exists, setting the `isSupported` state accordingly.
3.  **Event Listener**: Uses the `useEventListener` hook to add a listener for the `'deviceorientation'` event to the `window` object (if supported).
4.  **Handler**: The `handleOrientationChange` function receives the `DeviceOrientationEvent` and updates the state with the latest `alpha`, `beta`, `gamma`, and `absolute` values.
5.  **Cleanup**: `useEventListener` handles the removal of the event listener when the component unmounts.
