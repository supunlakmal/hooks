# `useDeviceMotion` Hook

## Description

The `useDeviceMotion` hook provides access to the device's motion sensor data, allowing you to track acceleration and rotation rates in three dimensions. This is useful for creating interactive experiences that respond to the physical movement of the device.

## Usage

A clear code example demonstrating how to use the hook.
```
typescript
import { useDeviceMotion } from './path/to/useDeviceMotion'; // Replace with the actual path

function MyComponent() {
  const deviceMotion = useDeviceMotion();

  return (
    <div>
      {deviceMotion && (
        <>
          <p>Acceleration: x={deviceMotion.acceleration?.x}, y={deviceMotion.acceleration?.y}, z={deviceMotion.acceleration?.z}</p>
          <p>Acceleration Including Gravity: x={deviceMotion.accelerationIncludingGravity?.x}, y={deviceMotion.accelerationIncludingGravity?.y}, z={deviceMotion.accelerationIncludingGravity?.z}</p>
          <p>Rotation Rate: alpha={deviceMotion.rotationRate?.alpha}, beta={deviceMotion.rotationRate?.beta}, gamma={deviceMotion.rotationRate?.gamma}</p>
          <p>Interval: {deviceMotion.interval}</p>
        </>
      )}
      {!deviceMotion && <p>Device motion not supported</p>}
    </div>
  );
}
```
## API

Define the TypeScript types and interfaces used by the hook.
```
typescript
interface DeviceMotionData {
  acceleration: { x: number | null; y: number | null; z: number | null } | null;
  accelerationIncludingGravity: { x: number | null; y: number | null; z: number | null } | null;
  rotationRate: { alpha: number | null; beta: number | null; gamma: number | null } | null;
  interval: number | null;
}
```
## Parameters

A bulleted list describing each parameter:

-   **options**:
    -   Type: `DeviceMotionEventInit` (optional)
    -   Description: An optional object that allow us to set the interval of the updates.  It's passed directly to the `DeviceMotionEvent` event listener.
    -   Mark optional parameters.: optional

## Returns

Describe what the hook returns:

-   **DeviceMotionData**:
    -   Type: `{ acceleration: { x: number | null; y: number | null; z: number | null } | null, accelerationIncludingGravity: { x: number | null; y: number | null; z: number | null } | null, rotationRate: { alpha: number | null; beta: number | null; gamma: number | null } | null; interval: number | null; } | null;`
    -   Details: An object containing the following properties:
        -   `acceleration`: Acceleration of the device on each axis, `null` if not supported.
            -   `x`: Acceleration on the x-axis.
            -   `y`: Acceleration on the y-axis.
            -   `z`: Acceleration on the z-axis.
        -   `accelerationIncludingGravity`: Acceleration with the effect of gravity, `null` if not supported.
            -   `x`: Acceleration on the x-axis including gravity.
            -   `y`: Acceleration on the y-axis including gravity.
            -   `z`: Acceleration on the z-axis including gravity.
        -   `rotationRate`: Rate of rotation around each axis, `null` if not supported.
            -   `alpha`: Rotation around the z-axis.
            -   `beta`: Rotation around the x-axis.
            -   `gamma`: Rotation around the y-axis.
        -   `interval`: interval of the update.
    -   Behavior explanation: This object will update with the latest `DeviceMotionEvent` data whenever the device motion sensor detects a change.
    - if `DeviceMotionEvent` is not available, then it will return null.

## How it Works

Explain the inner workings, including:

-   React hooks used (e.g., `useState`, `useRef`).
    -   `useState`: To hold the current `DeviceMotionData`.
    -   `useEffect`: To subscribe and unsubscribe to the `devicemotion` event.
-   Logic and calculations.
    -   The hook listens to the `devicemotion` event and updates the `DeviceMotionData` state when the event fires.
-   Cleanup procedures.
    -   The `useEffect` hook returns a cleanup function that removes the event listener when the component unmounts.
-   Reasoning behind implementation choices.
    -   Using `useState` allows the component to re-render whenever the sensor data changes.
    -   `useEffect` ensures that the event listener is set up and removed correctly during the component's lifecycle.
    - If the `DeviceMotionEvent` event not availabel, we will not add the event listener.