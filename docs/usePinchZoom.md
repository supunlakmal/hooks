# usePinchZoom

The `usePinchZoom` hook allows you to detect and react to pinch-to-zoom gestures on a specified HTML element, typically on touch-enabled devices.

It tracks the scale factor and the origin (center point) of the pinch gesture, providing callbacks for the start, move, and end phases.

## Usage

This example shows how to apply a scale transform to an image based on the pinch gesture.

```jsx
import React, { useRef, useState } from 'react';
import { usePinchZoom } from '@supunlakmal/hooks'; // Assuming installation

function PinchableImage() {
  const imageRef = useRef < HTMLImageElement > null;
  const [currentScale, setCurrentScale] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  // Define pinch event handlers
  const handlePinchStart = (state) => {
    console.log('Pinch Start:', state);
    // Set transform origin based on the initial pinch center relative to the element
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const originX = ((state.origin.x - rect.left) / rect.width) * 100;
      const originY = ((state.origin.y - rect.top) / rect.height) * 100;
      setTransformOrigin(`${originX}% ${originY}%`);
    }
  };

  const handlePinchMove = (state) => {
    console.log('Pinch Move:', state);
    setCurrentScale(state.scale);
    // Optionally update transform origin continuously
    // if (imageRef.current) { ... }
  };

  const handlePinchEnd = (state) => {
    console.log('Pinch End:', state);
    // Final scale is already set by onPinchMove
  };

  // Use the hook, targeting the image element
  usePinchZoom(imageRef, {
    onPinchStart: handlePinchStart,
    onPinchMove: handlePinchMove,
    onPinchEnd: handlePinchEnd,
    minScale: 0.5, // Optional: Minimum scale allowed
    maxScale: 4, // Optional: Maximum scale allowed
  });

  return (
    <div
      style={{
        border: '2px solid blue',
        padding: '10px',
        overflow: 'hidden',
        width: '300px',
        height: '300px',
        touchAction: 'none' /* Important for gesture handling */,
      }}
    >
      <h2>usePinchZoom Example</h2>
      <p>Try pinching to zoom the image on a touch device.</p>
      <img
        ref={imageRef}
        src="https://via.placeholder.com/300" // Replace with your image URL
        alt="Pinchable"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          transform: `scale(${currentScale})`,
          transformOrigin: transformOrigin,
          transition: 'transform 0.05s ease-out', // Smooth transition slightly
          cursor: 'grab',
        }}
      />
      <p>Current Scale: {currentScale.toFixed(2)}</p>
    </div>
  );
}

export default PinchableImage;
```

## API

### Parameters

- `targetRef`: `React.RefObject<HTMLElement>`
  - **Required**. A React ref object pointing to the HTML element that should detect pinch gestures.
- `options`: `PinchZoomOptions`
  - **Required**. An object containing configuration and callbacks:
    - `onPinchStart`: `(state: PinchZoomState, event: TouchEvent) => void` (optional): Callback fired when a two-finger pinch gesture starts.
    - `onPinchMove`: `(state: PinchZoomState, event: TouchEvent) => void` (optional): Callback fired continuously as the user pinches.
    - `onPinchEnd`: `(state: PinchZoomState, event: TouchEvent) => void` (optional): Callback fired when the pinch gesture ends (fingers are lifted or move apart significantly).
    - `minScale`: `number` (optional, defaults to `0.5`): The minimum allowed scale factor.
    - `maxScale`: `number` (optional, defaults to `4`): The maximum allowed scale factor.

### PinchZoomState Object

The state object passed to the callbacks contains:

- `scale`: `number`
  - The current calculated scale factor based on the pinch distance, clamped within `minScale` and `maxScale`.
- `delta`: `number`
  - The change in scale since the last `onPinchMove` event (during move) or the total change since the start (during start/end). Can be positive (zooming in) or negative (zooming out).
- `origin`: `{ x: number; y: number }`
  - An object representing the center point between the two touch points in client coordinates (relative to the viewport).

### Return Value

None (`void`). The hook manages state internally and triggers the provided callbacks.

## Behavior

- **Event Listeners:** Attaches `touchstart`, `touchmove`, `touchend`, and `touchcancel` event listeners to the target element specified by `targetRef`.
  - `touchstart` and `touchmove` listeners are added with `{ passive: false }` to allow calling `event.preventDefault()`, which is necessary to override native browser pinch/scroll behavior.
- **Gesture Detection:**
  - `touchstart`: When exactly two touch points are detected, it calculates the initial distance and center point, sets the internal `isPinching` flag to true, and calls `onPinchStart`.
  - `touchmove`: If `isPinching` is true and two touch points remain, it calculates the current distance and compares it to the initial distance to determine the `scale` factor. It clamps the scale within `minScale` and `maxScale`. It calculates the `delta` (change in scale) and updates the `origin`. It then calls `onPinchMove`.
  - `touchend`/`touchcancel`: If `isPinching` was true, it sets `isPinching` to false, records the final scale, calculates the final delta, and calls `onPinchEnd`.
- **State Management:** Uses `useRef` to keep track of the pinching state (`isPinching`, `initialDistance`, `currentScale`, `lastScale`, `origin`) across renders without causing re-renders itself.
- **Callbacks:** Wraps the provided `onPinch*` callbacks in `useEventCallback` to ensure the latest versions are called.
- **Cleanup:** Removes all event listeners when the component unmounts or when dependencies change.
- **Browser Check:** Ensures it only runs in a browser environment.
