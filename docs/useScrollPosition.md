# `useScrollPosition` Hook

Tracks the current X and Y scroll position of the browser window or a specified scrollable element.
Includes an optional throttle to limit the frequency of updates during rapid scrolling.

**Dependency:** This hook relies on `useEventListener`.

## Usage

### Tracking Window Scroll

```typescript
import React from "react";
import { useScrollPosition } from "@supunlakmal/hooks"; // Adjust path

function WindowScrollReporter() {
  const { x, y } = useScrollPosition(); // Defaults to window, throttle 100ms

  // Example: Make a header sticky after scrolling down
  const isSticky = y > 100;

  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <div
        style={{
          position: isSticky ? "fixed" : "static",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px",
          background: isSticky ? "lightblue" : "lightgray",
          borderBottom: "1px solid #ccc",
          zIndex: 100,
          transition: "background 0.3s ease",
        }}
      >
        <h1>Scroll Position Tracker</h1>
        <p>
          Window Scroll - X: {x.toFixed(0)}, Y: {y.toFixed(0)}
        </p>
        <p>Header is {isSticky ? "Sticky" : "Static"}</p>
      </div>
      <p style={{ marginTop: "100px" }}>Scroll down to see the effect.</p>
    </div>
  );
}

export default WindowScrollReporter;
```

### Tracking Element Scroll

```typescript
import React, { useRef } from "react";
import { useScrollPosition } from "@supunlakmal/hooks"; // Adjust path

function ElementScrollReporter() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  // Track scroll position of the element referenced by scrollableRef, no throttle
  const { x, y } = useScrollPosition(scrollableRef, 0);

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Element Scroll Position</h2>
      <div
        ref={scrollableRef}
        style={{
          height: "200px",
          width: "300px",
          overflow: "scroll",
          border: "1px solid blue",
        }}
      >
        <div
          style={{
            height: "500px",
            width: "500px",
            background: "linear-gradient(white, lightblue)",
          }}
        >
          Scroll inside this box.
        </div>
      </div>
      <p>
        Element Scroll - X: {x.toFixed(0)}, Y: {y.toFixed(0)}
      </p>
    </div>
  );
}

export default ElementScrollReporter;
```

## API

### Parameters

- `element`: (Optional) The target to track the scroll position for.
  - Can be a React ref object (`RefObject<Element>`) pointing to a scrollable DOM element.
  - Can be `window` (or omitted/`null`/`undefined` to default to `window`).
- `throttleMs`: (Optional) `number` - The minimum time in milliseconds between scroll position updates. Defaults to `100`. Set to `0` or less to disable throttling (updates on every scroll event).

### Returns

- An object (`ScrollPosition`) containing:
  - `x`: `number` - The current horizontal scroll position (in pixels).
  - `y`: `number` - The current vertical scroll position (in pixels).

## How it Works

1.  **State Initialization**: Uses `useState` to store the `position` (`{ x, y }`). It initializes the state by calling a helper function `getScrollPosition`.
2.  **`getScrollPosition` Helper**: This function determines the correct scroll values based on the target:
    - Checks if running in a browser environment.
    - Resolves the actual target (`window` or a specific `Element` from a ref or direct pass).
    - Returns `{ x: window.scrollX, y: window.scrollY }` for the window.
    - Returns `{ x: target.scrollLeft, y: target.scrollTop }` for an Element.
    - Returns `{ x: 0, y: 0 }` in edge cases or SSR.
3.  **Throttle Ref**: Uses `useRef` (`throttleTimeout`) to keep track of the `setTimeout` ID used for throttling.
4.  **Scroll Handler**: `handleScroll` updates the state by calling `getScrollPosition` again and clears the `throttleTimeout` ref.
5.  **Throttled Handler**: `throttledHandleScroll` wraps `handleScroll`. If `throttleMs` is 0, it calls `handleScroll` directly. Otherwise, it only sets a timeout to call `handleScroll` if no timeout is currently pending.
6.  **Event Listener**: Uses `useEventListener` to attach a `scroll` event listener to the resolved `target` (`element` or `window`), calling `throttledHandleScroll`.
7.  **Update on Element Change**: An additional `useEffect` hook runs whenever the `element` parameter changes. It calls `setPosition(getScrollPosition(element))` to immediately update the position if the target element itself changes (e.g., if a ref points to a different conditionally rendered element).
