# useSyncedLocalStorage

The `useSyncedLocalStorage` hook provides a state management mechanism similar to `useState`, but with two key enhancements:

1.  **Persistence:** The state value is automatically saved to the browser's `localStorage` under a specified key.
2.  **Synchronization:** Changes made to the value in one browser tab or window are automatically reflected in other tabs/windows using the same hook with the same key, thanks to listening for the `storage` event.

## Usage

```jsx
import React from 'react';
import { useSyncedLocalStorage } from '@supunlakmal/hooks'; // Assuming installation

function SyncedSettingsComponent({ storageKey = 'userTheme' }) {
  // Use the hook to manage the theme setting
  const [theme, setTheme] = useSyncedLocalStorage(storageKey, 'light'); // Default to 'light'

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Apply the theme (example)
  React.useEffect(() => {
    document.body.className = `theme-${theme}`;
    console.log(`Theme updated to: ${theme} in this tab.`);
  }, [theme]);

  return (
    <div>
      <h2>useSyncedLocalStorage Example</h2>
      <p>Current Theme: <strong>{theme}</strong></p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p><i>Open this component in another tab with the same key ('{storageKey}') to see synchronization.</i></p>

      <style>{`
        .theme-light { background-color: #fff; color: #333; }
        .theme-dark { background-color: #333; color: #fff; }
      `}</style>
    </div>
  );
}

export default SyncedSettingsComponent;
```

## API

### Parameters

-   `key`: `string`
    -   **Required**. The key under which the value will be stored in `localStorage`.
-   `initialValue`: `T | (() => T)`
    -   **Required**. The initial value for the state if no value is found in `localStorage` for the given `key`.
    -   Can be a value of type `T` or a function `() => T` that returns the initial value (the function will only be called if needed on initialization).

### Return Value

-   `[storedValue, setValue]`: `[T, React.Dispatch<React.SetStateAction<T>>]`
    -   Returns an array similar to `useState`:
        -   `storedValue`: `T` - The current value of the state. It's read from `localStorage` initially and updated based on calls to `setValue` or `storage` events from other tabs.
        -   `setValue`: `React.Dispatch<React.SetStateAction<T>>` - A function to update the state. It accepts a new value or a function that receives the previous value and returns the new value. Calling this function updates the state in the current tab and saves the new value to `localStorage`, triggering updates in other tabs.

## Behavior

-   **Initialization:** Reads the initial state from `localStorage` based on the `key`. If the key doesn't exist or the stored value is invalid JSON, it uses the provided `initialValue`.
-   **State Updates:** When `setValue` is called, the component re-renders with the new value, and the value is serialized to JSON and saved to `localStorage`.
-   **Synchronization:** An event listener for the `storage` event is added.
    -   When a `storage` event occurs for the same `key` in another tab/window, the hook reads the `newValue` from the event.
    -   It parses the JSON and compares it (using `JSON.stringify`) to the current state.
    -   If the value from the event is different, it updates the current component's state using the internal setter reference, triggering a re-render.
-   **Serialization:** Values are stored in `localStorage` as JSON strings. Ensure the state values are JSON-serializable.
-   **Error Handling:** Includes basic error handling for `localStorage` access and JSON parsing, logging errors to the console.
-   **SSR/Browser Check:** Checks if `window` is defined, making it safe to use in environments where `localStorage` might not be available (though its primary functionality relies on the browser).
-   **Cleanup:** Removes the `storage` event listener on component unmount.
