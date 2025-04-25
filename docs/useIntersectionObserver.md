# `useIntersectionObserver` Hook

Monitors the intersection of a target DOM element with an ancestor element or with the device's viewport using the `IntersectionObserver` API.

## Usage

### Basic Usage (Viewport Intersection)

```typescript
import React, { useRef } from "react";
import { useIntersectionObserver } from "@supunlakmal/hooks"; // Adjust the import path as needed

function LazyImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const entry = useIntersectionObserver(imgRef, { threshold: 0.1 }); // Trigger when 10% visible

  const isVisible = entry?.isIntersecting;

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined} // Load src only when visible
      alt={alt}
      width="400" // Placeholder size
      height="300"
      style={{
        display: "block",
        margin: "20px auto",
        backgroundColor: "#eee", // Placeholder background
        minHeight: "300px", // Ensure space is reserved
        opacity: isVisible ? 1 : 0.5, // Fade in effect
        transition: "opacity 0.5s ease-in-out",
      }}
    />
  );
}

function App() {
  return (
    <div>
      <h1>useIntersectionObserver Demo</h1>
      <p>Scroll down to see the images lazy-load.</p>
      <div style={{ height: "100vh" }}>Scroll down...</div>
      <LazyImage
        src="https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Image+1"
        alt="Placeholder 1"
      />
      <LazyImage
        src="https://via.placeholder.com/400x300/00FF00/FFFFFF?text=Image+2"
        alt="Placeholder 2"
      />
      <LazyImage
        src="https://via.placeholder.com/400x300/0000FF/FFFFFF?text=Image+3"
        alt="Placeholder 3"
      />
      <div style={{ height: "50vh" }}>End of content.</div>
    </div>
  );
}

export default App;
```

### With Options (Custom Root and Margin)

```typescript
import React, { useRef } from "react";
import { useIntersectionObserver } from "@supunlakmal/hooks"; // Adjust path

function ScrollableAreaObserver() {
  const scrollContainerRef = useRef<any>(null);
  const targetRef = useRef<any>(null);

  const entry = useIntersectionObserver(targetRef, {
    root: scrollContainerRef.current, // Observe within the scroll container
    rootMargin: "-50px 0px -50px 0px", // Trigger 50px before entering/leaving root bounds
    threshold: 0.5, // Trigger when 50% visible within root
  });

  return (
    <div>
      <h2>Observing within a Scrollable Div</h2>
      <div
        ref={scrollContainerRef}
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid blue",
          margin: "20px 0",
        }}
      >
        <div style={{ height: "200px", background: "#eee", margin: "10px" }}>
          Scroll down...
        </div>
        <div
          ref={targetRef}
          style={{
            height: "200px",
            background: entry?.isIntersecting ? "lightgreen" : "lightcoral",
            margin: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          Target Element (Intersecting: {entry?.isIntersecting ? "Yes" : "No"})
        </div>
        <div style={{ height: "300px", background: "#eee", margin: "10px" }}>
          More content...
        </div>
      </div>
    </div>
  );
}

export default ScrollableAreaObserver;
```

## API

### Parameters

- `elementRef`: A React ref object (`RefObject<Element>`) attached to the DOM element you want to observe.
- `options`: (Optional) An object (`IntersectionObserverInit`) providing configuration options for the observer. It accepts the same properties as the `IntersectionObserver` constructor options:
  - `root`: The `Element` or `Document` object which is used as the viewport for checking intersection. Defaults to the browser viewport (`null`).
  - `rootMargin`: A string (`string`) defining margins for the `root`, similar to CSS margins (e.g., `'10px 20px 30px 40px'`). Defaults to `'0px'`.
  - `threshold`: A single number or an array of numbers (`number | number[]`) between 0.0 and 1.0, indicating the percentage(s) of the target element's visibility at which the observer callback should be executed. Defaults to `0` (meaning as soon as even one pixel is visible).

### Returns

- An `IntersectionObserverEntry` object or `null`. It returns the latest entry provided by the `IntersectionObserver` callback, which contains information about the intersection state (like `isIntersecting`, `intersectionRatio`, `boundingClientRect`, etc.). It returns `null` initially before any observation occurs or if the browser doesn't support `IntersectionObserver`.

## How it Works

1.  **State Initialization**: Uses `useState` to store the latest `IntersectionObserverEntry` object, initialized to `null`.
2.  **Effect Setup**: An `useEffect` hook manages the observer lifecycle.
3.  **Browser Support Check**: It checks if `window.IntersectionObserver` is supported and if the `elementRef.current` (the DOM node) exists. If not, it does nothing.
4.  **Observer Creation**: If supported and the node exists, it creates a new `IntersectionObserver` instance.
    - The callback function provided to the observer takes an array of entries (usually just one in this hook's case) and calls `setEntry` to update the state with the latest entry.
    - The `options` object passed to the hook is forwarded to the `IntersectionObserver` constructor.
5.  **Observing**: It calls `observer.observe(node)` to start watching the target element.
6.  **Cleanup**: The `useEffect` returns a cleanup function. This function calls `observer.disconnect()` to stop observing the element when the component unmounts or when the dependencies change.
7.  **Dependency Array**: The effect depends on the DOM node (`elementRef.current`) and the relevant parts of the `options` (`root`, `rootMargin`, `threshold`). If any of these change, the effect re-runs, disconnecting the old observer and creating a new one with the updated configuration.
