# useDebouncedWindowSize

A custom React hook that provides the current window dimensions (`width` and `height`), but updates the returned values only after a specified debounce delay following the last resize event. It wraps `useWindowSize` and `useDebouncedState`.

This is useful for performance optimization, preventing components from re-rendering excessively during rapid window resizing actions by the user.

## Usage

```jsx
import { useDebouncedWindowSize } from '@supunlakmal/hooks'; // Adjust import path

function ResponsiveDisplay() {
  // Get window size, debounced by 500ms
  const { width, height } = useDebouncedWindowSize(500);

  return (
    <div>
      <h1>Debounced Window Size</h1>
      <p>
        The debounced window dimensions will update 500ms after you stop
        resizing.
      </p>
      <p>Debounced Width: {width}px</p>
      <p>Debounced Height: {height}px</p>

      {width > 0 && width < 600 ? (
        <p>Layout: Small</p>
      ) : width >= 600 && width < 900 ? (
        <p>Layout: Medium</p>
      ) : width >= 900 ? (
        <p>Layout: Large</p>
      ) : (
        <p>Layout: Initializing...</p> // Handles initial server render (width/height 0)
      )}
    </div>
  );
}

export default ResponsiveDisplay;
```

## Parameters

- **`delay`**: `number` (Required)
  - The debounce delay in milliseconds. The returned `width` and `height` will only update `delay` milliseconds after the window resize events have stopped.

## Return Value

- **`WindowSize`**: An object `{ width: number; height: number }`
  - Contains the debounced `width` and `height` of the browser window in pixels.
  - During server-side rendering or if `window` is unavailable, it defaults to `{ width: 0, height: 0 }` (behavior inherited from the underlying `useWindowSize`).

## Notes

- This hook relies internally on `useWindowSize` to get the real-time dimensions and `useDebouncedState` to apply the debounce logic.
- It helps improve performance by reducing the frequency of updates triggered by window resize events.
