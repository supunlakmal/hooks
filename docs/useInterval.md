# `useInterval` Hook

A declarative hook for setting intervals (`setInterval`) in React components. It ensures the callback always uses the latest props/state and handles clearing the interval automatically.

## Usage

```typescript
import React, { useState } from "react";
import { useInterval } from "@supunlakmal/hooks"; // Adjust path

function IntervalCounter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      // This callback uses the latest `count` state
      setCount(count + 1);
    },
    isRunning ? 1000 : null // Interval runs every 1 second if isRunning is true, otherwise it's paused (null delay)
  );

  return (
    <div>
      <h1>useInterval Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Resume"}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default IntervalCounter;
```

## API

### Parameters

- `callback`: The function (`() => void`) to be executed repeatedly at the specified interval.
- `delay`: The interval duration in milliseconds (`number`). If `delay` is set to `null` or `undefined`, the interval is cleared and not rescheduled (effectively pausing it).

### Returns

None (`void`).

## How it Works

This hook works very similarly to the `useTimeout` hook, but uses `setInterval` instead of `setTimeout`.

1.  **Callback Ref**: Uses `useRef` (`savedCallback`) to store the latest version of the `callback` function. This avoids issues where an interval might capture a stale version of the callback or its dependencies.
2.  **Updating Callback Ref**: An `useEffect` hook updates `savedCallback.current` whenever the `callback` prop changes.
3.  **Interval Setup Effect**: Another `useEffect` hook manages the `setInterval` logic, depending only on the `delay`.
    - It checks if `delay` is `null` or `undefined`. If so, it returns early, clearing any existing interval and preventing a new one from being set.
    - If `delay` is a valid number, it defines a `tick` function that simply calls `savedCallback.current()`.
    - It calls `setInterval(tick, delay)` and stores the returned interval ID.
4.  **Cleanup**: The interval setup effect returns a cleanup function that calls `clearInterval(id)`.
    - This runs when the component unmounts or _before_ the effect runs again due to a change in the `delay`.
    - This ensures that changing the `delay` (e.g., setting it to `null` to pause) correctly clears the old interval before potentially setting a new one (or stopping altogether).
