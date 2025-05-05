# `useScrollToTop` Hook

A simple hook that returns a function to programmatically scroll the window to the top of the page. It can be configured for smooth or instant scrolling.

## Usage

Call the hook to get the `scrollToTop` function. You can then attach this function to an event handler, like a button click.

```typescript
import React, { useState, useEffect } from "react";
import { useScrollToTop } from "@supunlakmal/hooks"; // Adjust path
import { useScrollPosition } from "./useScrollPosition"; // Assuming you have this hook

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { y: scrollY } = useScrollPosition(); // Use scroll position to show/hide

  // Get the scroll function with smooth behavior
  const scrollToTop = useScrollToTop({ behavior: "smooth" });

  // Show button when scrolled down
  useEffect(() => {
    setIsVisible(scrollY > 300); // Show after scrolling 300px
  }, [scrollY]);

  if (!isVisible) {
    return null;
  }

  const buttonStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "10px 15px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    opacity: 0.8,
    transition: "opacity 0.3s ease",
  };

  return (
    <button
      style={buttonStyle}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
    >
      ↑ Top
    </button>
  );
}

// Example Parent Component
function ScrollToTopExample() {
  return (
    <div style={{ height: "200vh", padding: "20px" }}>
      <h1>useScrollToTop Example</h1>
      <p>Scroll down the page...</p>
      {/* Long content to enable scrolling */}
      <div
        style={{
          height: "180vh",
          border: "1px dashed grey",
          marginTop: "20px",
        }}
      >
        Scrollable Area
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default ScrollToTopExample;
```

## API

```typescript
interface ScrollToTopOptions {
  behavior?: ScrollBehavior; // 'auto' or 'smooth'
}

function useScrollToTop(options?: ScrollToTopOptions): () => void;
```

### Parameters

- `options`: (Optional) `ScrollToTopOptions` - An object to configure the scroll behavior:
  - `behavior`: (Optional) `ScrollBehavior` - Specifies the scrolling animation. Can be `'auto'` (instant jump, default) or `'smooth'` (animated scroll). Note that browser support for `'smooth'` may vary.

### Returns

- `() => void`: A memoized function that, when called, scrolls the window to the coordinates (0, 0).

## How it Works

1.  **`useCallback`**: The hook returns a function (`scrollToTop`) memoized with `useCallback`. The `behavior` option is included in the dependency array, so the function reference only changes if the behavior option changes.
2.  **Window Check**: Inside `scrollToTop`, it first checks if `typeof window !== 'undefined'` to ensure compatibility with server-side rendering environments where the `window` object doesn't exist.
3.  **`window.scrollTo`**: It calls `window.scrollTo()` with `top: 0`, `left: 0`, and the specified `behavior`.
4.  **Error Handling**: A `try...catch` block is included because older browsers might not support the options object in `window.scrollTo`. If an error occurs (e.g., `'smooth'` behavior is not supported), it falls back to the basic `window.scrollTo(0, 0)` for instant scrolling and logs a warning.
