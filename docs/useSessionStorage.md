# `useSessionStorage` Hook

A hook that behaves like `useState` but persists the state in the browser's `sessionStorage` for the duration of the browser session. The value is automatically read from session storage on initial render and saved whenever it changes.

**Note:** `sessionStorage` data is cleared when the browser tab/window is closed.

## Usage

```typescript
import React from "react";
import { useSessionStorage } from "@supunlakmal/hooks"; // Adjust path

function SessionCounter() {
  // State will be persisted in sessionStorage under the key 'session-count'
  // Initial value is 0 if nothing is found in sessionStorage
  const [count, setCount] = useSessionStorage<number>("session-count", 0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const reset = () => {
    setCount(0); // Set back to initial value
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "15px", margin: "20px 0" }}
    >
      <h2>Session Counter</h2>
      <p>This counter's value persists in sessionStorage.</p>
      <p>
        Try refreshing the page or opening this component in a new tab (within
        the same session).
      </p>
      <p>Closing the tab/window will reset it.</p>

      <h3>Count: {count}</h3>
      <button onClick={increment}>Increment</button>
      <button onClick={reset} style={{ marginLeft: "10px" }}>
        Reset to 0
      </button>
    </div>
  );
}

export default SessionCounter;
```

## API

### Parameters

- `key`: `string` - The key under which the value will be stored in `sessionStorage`.
- `initialValue`: `T | (() => T)` - The initial value to use if the key is not found in `sessionStorage`. Can be a value directly or a function that returns the initial value (lazy initialization).

### Returns

A tuple `[storedValue, setValue]` similar to `useState`:

1.  `storedValue`: `T` - The current value of the state, retrieved from `sessionStorage` or the `initialValue`.
2.  `setValue`: `Dispatch<SetStateAction<T>>` - A function to update the state. It accepts either a new value or a function that receives the previous value and returns the new value. Calling this function updates both the React state and the value in `sessionStorage`.

## How it Works

1.  **Helper Function `getSessionStorageValue`**:
    - Safely attempts to read the item associated with the `key` from `window.sessionStorage`.
    - Handles potential errors during parsing (if the stored value is not valid JSON) or accessing storage.
    - Handles server-side rendering or environments where `sessionStorage` might not be available.
    - Returns the parsed value if found and valid, otherwise returns the `initialValue` (executing it if it's a function).
2.  **State Initialization**: Uses `useState` to manage the state (`storedValue`). The initial state is determined by calling `getSessionStorageValue` lazily (passing the function to `useState`).
3.  **Wrapped Setter**: Uses `useCallback` to create a memoized `setValue` function.
    - This function mimics the `useState` setter, allowing a new value or an update function to be passed.
    - It first calculates the `valueToStore`.
    - It updates the internal React state using `setStoredValue`.
    - It then attempts to save the `valueToStore` to `sessionStorage` after JSON-stringifying it.
    - Includes basic error handling for the `sessionStorage.setItem` call.
4.  **Sync on Key Change**: Uses `useEffect` to re-read the value from `sessionStorage` using `getSessionStorageValue` if the `key` prop changes.
5.  **Return Value**: Returns the `storedValue` state and the memoized `setValue` function in a tuple, mirroring the `useState` API.

_(Note: Unlike `useLocalStorage`, this hook doesn't typically listen for the global `storage` event, as that event doesn't fire for `sessionStorage` changes according to the specification. Syncing state between components using the same `sessionStorage` key usually relies on standard React state management or context.)_
