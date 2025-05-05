# `useFullscreen` Hook

Provides functionality to enter and exit fullscreen mode for a specific HTML element, along with tracking the current fullscreen state.

## Usage

Pass a ref attached to the target element to the hook. It returns an object containing the current `isFullscreen` status (boolean) and functions to `enterFullscreen`, `exitFullscreen`, and `toggleFullscreen`.

```typescript
import React, { useRef } from "react";
import { useFullscreen } from "@supunlakmal/hooks"; // Adjust path

function FullscreenExample() {
  const targetRef = useRef<any>(null);
  const {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSupported,
  } = useFullscreen(targetRef);

  const videoStyle: React.CSSProperties = {
    maxWidth: "100%", // Ensure video fits container
    display: "block", // Prevents extra space below
  };

  return (
    <div>
      <h1>useFullscreen Example</h1>
      {!isSupported ? (
        <p style={{ color: "red" }}>
          Fullscreen API not supported by this browser.
        </p>
      ) : (
        <div>
          <p>Current state: {isFullscreen ? "Fullscreen" : "Normal"}</p>
          {/* Target element for fullscreen */}
          <div
            ref={targetRef}
            style={{
              border: "2px solid blue",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: isFullscreen ? "#eee" : "white",
            }}
          >
            <p>This div and its contents will go fullscreen.</p>
            {/* Example with a video element */}
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              controls
              style={videoStyle}
              width="400" // Initial width
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Controls */}
          <button onClick={enterFullscreen} disabled={isFullscreen}>
            Enter Fullscreen
          </button>
          <button
            onClick={exitFullscreen}
            disabled={!isFullscreen}
            style={{ marginLeft: "10px" }}
          >
            Exit Fullscreen
          </button>
          <button onClick={toggleFullscreen} style={{ marginLeft: "10px" }}>
            Toggle Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}

export default FullscreenExample;
```

## API

```typescript
import { RefObject } from 'react';

interface UseFullscreenResult {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  isSupported: boolean;
}

function useFullscreen(ref: RefObject<HTMLElement>): UseFullscreenResult;
```

### Parameters

- `ref`: `RefObject<HTMLElement>` - A React ref object attached to the HTML element that you want to make fullscreen.

### Returns

- `UseFullscreenResult`: An object containing:
  - `isFullscreen`: `boolean` - True if the element associated with the `ref` is currently the active fullscreen element, false otherwise.
  - `enterFullscreen`: `() => Promise<void>` - An asynchronous function to request fullscreen mode for the element. It handles vendor prefixes.
  - `exitFullscreen`: `() => Promise<void>` - An asynchronous function to exit fullscreen mode if the browser is currently in fullscreen. It handles vendor prefixes.
  - `toggleFullscreen`: `() => Promise<void>` - An asynchronous function that enters fullscreen if not currently active for the element, or exits if it is.
  - `isSupported`: `boolean` - True if the browser supports the Fullscreen API (based on `document.fullscreenEnabled`), false otherwise.

## How it Works

1.  **Support Check**: Determines if the Fullscreen API is supported by checking `document.fullscreenEnabled`.
2.  **State**: Uses `useState` to track the `isFullscreen` status for the referenced element.
3.  **Fullscreen Element Check**: Defines `getFullscreenElement` to safely get the current fullscreen element across browsers, checking standard `document.fullscreenElement` first, then vendor-prefixed versions.
4.  **Event Listener**: An `useEffect` hook adds event listeners for `fullscreenchange` (and its prefixed variants) to the `document`. The `handleFullscreenChange` callback updates the `isFullscreen` state by checking if the current fullscreen element exists and matches the `ref.current`.
5.  **Enter/Exit Functions**: `enterFullscreen` and `exitFullscreen` are memoized `useCallback` functions that call the appropriate browser API (`element.requestFullscreen()` or `document.exitFullscreen()`) with fallbacks for older vendor prefixes. They handle potential errors during the request.
6.  **Toggle Function**: `toggleFullscreen` is a memoized `useCallback` that checks the current fullscreen element and calls either `enterFullscreen` or `exitFullscreen` accordingly.
7.  **Cleanup**: The `useEffect` hook cleans up the event listeners when the component unmounts or dependencies change.
