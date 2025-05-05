# `useRouteChange` Hook

Executes a callback function whenever the browser's URL path changes. It detects changes triggered by both browser navigation (back/forward buttons via `popstate`) and programmatic navigation using `history.pushState` or `history.replaceState` (commonly used by SPA routers).

**Dependency:** Relies on `useEventListener`.

**Note:** This hook modifies the global `history.pushState` and `history.replaceState` methods to dispatch a custom event. This is generally safe but could potentially interfere with other libraries that also modify these methods heavily, though conflicts are rare.

## Usage

```typescript
import React, { useState, useEffect } from "react";
import { useRouteChange } from "@supunlakmal/hooks"; // Adjust path

// Simple simulation of programmatic navigation
const navigate = (path: string) => {
  console.log(`Navigating to ${path}...`);
  window.history.pushState({}, "", path);
  // Note: Routers like React Router handle this internally
};

function RouteChangeLogger() {
  const [routeChanges, setRouteChanges] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleRouteChange = () => {
    const newPath = window.location.pathname;
    console.log(`Route changed to: ${newPath}`);
    setRouteChanges((prev) => [
      ...prev,
      `Navigated to ${newPath} at ${new Date().toLocaleTimeString()}`,
    ]);
    setCurrentPath(newPath); // Update state to reflect current path
  };

  // Register the callback
  useRouteChange(handleRouteChange);

  // Effect to update path initially if needed (useRouteChange handles subsequent changes)
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "15px", margin: "20px 0" }}
    >
      <h2>Route Change Listener</h2>
      <p>
        Current Path (from state): <strong>{currentPath}</strong>
      </p>
      <p>Try using the browser back/forward buttons or the buttons below.</p>

      {/* Buttons to simulate programmatic navigation */}
      <button onClick={() => navigate("/home")}>Go to /home</button>
      <button onClick={() => navigate("/about")} style={{ marginLeft: "10px" }}>
        Go to /about
      </button>
      <button
        onClick={() => navigate("/products?id=123")}
        style={{ marginLeft: "10px" }}
      >
        Go to /products?id=123
      </button>
      <button
        onClick={() => window.history.back()}
        style={{ marginLeft: "20px" }}
      >
        Browser Back
      </button>

      <h3>Route Change Log:</h3>
      {routeChanges.length === 0 ? (
        <p>No route changes detected yet.</p>
      ) : (
        <ul
          style={{
            maxHeight: "150px",
            overflowY: "auto",
            border: "1px solid #eee",
            padding: "10px",
          }}
        >
          {routeChanges.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RouteChangeLogger;
```

## API

### Parameters

- `onChange`: `() => void` - The callback function to execute when a route change is detected.

### Returns

None (`void`).

## How it Works

1.  **Callback Ref**: Uses `useRef` (`savedOnChange`) to store the latest `onChange` callback provided to the hook. This ensures the listeners always call the most up-to-date function.
2.  **Update Callback Ref Effect**: An `useEffect` updates `savedOnChange.current` whenever the `onChange` prop changes.
3.  **History Change Handler**: Defines `handleHistoryChange` which simply calls `savedOnChange.current()`.
4.  **Event Listeners**: Uses `useEventListener` to listen for two events on the `window`:
    - `popstate`: This standard event fires when the active history entry changes due to user navigation (back/forward buttons, `history.go()` calls).
    - `historystatechange` (Custom Event): Listens for a custom event dispatched by the patched `history` methods.
5.  **Patching History Methods Effect**: A separate `useEffect` with an empty dependency array (`[]`) runs once on mount to modify the browser's history API:
    - **Environment Check**: Ensures it's running in a browser with `window.history` available.
    - **Store Originals**: Stores references to the original `history.pushState` and `history.replaceState` methods.
    - **Wrap `pushState`**: Overwrites `history.pushState` with a new function. This function first calls the original `pushState` with the provided arguments and then dispatches a `CustomEvent` named `historystatechange` on the `window`.
    - **Wrap `replaceState`**: Similarly overwrites `history.replaceState` to call the original method and then dispatch the same custom event.
    - **Cleanup**: Returns a cleanup function that restores the original `pushState` and `replaceState` methods when the component unmounts, preventing potential side effects in other parts of the application or after the component is gone.
6.  **Callback Execution**: When either `popstate` or the custom `historystatechange` event occurs, the `handleHistoryChange` listener is called, which in turn executes the latest `onChange` callback stored in the ref.
