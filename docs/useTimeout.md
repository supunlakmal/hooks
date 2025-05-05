# `useTimeout` Hook

A declarative hook for setting timeouts (`setTimeout`) in React components. It handles clearing the timeout automatically on unmount or when the delay changes.

## Usage

```typescript
import React, { useState } from "react";
import { useTimeout } from "@supunlakmal/hooks"; // Adjust path

function TimeoutDemo() {
  const [message, setMessage] = useState("Waiting for timeout...");
  const [showButton, setShowButton] = useState(true);

  const triggerTimeout = () => {
    setMessage("Timeout finished after 3 seconds!");
    setShowButton(false); // Hide button after timeout
  };

  // Set timeout only when the button is visible
  useTimeout(triggerTimeout, showButton ? 3000 : null);

  const resetDemo = () => {
    setMessage("Waiting for timeout...");
    setShowButton(true);
  };

  return (
    <div>
      <h1>useTimeout Demo</h1>
      <p>{message}</p>
      {showButton ? (
        <p>The message will change in 3 seconds.</p>
      ) : (
        <button onClick={resetDemo}>Reset Demo</button>
      )}
    </div>
  );
}

export default TimeoutDemo;
```

## API

### Parameters

- `callback`: The function (`() => void`) to be executed after the timeout period.
- `delay`: The timeout duration in milliseconds (`number`). If `delay` is set to `null` or `undefined`, the timeout is cleared and not rescheduled.

### Returns

None (`void`).

## How it Works

1.  **Callback Ref**: Uses `useRef` (`savedCallback`) to store the latest version of the `callback` function. This ensures that the `setTimeout` always calls the most recent callback, even if the callback function itself changes identity between renders (which can happen if it depends on props or state without being memoized).
2.  **Updating Callback Ref**: An `useEffect` hook runs whenever the `callback` dependency changes. It updates `savedCallback.current` to the new `callback`.
3.  **Timeout Setup Effect**: Another `useEffect` hook is responsible for managing the `setTimeout` itself. This effect depends only on the `delay`.
    - It checks if `delay` is `null` or `undefined`. If so, it returns early, effectively clearing any existing timeout via the cleanup function and not setting a new one.
    - If `delay` is a valid number, it defines a `tick` function that calls the `savedCallback.current`.
    - It calls `setTimeout(tick, delay)` and stores the returned timeout ID.
4.  **Cleanup**: The timeout setup effect returns a cleanup function. This function calls `clearTimeout(id)`.
    - This cleanup runs when the component unmounts.
    - It also runs _before_ the effect runs again if the `delay` changes. This ensures that if the delay changes, the previous timeout is cleared before the new one is set.
