# `useElementSize` Hook

Efficiently tracks the dimensions (content width and height) of a specified DOM element using the `ResizeObserver` API.

**Dependency:** This hook relies on `useResizeObserver`.

**Note:** This hook provides a _callback ref_ function, not a ref object. Attach this function to the `ref` prop of the element you want to measure.

## Usage

```typescript
import React from "react";
import { useElementSize } from "@supunlakmal/hooks"; // Adjust path

function MeasuredComponent() {
  // Get the callback ref and the size state from the hook
  const [squareRef, { width, height }] = useElementSize<HTMLDivElement>();

  return (
    <div
      style={{ marginTop: "20px", border: "1px dashed #aaa", padding: "15px" }}
    >
      <h2>Element Size Tracker</h2>
      <p>
        Resize the window or the container below to see the dimensions change.
      </p>
      <div
        style={{
          width: "80%",
          margin: "20px auto",
          resize: "both",
          overflow: "auto",
          border: "1px solid green",
        }}
      >
        <div
          ref={squareRef} // Attach the callback ref here
          style={{
            width: "50%", // Example: size relative to parent
            paddingTop: "50%", // Maintain aspect ratio (square)
            backgroundColor: "lightcoral",
            margin: "10px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
            }}
          >
            Measured Size:
            <br />
            W: {width.toFixed(0)}px, H: {height.toFixed(0)}px
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeasuredComponent;
```

## API

### Parameters

None.

### Returns

A tuple `[refCallback, size]` containing:

1.  `refCallback`: A callback ref setter function (`(node: T | null) => void`). This function should be passed to the `ref` prop of the element you want to measure.
2.  `size`: An object (`Size`) containing the dimensions:
    - `width`: `number` - The content width of the element in pixels (from `contentRect.width` or `clientWidth`).
    - `height`: `number` - The content height of the element in pixels (from `contentRect.height` or `clientHeight`).

## How it Works

1.  **Element State**: Uses `useState` (`element`, `setElement`) to keep track of the actual DOM node the ref is attached to.
2.  **Size State**: Uses `useState` (`size`, `setSize`) to store the calculated width and height, initialized to `{ width: 0, height: 0 }`.
3.  **Stable Ref**: Creates a stable `useRef` object (`elementRef`) which is needed to pass to `useResizeObserver`. Its `.current` property is kept in sync with the `element` state.
4.  **Callback Ref**: Defines a `refCallback` function using `useCallback`. When this function is passed to a component's `ref` prop, React calls it with the DOM node.
    - The callback updates `elementRef.current`.
    - It also updates the `element` state using `setElement`, triggering effects that depend on it.
5.  **Resize Observer**: Calls `useResizeObserver(elementRef)` to get the `ResizeObserverEntry` whenever the element pointed to by `elementRef` resizes.
6.  **Size Update Effect**: An `useEffect` hook recalculates and updates the `size` state.
    - It runs when the `element` state changes (meaning the ref got attached/detached) or when the dimensions reported by `useResizeObserver` (`entry.contentRect`) change.
    - It prioritizes dimensions from the `ResizeObserverEntry` (`entry.contentRect.width/height`).
    - As a fallback (especially for the initial render before the observer fires), it uses `element.clientWidth/clientHeight`.
    - It includes a check (`if (newWidth !== size.width || newHeight !== size.height)`) to only call `setSize` if the dimensions have actually changed, preventing potential infinite loops if `clientWidth/Height` were used in the dependency array directly.
7.  **Return Value**: Returns the `refCallback` function and the current `size` state object in a tuple.
