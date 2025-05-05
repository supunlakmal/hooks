# `useMediaQuery` Hook

Tracks the state of a CSS media query, returning `true` if the query currently matches and `false` otherwise. This allows components to react dynamically to changes in viewport size, orientation, color scheme, etc.

## Usage

```typescript
import React from "react";
import { useMediaQuery } from "@supunlakmal/hooks"; // Adjust the import path as needed

function ResponsiveLayout() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: prefersDarkMode ? "#333" : "#eee",
        color: prefersDarkMode ? "#eee" : "#333",
      }}
    >
      <h1>Media Query Status</h1>
      <p>
        Screen is small (max-width: 768px):{" "}
        <strong>{isSmallScreen ? "Yes" : "No"}</strong>
      </p>
      <p>
        Prefers dark mode: <strong>{prefersDarkMode ? "Yes" : "No"}</strong>
      </p>

      {isSmallScreen ? (
        <div>
          <h2>Mobile Layout</h2>
          <p>This content is specific to smaller screens.</p>
        </div>
      ) : (
        <div>
          <h2>Desktop Layout</h2>
          <p>This content is shown on larger screens.</p>
        </div>
      )}
    </div>
  );
}

export default ResponsiveLayout;
```

## API

### Parameters

- `query`: A string (`string`) representing the CSS media query to evaluate (e.g., `'(min-width: 1024px)'`, `'(orientation: landscape)'`, `'(prefers-reduced-motion: reduce)'`).

### Returns

- A boolean (`boolean`). Returns `true` if the media query currently matches the environment, `false` otherwise. It defaults to `false` on the server or before the initial client-side evaluation.

## How it Works

1.  **State Initialization**: Uses `useState` to store the boolean match status, initialized to `false`.
2.  **Environment Check**: Inside `useEffect`, it first checks if `window.matchMedia` is supported in the current environment (it only works client-side). If not, it logs a warning and exits.
3.  **Media Query List**: Creates a `MediaQueryList` object using `window.matchMedia(query)`.
4.  **Change Handler**: Defines a `handleChange` function that updates the state (`setMatches`) based on the `matches` property of the `MediaQueryListEvent` passed to it.
5.  **Initial State**: Immediately sets the initial state by checking the `matches` property of the `mediaQueryList` object (`mediaQueryList.matches`).
6.  **Event Listener**: Adds an event listener to the `mediaQueryList`. It uses the modern `addEventListener('change', ...)` method if available, falling back to the deprecated `addListener(...)` for compatibility with older browsers (like Safari < 14).
7.  **Cleanup**: The `useEffect` hook returns a cleanup function. This function removes the corresponding event listener (`removeEventListener` or `removeListener`) when the component unmounts or when the `query` dependency changes.
8.  **Dependency Array**: The effect runs whenever the `query` string changes, ensuring the hook listens to the correct media query.
