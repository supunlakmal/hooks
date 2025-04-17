# `useLongPress` Hook

Detects long press gestures (holding down the mouse button or touch) on a target element.

## Usage

Attach a ref to the element you want to monitor and pass the ref along with a callback function to the hook. You can also provide options to customize the behavior.

```typescript
import React, { useRef } from "react";
import { useLongPress } from "@supunlakmal/hooks"; // Adjust path

function LongPressButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLongPress = (event: MouseEvent | TouchEvent) => {
    console.log("Long press detected!", event);
    alert("Long press!");
  };

  const handlePressStart = (event: MouseEvent | TouchEvent) => {
    console.log("Press started", event);
  };

  const handlePressEnd = (event: MouseEvent | TouchEvent) => {
    console.log("Press ended (or cancelled)", event);
  };

  const handlePressCancel = (event: MouseEvent | TouchEvent) => {
    console.log("Press cancelled (e.g., moved mouse away)", event);
  };

  useLongPress(buttonRef, handleLongPress, {
    threshold: 500, // Custom threshold: 500ms
    onStart: handlePressStart,
    onEnd: handlePressEnd,
    onCancel: handlePressCancel,
  });

  return (
    <div>
      <p>Press and hold the button below:</p>
      <button
        ref={buttonRef}
        style={{
          padding: "15px 30px",
          fontSize: "16px",
          cursor: "pointer",
          border: "1px solid #ccc",
          borderRadius: "4px",
          userSelect: "none", // Prevent text selection during press
        }}
      >
        Hold Me
      </button>
    </div>
  );
}

export default LongPressButton;
```

## API

```typescript
function useLongPress<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (event: MouseEvent | TouchEvent) => void,
  options?: {
    threshold?: number; // Default: 400 (ms)
    onStart?: (event: MouseEvent | TouchEvent) => void; // Optional: Called when press starts
    onEnd?: (event: MouseEvent | TouchEvent) => void; // Optional: Called when press ends/cancels
    onCancel?: (event: MouseEvent | TouchEvent) => void; // Optional: Called specifically when press is cancelled before threshold
  }
): void;
```

### Parameters

- `ref`: `RefObject<T>` - A React ref object attached to the target HTML element (`T` extends `HTMLElement`).
- `callback`: `(event: MouseEvent | TouchEvent) => void` - The function to execute when a long press is successfully detected (i.e., the threshold duration is met).
- `options`: (Optional) `object` - Configuration options:
  - `threshold`: (Optional) `number` - The duration in milliseconds that the element must be pressed to trigger the `callback`. Defaults to `400`.
  - `onStart`: (Optional) `(event: MouseEvent | TouchEvent) => void` - A callback function fired immediately when the mouse button or touch is pressed down on the target element.
  - `onEnd`: (Optional) `(event: MouseEvent | TouchEvent) => void` - A callback function fired when the press interaction ends, either by releasing the mouse button/touch or by canceling the press (e.g., moving the mouse cursor off the element, `touchcancel` event). This fires regardless of whether the long press threshold was met.
  - `onCancel`: (Optional) `(event: MouseEvent | TouchEvent) => void` - A callback function fired specifically when the press is cancelled _before_ the `threshold` is met (e.g., releasing early, moving mouse/finger away). This provides a way to distinguish a deliberate cancellation from a successful completion (long press or short tap).

### Returns

- `void` - This hook does not return any value. It works by attaching event listeners to the element referenced by the `ref`.

## How it Works

1.  **Refs**: Uses `useRef` to store the `setTimeout` timer ID (`timeoutRef`) and the specific event target (`targetRef`) when a press starts.
2.  **Timer Management**: Uses `setTimeout` to trigger the `callback` after the specified `threshold`. `clearTimeout` is used to cancel the timer if the press ends or is cancelled before the threshold.
3.  **Event Handlers**: Uses `useCallback` to memoize event handler functions (`start`, `cancel`, `onLongPress`, and the specific mouse/touch handlers).
    - `start`: Called on `mousedown` or `touchstart`. It stores the event target, calls `onStart` (if provided), clears any existing timer, and starts a new `setTimeout` for the `threshold`.
    - `cancel`: Called on `mouseup`, `mouseleave`, `touchend`, or `touchcancel`. It calls `onEnd` (if provided and the target matches), calls `onCancel` (if provided and a timer was active), and clears the timer.
    - `onLongPress`: The function passed to `setTimeout`. It calls the main `callback` if the press duration met the threshold and the event target hasn't changed, then clears the timer.
4.  **Event Listeners**: An `useEffect` hook attaches the necessary event listeners (`mousedown`, `mouseup`, `mouseleave`, `touchstart`, `touchend`, `touchcancel`) to the element provided by the `ref`. It uses `passive: true` for `touchstart` for better scroll performance. It returns a cleanup function to remove these listeners when the component unmounts or the `ref` changes, and also clears any active timer.
