# useThrottledScroll

A custom React hook that tracks the window's horizontal (`scrollX`) and vertical (`scrollY`) scroll position, but throttles the state updates to improve performance. It utilizes the `useThrottledCallback` hook internally.

This is useful when components need to react to scroll events (e.g., showing/hiding a "back to top" button, triggering animations, updating a progress bar) but don't require sub-millisecond precision, preventing excessive re-renders during rapid scrolling.

## Usage

```jsx
import { useThrottledScroll } from '@supunlakmal/hooks'; // Adjust import path
import { useState, useEffect } from 'react';

function ScrollIndicator() {
  // Get scroll position, throttled to update at most every 200ms
  const { scrollY } = useThrottledScroll(200);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Show button only when scrolled down past a certain point (e.g., 300px)
    if (scrollY > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  }, [scrollY]); // Effect depends on the throttled scrollY value

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{ height: '200vh', border: '1px dashed gray', padding: '10px' }}
    >
      <h1>Throttled Scroll Position</h1>
      <p>Scroll down to see the effect.</p>
      <p>Throttled Y Position: {scrollY}px</p>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
        >
          Back to Top
        </button>
      )}
    </div>
  );
}

export default ScrollIndicator;
```

## Parameters

- **`delay`**: `number` (Required)
  - The throttle delay in milliseconds. State updates for `scrollX` and `scrollY` will occur at most once per `delay` milliseconds while scrolling.
- **`throttleOptions`**: `ThrottleOptions` (Optional)
  - An object containing options passed to the underlying `useThrottledCallback`. Common options might include:
    - `leading`: `boolean` (Default: `true`) - Invoke the callback on the leading edge of the timeout.
    - `trailing`: `boolean` (Default: `true`) - Invoke the callback on the trailing edge of the timeout.
    - `noTrailing`: `boolean` (As seen in the code) - Might be a specific option from your `useThrottledCallback` implementation to disable the trailing call. Refer to `useThrottledCallback` documentation for exact behavior.

## Return Value

- **`ScrollPosition`**: An object `{ scrollX: number; scrollY: number }`
  - Contains the throttled horizontal (`scrollX`) and vertical (`scrollY`) scroll position of the window.
  - Defaults to `{ scrollX: 0, scrollY: 0 }` during server-side rendering or if `window` is not available.

## Notes

- This hook attaches a throttled event listener to the `window`'s `scroll` event.
- The listener is automatically cleaned up when the component unmounts.
- Throttling prevents the component state from updating on every single pixel scrolled, which can significantly improve performance for complex components that depend on scroll position.
