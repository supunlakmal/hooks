# useRafState

A React hook behaving like `useState`, but deferring state updates to the next browser animation frame using `requestAnimationFrame`.

This can be useful for optimizing updates related to visual changes or animations, potentially preventing layout thrashing by batching state updates just before the browser repaints.

## Usage

```tsx
import React, { useCallback } from 'react';
import { useRafState } from './hooks/useRafState'; // Adjust import path

function RafComponent() {
  const [position, setPosition] = useRafState({ x: 0, y: 0 });

  // Example: Update state rapidly based on mouse movement, but batched by rAF
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // This update will be scheduled for the next animation frame
      setPosition({ x: event.clientX, y: event.clientY });
    },
    [setPosition]
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: '300px',
        height: '200px',
        border: '1px solid black',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <p>Move mouse over this area.</p>
      <p>Position (updated via rAF):</p>
      <p>
        X: {position.x}, Y: {position.y}
      </p>
    </div>
  );
}

export default RafComponent;
```

## API

`useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>]`

### Parameters

- `initialState`: The initial value for the state, or a function that returns the initial value (similar to `useState`).

### Return Value

- A tuple `[state, dispatch]`, exactly like `useState`:
  - `state`: The current state value.
  - `dispatch`: A function to update the state. It accepts either a new state value or a function that receives the previous state and returns the new state. The actual update is scheduled using `requestAnimationFrame`.

### Notes

- If multiple updates are dispatched before the next animation frame, only the latest update scheduled will be applied (because subsequent calls cancel previous pending `requestAnimationFrame` requests for this hook instance).
- Useful for high-frequency updates that only need to reflect visually in the next frame (e.g., tracking mouse position for an effect, scroll position).
- Don't use this if you need the state update to be synchronous or reflected immediately for logic purposes.
- The hook ensures that any pending animation frame is cancelled when the component unmounts.
