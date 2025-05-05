# `useVisibility` Hook

Tracks whether a target element is currently visible within the browser viewport or a specified scrollable ancestor element, using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

This is highly efficient for tasks like lazy-loading images/components, triggering animations when elements scroll into view, or tracking ad impressions.

## Usage

Attach a ref to the element you want to track. Pass the ref and optional Intersection Observer configuration options to the hook. It returns a boolean state indicating if the element is currently intersecting (visible).

```typescript
import React, { useRef } from "react";
import { useVisibility } from "@supunlakmal/hooks"; // Adjust path

const LazyComponent = ({ id }: { id: number }) => {
  console.log(`LazyComponent ${id} rendered/updated`);
  return (
    <div
      style={{ padding: "20px", border: "1px solid green", marginTop: "10px" }}
    >
      I am Lazy Component {id}
    </div>
  );
};

function VisibilityExample() {
  const elementRef1 = useRef<any>(null);
  const elementRef2 = useRef<any>(null);
  const elementRef3 = useRef<any>(null);

  // Example 1: Basic visibility check
  const isVisible1 = useVisibility(elementRef1, {
    threshold: 0.5, // Trigger when 50% visible
  });

  // Example 2: Only trigger once when it becomes visible
  const isVisible2 = useVisibility(elementRef2, {
    threshold: 0.1,
    disconnectOnVisible: true, // Disconnect observer after first visibility
  });

  // Example 3: Visibility within a specific scrollable container (not shown in detail here)
  // const scrollContainerRef = useRef(null);
  // const isVisibleInContainer = useVisibility(elementRef, { root: scrollContainerRef.current });

  const boxStyle: React.CSSProperties = {
    height: "300px",
    width: "80%",
    margin: "50px auto",
    border: "2px solid #ccc",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    transition: "background-color 0.5s ease",
  };

  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <h1>useVisibility Example</h1>
      <p>Scroll down to see the elements change state.</p>

      {/* Element 1 */}
      <div
        ref={elementRef1}
        style={{
          ...boxStyle,
          backgroundColor: isVisible1 ? "#lightgreen" : "#f9f9f9",
        }}
      >
        <h2>Element 1</h2>
        <p>Is {isVisible1 ? "Visible (>=50%)" : "Not Visible (>=50%)"}</p>
        {/* Conditionally render expensive component */}
        {isVisible1 && <LazyComponent id={1} />}
      </div>

      {/* Element 2 */}
      <div
        ref={elementRef2}
        style={{
          ...boxStyle,
          backgroundColor: isVisible2 ? "#lightblue" : "#f9f9f9",
        }}
      >
        <h2>Element 2 (Trigger Once)</h2>
        <p>Is {isVisible2 ? "Visible (>=10%)" : "Not Visible (>=10%)"}</p>
        <p>Observer {isVisible2 ? "disconnected" : "active"}.</p>
        {isVisible2 && <LazyComponent id={2} />}
      </div>

      {/* Element 3 - Placeholder */}
      <div ref={elementRef3} style={boxStyle}>
        <h2>Element 3</h2>
        <p>(No specific observer logic attached in this example)</p>
      </div>
    </div>
  );
}

export default VisibilityExample;
```

## API

```typescript
import { RefObject } from 'react';

interface UseVisibilityOptions extends IntersectionObserverInit {
  initialIsVisible?: boolean;
  disconnectOnVisible?: boolean;
}

function useVisibility<T extends Element>(
  elementRef: RefObject<T>,
  options?: UseVisibilityOptions
): boolean;
```

### Parameters

- `elementRef`: `RefObject<T>` - A React ref pointing to the DOM element (`T extends Element`) whose visibility you want to track.
- `options`: `UseVisibilityOptions` (Optional) - An object that extends the standard [`IntersectionObserverInit`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#options) options and adds custom ones:
  - `root`: `Element | null` (Optional) - The element used as the viewport for checking visibility. Defaults to the browser viewport (`null`).
  - `rootMargin`: `string` (Optional) - Margin around the `root`. Syntax is like CSS `margin`. Defaults to `'0px'`.
  - `threshold`: `number | number[]` (Optional) - At what percentage of the target's visibility the observer's callback should be executed. Can be a single number (0-1) or an array of numbers. Defaults to `0` (meaning as soon as one pixel is visible).
  - `initialIsVisible`: `boolean` (Optional) - The initial boolean state for visibility before the observer has run. Defaults to `false`.
  - `disconnectOnVisible`: `boolean` (Optional) - If set to `true`, the `IntersectionObserver` will automatically disconnect itself after the target element becomes visible (`isIntersecting` becomes true) for the first time. Useful for one-time actions like lazy loading. Defaults to `false`.

### Returns

- `boolean`: A state variable that is `true` if the `elementRef` element is currently intersecting (visible according to the specified `threshold` and `rootMargin` options) and `false` otherwise.

## How it Works

1.  **State**: Uses `useState` to store the `isVisible` boolean status.
2.  **Effect**: An `useEffect` hook sets up the `IntersectionObserver`.
    - It checks for the existence of the `elementRef.current` and browser support for `IntersectionObserver`.
    - It creates a new `IntersectionObserver` instance, passing a callback function and the `observerOptions` (root, rootMargin, threshold).
    - **Observer Callback**: The callback receives an array of entries (typically just one in this usage). It checks the `isIntersecting` property of the first entry to determine visibility and updates the `isVisible` state accordingly using `setIsVisible`.
    - If `disconnectOnVisible` is true and the element becomes visible, it calls `observer.disconnect()`.
    - **Observing**: It starts observing the target element using `observer.observe(element)`.
    - **Cleanup**: The `useEffect` hook returns a cleanup function that calls `observer.disconnect()` when the component unmounts or when the dependencies change, preventing memory leaks.
3.  **Dependencies**: The `useEffect` dependencies include `elementRef`, `disconnectOnVisible`, and a `JSON.stringify` version of `observerOptions`. Stringifying the options ensures the effect re-runs if the configuration (like `threshold` or `rootMargin`) changes, as object identity would otherwise change on every render.
