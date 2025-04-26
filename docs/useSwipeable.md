# useSwipeable

This hook provides a way to detect swipe gestures (left, right, up, down) on an element. It simplifies the detection of swipes and allows you to easily add callbacks for each swipe direction. This hook utilizes the `useSwipe` hook internally to detect the general swipe.

## API

### Parameters

*   `onSwipeLeft`: `() => void` (optional) - A callback function that is executed when a left swipe is detected.
*   `onSwipeRight`: `() => void` (optional) - A callback function that is executed when a right swipe is detected.
*   `onSwipeUp`: `() => void` (optional) - A callback function that is executed when an up swipe is detected.
*   `onSwipeDown`: `() => void` (optional) - A callback function that is executed when a down swipe is detected.
*   `threshold`: `number` (optional) - The minimum distance (in pixels) that the user must swipe for the gesture to be recognized. Defaults to `50`.

### Return Value

*   `ref`: `React.RefObject<HTMLElement>` - A ref that needs to be attached to the element you want to make swipeable.

## Examples
```
tsx
import { useSwipeable } from 'src';
import { useRef } from 'react';

function SwipeableExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useSwipeable({
    onSwipeLeft: () => console.log('Swiped Left!'),
    onSwipeRight: () => console.log('Swiped Right!'),
    onSwipeUp: () => console.log('Swiped Up!'),
    onSwipeDown: () => console.log('Swiped Down!'),
    threshold: 100,
  });

  return (
    <div
      ref={ref}
      style={{
        width: '200px',
        height: '200px',
        backgroundColor: 'lightblue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      Swipe Me!
    </div>
  );
}
```
## How it Works

`useSwipeable` builds upon the `useSwipe` hook to detect swipe gestures. `useSwipe` provides the general direction of the swipe. `useSwipeable` takes the general direction and calls the appropriate callback function (if provided). `useSwipeable` also allows you to specify a `threshold`, which is the minimum distance the user must swipe for the gesture to be recognized. This hook return a `ref` that need to be add to the swipeable element. The main diffrence with `useSwipe` is that `useSwipe` only return the direction of the swipe and `useSwipeable` return callback for each direction.