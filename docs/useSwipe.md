# `useSwipe` Hook

Detects swipe gestures (left, right, up, down) on touch-enabled devices for a specified element.

## Usage

Attach a ref to the element you want to monitor for swipes. Provide callback functions for the specific swipe directions you want to handle in the `options` object.

```typescript
import React, { useRef, useState } from "react";
import { useSwipe } from "@supunlakmal/hooks"; // Adjust path

function SwipeArea() {
  const swipeRef = useRef<HTMLDivElement>(null);
  const [lastSwipe, setLastSwipe] = useState<string>("None");

  const handleSwipeLeft = (event: TouchEvent) => {
    console.log("Swiped Left!", event);
    setLastSwipe("Left");
  };

  const handleSwipeRight = (event: TouchEvent) => {
    console.log("Swiped Right!", event);
    setLastSwipe("Right");
  };

  const handleSwipeUp = (event: TouchEvent) => {
    console.log("Swiped Up!", event);
    setLastSwipe("Up");
  };

  const handleSwipeDown = (event: TouchEvent) => {
    console.log("Swiped Down!", event);
    setLastSwipe("Down");
  };

  useSwipe(swipeRef, {
    threshold: 50, // Minimum distance (px) for a swipe
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
  });

  return (
    <div>
      <p>Swipe within the area below:</p>
      <div
        ref={swipeRef}
        style={{
          width: "300px",
          height: "200px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          userSelect: "none", // Prevent text selection during swipe
          touchAction: "none", // Prevent browser default actions like scroll/zoom
        }}
      >
        Swipe Area
      </div>
      <p style={{ marginTop: "10px" }}>
        Last Swipe Detected: <strong>{lastSwipe}</strong>
      </p>
    </div>
  );
}

export default SwipeArea;
```

## API

```typescript
function useSwipe<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: {
    threshold?: number; // Default: 50 (px)
    onSwipeLeft?: (event: TouchEvent) => void;
    onSwipeRight?: (event: TouchEvent) => void;
    onSwipeUp?: (event: TouchEvent) => void;
    onSwipeDown?: (event: TouchEvent) => void;
  }
): void;
```

### Parameters

- `ref`: `RefObject<T>` - A React ref object attached to the target HTML element (`T` extends `HTMLElement`) where swipe gestures should be detected.
- `options`: (Optional) `object` - Configuration options:
  - `threshold`: (Optional) `number` - The minimum distance in pixels that the touch must travel to be considered a swipe. Defaults to `50`.
  - `onSwipeLeft`: (Optional) `(event: TouchEvent) => void` - Callback function triggered when a swipe to the left is detected.
  - `onSwipeRight`: (Optional) `(event: TouchEvent) => void` - Callback function triggered when a swipe to the right is detected.
  - `onSwipeUp`: (Optional) `(event: TouchEvent) => void` - Callback function triggered when a swipe upwards is detected.
  - `onSwipeDown`: (Optional) `(event: TouchEvent) => void` - Callback function triggered when a swipe downwards is detected.

### Returns

- `void` - This hook does not return any value. It operates by attaching touch event listeners to the element referenced by the `ref`.

## How it Works

1.  **Refs**: Uses `useRef` to store the starting (`touchStartX`, `touchStartY`) and ending (`touchEndX`, `touchEndY`) coordinates of a touch interaction.
2.  **Event Handlers**: Uses `useCallback` to memoize touch event handlers:
    - `handleTouchStart`: Records the starting X and Y coordinates of the first touch point when a touch begins.
    - `handleTouchMove`: Updates the ending X and Y coordinates as the touch point moves across the screen.
    - `handleTouchEnd`: Calculates the horizontal (`deltaX`) and vertical (`deltaY`) distance traveled when the touch ends. It determines if the distance exceeds the `threshold`.
      - If the threshold is met, it compares the absolute horizontal and vertical distances (`absDeltaX`, `absDeltaY`) to determine the primary direction of the swipe (horizontal or vertical).
      - Based on the direction and sign of the delta, it calls the corresponding callback (`onSwipeLeft`, `onSwipeRight`, `onSwipeUp`, or `onSwipeDown`).
      - Finally, it resets all stored coordinates to `null`.
3.  **Event Listeners**: An `useEffect` hook attaches the necessary touch event listeners (`touchstart`, `touchmove`, `touchend`, `touchcancel`) to the element provided by the `ref`. It uses `passive: true` for performance optimization, especially for `touchstart` and `touchmove`. A `touchcancel` listener is included to reset the state if the touch interaction is interrupted by the browser. The effect returns a cleanup function to remove these listeners when the component unmounts or the `ref` changes.
