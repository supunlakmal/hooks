# usePreviousDifferent

This hook tracks the previous _different_ value of a state variable. Unlike `usePrevious`, which always returns the immediately preceding value, `usePreviousDifferent` only updates its stored value when the current value is different from the previously stored value. This is particularly useful in scenarios where a value might frequently alternate between two states, and you only want to know when it transitions to a truly new value.

## API

### Parameters

- `value`: `T` - The current value you want to track the changes of.

### Return Value

- `previousDifferentValue`: `T | undefined` - The previous _different_ value of `value`. It will be `undefined` on the initial render, and then it will hold the last value that was different from the current one.

## Examples

```
tsx
import { usePreviousDifferent } from 'src';
import { useState } from 'react';

function PreviousDifferentExample() {
  const [count, setCount] = useState(0);
  const previousDifferentCount = usePreviousDifferent(count);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Different Count: {previousDifferentCount === undefined ? 'undefined' : previousDifferentCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count)}>Same Value</button>
    </div>
  );
}
```

In this example, `previousDifferentCount` will only update when `count` changes to a value that is different from the last stored value. Clicking `Increment` will update both, but clicking `Same Value` will only update current count.

## How It Works

1.  **`useRef` for Storage:** The hook utilizes `useRef` to maintain a persistent reference to the previous different value across renders.
2.  **`useEffect` for Comparison:** `useEffect` is used to compare the current value with the stored previous different value after each render.
3.  **Conditional Update:** If the current value is different from the stored previous different value, the stored value is updated. Otherwise, it remains unchanged.
4.  **`usePrevious` difference**: `usePrevious` hook, stores the previous value in every render. This means that if the value is not changed, then it will still update. `usePreviousDifferent` hook only update the previous different value if current value changed and it's diffrent from previous one.
