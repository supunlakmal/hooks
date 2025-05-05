# `useWindowSize` Hook

A simple React hook that returns the current dimensions (width and height) of the browser window. It updates automatically whenever the window is resized.

## Usage

```typescript
import React from "react";
import { useWindowSize } from "@supunlakmal/hooks"; // Adjust the import path as needed

function ResponsiveComponent() {
  const { width, height } = useWindowSize();

  // Note: `width` and `height` will be undefined on the initial server render.
  // Handle this case appropriately if using SSR/Next.js.

  return (
    <div>
      <h1>Window Size</h1>
      {width !== undefined && height !== undefined ? (
        <p>
          Current size: {width}px wide x {height}px high
        </p>
      ) : (
        <p>Calculating size...</p>
      )}

      {/* Example: Conditionally render based on width */}
      {width !== undefined && width < 768 ? (
        <p>This message appears on smaller screens (less than 768px wide).</p>
      ) : (
        <p>This message appears on larger screens (768px wide or more).</p>
      )}
    </div>
  );
}

export default ResponsiveComponent;
```

## API

### Parameters

None.

### Returns

An object (`WindowSize`) containing:

- `width`: The current width of the browser window in pixels (`number`). It is `undefined` during server-side rendering and before the initial client-side mount.
- `height`: The current height of the browser window in pixels (`number`). It is `undefined` during server-side rendering and before the initial client-side mount.

## How it Works

1.  **State Initialization**: Uses `useState` to store the window dimensions (`width` and `height`). It initializes them to `undefined` to prevent hydration mismatches between server and client renders.
2.  **Effect Setup**: An `useEffect` hook is used to handle the logic that interacts with the browser's `window` object.
3.  **Resize Handler**: Inside the effect, a `handleResize` function is defined. This function updates the state with the current `window.innerWidth` and `window.innerHeight`.
4.  **Event Listener**: An event listener for the `resize` event is added to the `window`. When the window is resized, the `handleResize` function is called.
5.  **Initial Size**: The `handleResize` function is called once immediately after the component mounts to set the initial window size state.
6.  **Cleanup**: The `useEffect` hook returns a cleanup function. This function removes the `resize` event listener when the component unmounts, preventing memory leaks.
7.  **Dependency Array**: The effect has an empty dependency array (`[]`), meaning it only runs once when the component mounts and the cleanup runs when it unmounts.
