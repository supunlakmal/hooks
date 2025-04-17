# `useThrottle` Hook

Throttles a value, ensuring that updates to the value do not occur more frequently than a specified time limit. This is useful for limiting the rate at which a function is called or a value is updated, for example, in response to rapid events like scrolling or resizing.

## Usage

```typescript
"use client";
import { useThrottle } from "@supunlakmal/hooks"; // Assuming this hook is correctly installed/imported
import React, { useState, useEffect } from "react";

function ThrottledComponent() {
  // 1. Initialize state without accessing `window` directly.
  //    Use `null` or a sensible default (like 0) initially.
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const throttledWidth = useThrottle(windowWidth ?? 0, 500); // Provide a default (0) to useThrottle if windowWidth is null

  useEffect(() => {
    // This code runs *only* on the client after the component mounts

    // 2. Set the initial width from the actual window object
    setWindowWidth(window.innerWidth);

    // 3. Define the resize handler
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 4. Add the event listener
    window.addEventListener("resize", handleResize);

    // 5. Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this effect runs only once on mount

  useEffect(() => {
    // This effect still runs only when throttledWidth changes
    // Avoid logging during the initial null state if desired
    if (throttledWidth !== 0) {
      // Or check against the initial state of useThrottle if it differs
      console.log(`Window width updated (throttled): ${throttledWidth}px`);
      // Perform actions based on the throttled width, e.g., adjusting layout
    }
  }, [throttledWidth]);

  // Optional: Handle the initial null state during rendering
  if (windowWidth === null) {
    return <div>Loading window size...</div>; // Or return null, or render with default values
  }

  return (
    <div>
      <p>Current Window Width: {windowWidth}px</p>
      {/* Display throttled width, potentially showing the initial default briefly */}
      <p>Throttled Window Width: {throttledWidth}px</p>
      <p>Resize the window to see the throttling effect.</p>
    </div>
  );
}

export default ThrottledComponent;
```

## API

### Parameters

- `value`: The value to be throttled. Can be of any type `T`.
- `limit`: The minimum time interval in milliseconds (`number`) that must pass between updates to the throttled value.

### Returns

- `throttledValue`: The throttled value. It updates to the latest `value` only if the specified `limit` has passed since the last update. Initially, it holds the initial `value`.

## How it Works

The `useThrottle` hook manages the rate of updates using `useState`, `useEffect`, and `useRef`.

1.  **State Initialization**: Initializes `throttledValue` state with the initial `value`.
2.  **Reference for Last Update Time**: A `useRef` (`lastRan`) stores the timestamp of the last time the throttled value was updated. It's initialized with `Date.now()`.
3.  **Effect for Throttling**: An effect runs whenever the `value` or `limit` changes.
4.  **Scheduled Update**: Inside the effect, `setTimeout` is used to schedule a potential update. The delay for the timeout is calculated as the remaining time needed to meet the `limit` based on the `lastRan` timestamp.
5.  **Update Check**: When the timeout executes, it checks if the current time minus the `lastRan` timestamp is greater than or equal to the `limit`. If it is, it means enough time has passed, so `throttledValue` is updated to the current `value`, and `lastRan` is updated to the current time.
6.  **Immediate Update Check**: The effect also includes a check to see if the `value` has changed _and_ enough time has passed since the last update (`Date.now() - lastRan.current >= limit`). If both conditions are true, it immediately updates `throttledValue` and `lastRan`. This handles cases where the value changes significantly after a period of inactivity, providing responsiveness.
7.  **Cleanup**: The `useEffect` returns a cleanup function that clears the scheduled timeout (`clearTimeout(handler)`). This prevents the scheduled update if the component unmounts or if the `value` or `limit` changes again before the timeout completes.
8.  **Return Value**: The hook returns the `throttledValue` state.
