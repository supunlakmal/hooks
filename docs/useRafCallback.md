# `useRafCallback` Hook

## Description

The `useRafCallback` hook provides a way to schedule a callback function to be executed on the next animation frame using `requestAnimationFrame`. This is useful for performing DOM manipulations or visual updates that need to be synchronized with the browser's rendering process, ensuring smoother animations and better performance.

## Usage
```
typescript
import { useRafCallback } from '@supunlakmal/hooks';
import { useRef } from 'react';

function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  const onRaf = useRafCallback((time) => {
    if (elementRef.current) {
      elementRef.current.style.transform = `rotate(${time / 10}deg)`;
    }
  });

  const startAnimation = () => {
    onRaf.start()
  }

  const stopAnimation = () => {
    onRaf.stop()
  }

  return (
    <div>
      <div ref={elementRef} style={{ width: '100px', height: '100px', backgroundColor: 'blue' }} />
       <button onClick={startAnimation}>start</button>
       <button onClick={stopAnimation}>stop</button>
    </div>
  );
}
```
## API
```
typescript
interface RafCallbackHelpers {
  start: () => void;
  stop: () => void;
}

type useRafCallback = (callback: (time: number) => void, enabled?: boolean) => RafCallbackHelpers;
```
## Parameters

*   `callback`: `(time: number) => void`
    *   Type: Function
    *   Description: The function to be executed on each animation frame. It receives the current time (in milliseconds) as an argument.
*   `enabled`: `boolean` (optional)
    *   Type: Boolean
    *   Description: A boolean value indicating whether the `requestAnimationFrame` should be active. If `false`, the callback will not be executed. Defaults to `true`.

## Returns

The hook returns an object with the following methods:

*   `start`: `() => void`
    *   Description: Starts the animation, scheduling the callback function to be executed on each animation frame.
* `stop`: `() => void`
    * Description: Stops the animation, unscheduling the callback function from being executed on animation frames.

## How it Works

The `useRafCallback` hook utilizes the `requestAnimationFrame` API to schedule a callback function to be executed before the next repaint.

1.  **Callback Scheduling:** The provided `callback` function is wrapped in an internal function that is passed to `requestAnimationFrame`. This internal function is called by the browser before the next repaint.
2.  **Time Parameter:** The `requestAnimationFrame` API passes a timestamp (`time`) to the internal function, representing the current time in milliseconds. This `time` is then passed to the original `callback` function.
3.  **Enabling/Disabling:** The `enabled` parameter allows you to control whether the callback is actively scheduled. When `enabled` is `false`, the hook does not call `requestAnimationFrame`, effectively pausing the animation.
4.  **Start and Stop:**  The hook returns helper functions, `start` and `stop` that allow to start and stop callback execution.
5.  **Cleanup:** When the component unmounts or the dependencies change, any pending `requestAnimationFrame` calls are canceled using `cancelAnimationFrame` to prevent memory leaks or unexpected behavior.
6. **State management:** The hook use `useRef` for managing `requestAnimationFrame` state and id.
7. **React hooks:** use `useRef`, `useEffect`.
8. **Reasoning behind implementation choices:**  `requestAnimationFrame`  is specifically designed for animations and visual updates, ensuring they are synchronized with the browser's repaint cycle. This results in smoother animations and better performance.