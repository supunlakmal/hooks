# `useIdleTimer` Hook

Monitors user activity within the browser window and triggers callbacks when the user becomes idle or active again after a period of inactivity.

## Usage

```typescript
import React, { useState } from "react";
import { useIdleTimer } from "@supunlakmal/hooks"; // Adjust the import path as needed

function IdleTimeoutComponent() {
  const [status, setStatus] = useState("Active");
  const [showWarning, setShowWarning] = useState(false);

  const handleOnIdle = () => {
    setStatus("Idle");
    setShowWarning(true);
    console.log("User is idle. Showing warning.");
    // Example: Show a modal, log out user, etc.
  };

  const handleOnActive = () => {
    setStatus("Active");
    setShowWarning(false);
    console.log("User is active again.");
  };

  // Set idle timeout to 5 seconds (5000 ms)
  // Debounce activity events by 500ms to avoid excessive timer resets on scroll/mousemove
  const isIdle = useIdleTimer({
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    timeout: 5000,
    debounce: 500,
  });

  return (
    <div>
      <h1>useIdleTimer Demo</h1>
      <p>
        Current Status: <strong>{status}</strong> (Hook reports idle:{" "}
        {isIdle ? "Yes" : "No"})
      </p>
      <p>
        Stop moving your mouse, typing, or scrolling for 5 seconds to trigger
        the idle state.
      </p>

      {showWarning && (
        <div
          style={{
            padding: "20px",
            border: "2px solid red",
            marginTop: "20px",
          }}
        >
          <h2>Inactivity Warning!</h2>
          <p>You have been idle for a while.</p>
          <button onClick={handleOnActive}>I'm still here!</button>{" "}
          {/* Activity will reset the timer */}
        </div>
      )}
    </div>
  );
}

export default IdleTimeoutComponent;
```

## API

### Parameters

The hook takes a single configuration object (`UseIdleTimerProps`) with the following properties:

- `onIdle`: A required callback function (`() => void`) that is executed when the user becomes idle (i.e., after the `timeout` duration without any detected activity).
- `onActive`: An optional callback function (`() => void`) that is executed when the user becomes active again after having been in an idle state.
- `timeout`: A required number (`number`) specifying the duration of inactivity (in milliseconds) after which the `onIdle` callback should be triggered.
- `debounce`: An optional number (`number`, defaults to `0`) specifying the debounce interval (in milliseconds) for activity events. This helps to prevent the timer from being reset too frequently during continuous activity like scrolling or mouse movement. If set to `0`, activity is handled immediately.

### Returns

- A boolean (`boolean`). Returns `true` if the user is currently considered idle, and `false` otherwise.

## How it Works

1.  **State and Refs**: Uses `useState` to track the `isIdle` status. Uses `useRef` to hold the `setTimeout` ID for the main idle timer (`timer`), the debounce timer (`eventDebounceTimer`), and the timestamp of the last detected activity (`lastActivityTime`).
2.  **Callbacks**: Wraps `onIdle`, `handleIdle`, `resetTimer`, `handleActivity`, and `debouncedActivityHandler` in `useCallback` for memoization and stable references.
3.  **`handleIdle`**: Sets `isIdle` to `true` and calls the provided `onIdle` callback.
4.  **`resetTimer`**: Clears any existing idle timer and sets a new one using `setTimeout` with the specified `timeout` duration, which will call `handleIdle` when it expires.
5.  **`handleActivity`**: Updates `lastActivityTime`. If the user _was_ idle (`isIdle` is true), it sets `isIdle` back to `false` and calls `onActive` if provided. Crucially, it then calls `resetTimer` to restart the idle countdown.
6.  **`debouncedActivityHandler`**: If `debounce` is greater than 0, this function clears any pending debounce timeout and sets a new one to call `handleActivity` after the `debounce` interval. If `debounce` is 0, it calls `handleActivity` directly.
7.  **Effect for Listeners**: An `useEffect` hook runs on mount:
    - It calls `resetTimer` to start the initial idle countdown.
    - It iterates over a list of default browser events (`mousemove`, `keydown`, `mousedown`, `touchstart`, `scroll`) and adds event listeners to the `window` for each, calling the `debouncedActivityHandler` when triggered.
8.  **Cleanup**: The `useEffect` returns a cleanup function that:
    - Clears the main `timer` and the `eventDebounceTimer`.
    - Removes all the event listeners attached in the effect.
9.  **Dependencies**: The main effect depends on `resetTimer` and `debouncedActivityHandler` to ensure listeners are updated if these handlers change (though they are memoized).
