# useIntervalWhen

A custom hook that sets up an interval (`setInterval`) which only runs when a specific condition is met.

This hook is similar to `setInterval`, but provides a `when` option to control whether the interval is active. The interval is automatically cleared on component unmount or when the `delay` or `when` condition changes such that the interval should stop.

## Usage

```jsx
import React, { useState, useEffect } from 'react';
import { useIntervalWhen } from '@supunlakmal/hooks'; // Adjust import path

function ConditionalCounter() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [delay, setDelay] = useState(1000); // Interval delay in ms

  useIntervalWhen(
    () => {
      setCount((c) => c + 1);
      console.log('Interval tick! Count:', count + 1);
    },
    delay,
    {
      when: isRunning, // Only run the interval when isRunning is true
      startImmediate: true, // Run the callback immediately when isRunning becomes true
    }
  );

  return (
    <div>
      <h2>Conditional Interval Counter</h2>
      <p>Count: {count}</p>
      <p>Interval Delay: {delay}ms</p>
      <p>Status: {isRunning ? 'Running' : 'Paused'}</p>

      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>

      <button onClick={() => setDelay(prev => (prev === 1000 ? 500 : 1000))}>
        Toggle Delay (500ms / 1000ms)
      </button>

      <button onClick={() => setCount(0)}>Reset Count</button>
    </div>
  );
}

export default ConditionalCounter;

```

## API

`useIntervalWhen(callback, delay, options?)`

### Parameters

-   **`callback`**: `() => void`
    -   The function to be executed at each interval when the condition is met.
-   **`delay`**: `number | null | undefined`
    -   The interval duration in milliseconds.
    -   The interval is paused (will not run) if `delay` is `null`, `undefined`, or if the `when` option is `false`.
-   **`options`**: `object` (optional)
    An object containing configuration options:
    -   `when?`: `boolean` - A condition controlling whether the interval should run. Defaults to `true`. The interval is active only when `when` is `true` and `delay` is a valid number.
    -   `startImmediate?`: `boolean` - If `true`, the `callback` function is executed immediately once the interval becomes active (i.e., when `when` is `true` and `delay` is valid, or when these conditions become true after being false). Defaults to `false`.

### Returns

-   `void` - This hook does not return any value.
