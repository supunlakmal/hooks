# `useUpdateEffect` Hook

A hook that functions similarly to `useEffect`, but with one key difference: it **skips** running the effect callback after the initial render (mount). The effect is only executed on subsequent renders when the specified dependencies change.

## Usage

Use it exactly like `useEffect`, providing an effect callback and an optional dependency array. The callback will not run on the first render.

```typescript
import React, { useState, useEffect } from "react";
import { useUpdateEffect } from "@supunlakmal/hooks"; // Adjust path

function UpdateEffectExample() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("Mount: Effect NOT called yet.");

  // Standard useEffect: Runs on mount AND update
  useEffect(() => {
    console.log(`useEffect: Count changed to ${count}. Runs on mount too.`);
  }, [count]);

  // useUpdateEffect: Runs ONLY on update, skips mount
  useUpdateEffect(() => {
    console.log(
      `useUpdateEffect: Count changed to ${count}. SKIPPED on mount.`
    );
    setMessage(`Update: Effect called, count is ${count}.`);
    // Can return a cleanup function, just like useEffect
    return () => {
      console.log(`useUpdateEffect: Cleanup for count ${count}.`);
    };
  }, [count]);

  return (
    <div>
      <h1>useUpdateEffect Example</h1>
      <p>Current Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment Count</button>
      <p>{message}</p>
      <p>
        Check the console to see the difference between useEffect and
        useUpdateEffect.
      </p>
    </div>
  );
}

export default UpdateEffectExample;
```

## API

```typescript
import { EffectCallback, DependencyList } from "react";

function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void;
```

### Parameters

- `effect`: `EffectCallback` - The function to execute. This function can optionally return a cleanup function, just like in `useEffect`.
- `deps`: `DependencyList` (Optional) - An array of dependencies. The `effect` will run only when one or more values in this array change, _after_ the initial render.

### Returns

- `void` - This hook does not return any value.

## How it Works

1.  **`useRef`**: A ref (`isMounted`) is used to track whether the component has already mounted. It's initialized to `false`.
2.  **`useEffect`**: The hook uses a standard `useEffect` internally, passing along the `deps` provided by the user.
3.  **Mount Check**: Inside the `useEffect` callback:
    - It checks the value of `isMounted.current`.
    - If `isMounted.current` is `true` (meaning the component has already mounted and this is an update render), it executes the user-provided `effect` function and returns its result (which might be a cleanup function).
    - If `isMounted.current` is `false` (meaning this is the initial mount/render), it sets `isMounted.current = true` and returns `undefined` (no effect execution, no cleanup needed for this skipped run).
4.  **Dependency Tracking**: React's `useEffect` handles the dependency tracking based on the `deps` array. The internal effect function (including the mount check) is re-run only when the dependencies change.
