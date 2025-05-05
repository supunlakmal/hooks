# `usePrevious` Hook

Tracks the previous value of a given state or prop from the last render.

## Usage

```typescript
import React, { useState } from "react";
import { usePrevious } from "@supunlakmal/hooks"; // Adjust the import path as needed

function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  // Get the previous value of count
  const prevCount = usePrevious(count);

  return (
    <div>
      <h1>Counter</h1>
      <p>Current Count: {count}</p>
      {/* prevCount will be undefined on the first render */}
      <p>Previous Count: {prevCount ?? "N/A"}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}

export default CounterWithPrevious;
```

## API

### Parameters

- `value`: The value (`T`) whose previous state you want to track (can be state, props, or any other value that changes between renders).

### Returns

- The value (`T | undefined`) that the `value` parameter held during the _previous_ render cycle. It returns `undefined` on the initial render, as there is no previous value yet.

## How it Works

1.  **Ref Initialization**: Uses `useRef` to create a ref object (`ref`). The ref is initialized to `undefined`. Refs persist across renders without causing re-renders themselves.
2.  **Effect for Update**: Uses `useEffect` to update the ref. This effect runs _after_ the component renders.
    - Inside the effect, it sets `ref.current` to the current `value`.
    - The effect depends on `[value]`, so it only runs when the `value` changes.
3.  **Return Value**: The hook _returns_ `ref.current`. Crucially, this happens _before_ the `useEffect` runs for the current render. Therefore, the returned value is the value stored in the ref from the _previous_ render cycle.

**Render Cycle Example:**

1.  **Initial Render**: `value` is 0. `useRef` initializes `ref.current` to `undefined`. Hook returns `ref.current` (`undefined`). After render, `useEffect` runs, setting `ref.current` to 0.
2.  **Second Render**: `value` is 1. Hook returns `ref.current` (which is still 0 from the end of the last render). After render, `useEffect` runs, setting `ref.current` to 1.
3.  **Third Render**: `value` is 2. Hook returns `ref.current` (which is 1). After render, `useEffect` runs, setting `ref.current` to 2. And so on.
