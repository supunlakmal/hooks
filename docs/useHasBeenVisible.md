# useHasBeenVisible

A custom React hook that determines if a referenced DOM element has ever been visible within the viewport at least once. It utilizes the `useIntersectionObserver` hook internally. Once the element enters the viewport, this hook will permanently return `true`, even if the element subsequently scrolls out of view.

This is useful for scenarios like lazy-loading components/images only when they first become visible, or triggering one-time animations when an element scrolls into view.

## Usage

```jsx
import { useRef } from 'react';
import { useHasBeenVisible } from '@supunlakmal/hooks'; // Adjust import path

function LazyLoadedImage({ src, alt }: { src: string; alt: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  // Observe the image ref. Returns true once the image has been visible.
  const hasBeenVisible = useHasBeenVisible(imageRef, { threshold: 0.1 }); // Trigger when 10% visible

  return (
    <div ref={imageRef} style={{ minHeight: '200px', border: '1px solid lightgray', marginBottom: '10px' }}>
      {hasBeenVisible ? (
        <img src={src} alt={alt} style={{ maxWidth: '100%' }} />
      ) : (
        <p>Loading image when visible...</p>
      )}
      <p>(Has been visible: {hasBeenVisible.toString()})</p>
    </div>
  );
}

function App() {
  return (
    <div style={{ height: '300vh', paddingTop: '50vh' }}>
        <h1>Scroll Down</h1>
        <p>The image below will load only once it becomes visible.</p>
        <LazyLoadedImage src="https://via.placeholder.com/300" alt="Placeholder Image" />
        <p>Scroll further down or back up. The image stays loaded.</p>
    </div>
  );
}

export default App;
```

## Parameters

- **`elementRef`**: `RefObject<Element>` (Required)
  - A React ref object attached to the DOM element you want to track for visibility.
- **`observerOptions`**: `IntersectionObserverInit` (Optional)
  - Standard options object for the underlying `IntersectionObserver` (e.g., `root`, `rootMargin`, `threshold`). Defaults will be used if omitted.

## Return Value

- **`boolean`**
  - Returns `true` if the element referenced by `elementRef` has entered the viewport at least once according to the `observerOptions`.
  - Returns `false` initially and until the element becomes visible for the first time.
  - **Important:** Once it returns `true`, it will continue to return `true` for the lifetime of the component instance, even if the element scrolls out of view.

## Notes

- Relies on the `IntersectionObserver` API, which is widely supported in modern browsers.
- Internally uses `useIntersectionObserver` to monitor the element's intersection state.
- The state update logic ensures that the `hasBeenVisible` flag is set to `true` only once.
