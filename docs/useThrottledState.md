# useThrottledState

This hook provides a way to throttle state updates. It's useful when you want to update a piece of state based on user input, but you want to limit the rate at which the state is updated, even if the user input is continuous. This is in contrast to `useDebouncedState`, which only updates after a pause in user input.

## API

### Parameters

- `initialValue`: `T` - The initial value of the state.
- `delay`: `number` (optional) - The minimum delay in milliseconds between state updates. Defaults to 500ms.

### Return Value

- `throttledValue`: `T` - The throttled value of the state. This is the value that is updated at a throttled rate.
- `setValue`: `(value: T) => void` - The function to update the state. This will update the internal state and potentially trigger a throttled update.

## Examples

```
tsx
import { useThrottledState } from '@supunlakmal/hooks';
import { ChangeEvent, useState } from 'react';

function ThrottledInput() {
  const [throttledSearchTerm, setThrottledSearchTerm] = useThrottledState<string>('', 300);
  const [immediateSearchTerm, setImmediateSearchTerm] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setThrottledSearchTerm(event.target.value);
    setImmediateSearchTerm(event.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>Immediate Search Term: {immediateSearchTerm}</p>
      <p>Throttled Search Term: {throttledSearchTerm}</p>
    </div>
  );
}
```

In this example, `throttledSearchTerm` will only be updated at most every 300ms, even if the user is typing very quickly.

## How it Works

1.  **State:** Uses `useState` to track both the immediate `value` and the `throttledValue`.
2.  **Timer:** Uses `setTimeout` to schedule updates to `throttledValue`.
3.  **Ref:** Use `useRef` to keep track of the last time the `throttledValue` updated.
4.  **Interval:** Will update the `throttledValue` in each interval.
5.  **Cleanup:** Clears the timeout if the component unmounts.
