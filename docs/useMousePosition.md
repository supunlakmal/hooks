# useMousePosition

A React hook that tracks the current position of the mouse pointer globally within the window.

## Usage

```tsx
import { useMousePosition } from './hooks/useMousePosition'; // Adjust import path

function MouseTracker() {
  const { x, y, screenX, screenY, pageX, pageY } = useMousePosition();

  return (
    <div>
      <h2>Mouse Position:</h2>
      <p>
        Viewport X: {x ?? 'N/A'}, Viewport Y: {y ?? 'N/A'}
      </p>
      <p>
        Screen X: {screenX ?? 'N/A'}, Screen Y: {screenY ?? 'N/A'}
      </p>
      <p>
        Page X: {pageX ?? 'N/A'}, Page Y: {pageY ?? 'N/A'}
      </p>
      <p style={{ fontStyle: 'italic' }}>(Move mouse over the window)</p>
    </div>
  );
}
```

## API

`useMousePosition(): Readonly<MousePosition>`

### Return Value (`MousePosition`)

An object containing the following coordinates. Values are `null` until the first `mousemove` event.

- `x: number | null`: Client X - Coordinate relative to the visible viewport.
- `y: number | null`: Client Y - Coordinate relative to the visible viewport.
- `screenX: number | null`: Coordinate relative to the user's physical screen.
- `screenY: number | null`: Coordinate relative to the user's physical screen.
- `pageX: number | null`: Coordinate relative to the top-left corner of the entire rendered page (including scrolled-out parts).
- `pageY: number | null`: Coordinate relative to the top-left corner of the entire rendered page (including scrolled-out parts).

### Notes

- The hook attaches a global `mousemove` listener to the `window`.
- The coordinates are only updated when the mouse moves.
- The initial state before any mouse movement will have `null` values.
