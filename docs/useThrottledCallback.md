# `useThrottledCallback` Hook

## Description

The `useThrottledCallback` hook is used to throttle a callback function, limiting the rate at which it can be executed. This is particularly useful for event handlers that fire rapidly, such as scroll, resize, or mousemove events, where executing the callback on every event can be performance-intensive. By throttling, you can ensure the callback is only executed at most once within a specified time window.

## Usage

Here's an example of how to use the `useThrottledCallback` hook:

```
typescript
import { useThrottledCallback } from '@supunlakmal/hooks';
import { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);

  const throttledIncrement = useThrottledCallback((value: number) => {
    setCount((prevCount) => prevCount + value);
  }, 1000); // Throttle to once per second

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => throttledIncrement(1)}>Increment (Throttled)</button>
      <button onClick={() => setCount((prevCount) => prevCount + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## API

```
typescript
function useThrottledCallback<T extends any[]>(
  callback: (...args: T) => void,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean }
): (...args: T) => void;
```

## Parameters

- **`callback`**: `(...args: T) => void`
  - Type: `function`
  - Description: The callback function to be throttled. It can accept any number of arguments.
- **`delay`**: `number`
  - Type: `number`
  - Description: The time delay in milliseconds during which the callback will be throttled.
- **`options`**: `object` (optional)
  - Type: `{ leading?: boolean; trailing?: boolean }`
  - Description: An optional object to control the throttling behavior.
    - **`leading`**: `boolean` (optional)
      - Type: `boolean`
      - Description: If true, the callback will be executed on the leading edge of the delay. Defaults to `true`.
    - **`trailing`**: `boolean` (optional)
      - Type: `boolean`
      - Description: If true, the callback will be executed on the trailing edge of the delay. Defaults to `true`.

## Returns

- **`throttledCallback`**: `(...args: T) => void`
  - Type: `function`
  - Description: A throttled version of the input callback. This function can be called with any arguments, and it will execute the original callback according to the throttle settings.

## How it Works

The `useThrottledCallback` hook utilizes the `useRef` hook to maintain references to a timer and the last executed timestamp. It uses `useCallback` to memoize the throttled callback function. Here's a breakdown:

1.  **Timer and Last Executed Timestamp:** It uses refs to store the timer ID and the timestamp of the last execution.
2.  **Throttling Logic:** When the throttled callback is invoked, it checks if the delay has passed since the last execution. If so, it executes the callback immediately.
3.  **Leading and trailing**: we can config the leading and trailing logic.
4.  **Cleanup:** A cleanup function is used to clear the timeout when the component unmounts, preventing potential memory leaks.
5.  **useCallback**: use to memoize the throtteled function.
