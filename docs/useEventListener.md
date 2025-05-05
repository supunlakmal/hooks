# `useEventListener` Hook

A robust hook for declaratively adding event listeners to the `window`, `document`, a DOM element, or a React ref. It ensures the handler always executes with the latest props/state and automatically cleans up the listener.

## Usage

### Listening to Window Events

```typescript
import React, { useState } from "react";
import { useEventListener } from "@supunlakmal/hooks"; // Adjust path

function MousePositionLogger() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Event handler using useCallback is optional but good practice if it has dependencies
  const handleMouseMove = (event: MouseEvent) => {
    setCoords({ x: event.clientX, y: event.clientY });
  };

  // Attach listener to window (default)
  useEventListener("mousemove", handleMouseMove);

  return (
    <div>
      <h1>Window Mouse Position</h1>
      <p>
        Current position: X: {coords.x}, Y: {coords.y}
      </p>
    </div>
  );
}

export default MousePositionLogger;
```

### Listening to Element Events (using Ref)

```typescript
import React, { useRef, useState } from "react";
import { useEventListener } from "@supunlakmal/hooks"; // Adjust path

function ClickCounter() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  // Attach listener to the button element via its ref
  useEventListener("click", handleClick, buttonRef);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Button Click Counter</h2>
      <button ref={buttonRef}>Click Me</button>
      <p>Button clicked: {clickCount} times</p>
    </div>
  );
}

export default ClickCounter;
```

### Listening to Document Events

```typescript
import React, { useState } from "react";
import { useEventListener } from "@supunlakmal/hooks"; // Adjust path

function KeydownLogger() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    setLastKeyPressed(event.key);
  };

  // Attach listener to document
  useEventListener("keydown", handleKeyDown, { current: document } as any); // Use document explicitly
  // Note: Type assertion might be needed depending on strictness if passing document directly

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Document Keydown Logger</h2>
      <p>Press any key.</p>
      <p>Last key pressed: {lastKeyPressed ?? "None"}</p>
    </div>
  );
}

export default KeydownLogger;
```

## API

### Parameters

- `eventName`: The name (`string`) of the event to listen for (e.g., `'click'`, `'scroll'`, `'keydown'`). The type is constrained by the event map associated with the target `element` type.
- `handler`: The callback function (`(event: Event) => void`) to execute when the event is triggered. The `event` object type is inferred based on the `eventName` and `element` type.
- `element`: (Optional) The target to attach the event listener to. Can be:
  - A React ref object (`RefObject<T>`) pointing to a DOM element.
  - A DOM element instance (e.g., `document.getElementById('my-id')`).
  - `window` (the default if this argument is omitted or `undefined`).
  - `document`.
- `options`: (Optional) An object or boolean (`boolean | AddEventListenerOptions`) specifying characteristics about the event listener (e.g., `{ capture: true, passive: true }`). Passed directly to the `addEventListener` call.

### Returns

None (`void`).

## How it Works

1.  **Handler Ref**: Uses `useRef` (`savedHandler`) to keep track of the latest `handler` function passed to the hook. This avoids the need to include `handler` in the main effect's dependency array, preventing unnecessary listener re-attachments if the handler function changes identity.
2.  **Update Handler Ref Effect**: A simple `useEffect` updates `savedHandler.current = handler` whenever the `handler` function changes.
3.  **Main Listener Effect**: The primary `useEffect` hook sets up and cleans up the event listener. It depends on `eventName`, `element`, and `options`.
    - **Target Resolution**: It determines the actual DOM element to attach the listener to. It defaults to `window` if `element` is `null` or `undefined`. If `element` is a ref object, it uses `element.current`.
    - **Validation**: It checks if the resolved `targetElement` is valid and has an `addEventListener` method. If not, it returns early.
    - **Listener Creation**: It creates an `eventListener` function. This function simply calls the handler stored in the ref: `savedHandler.current(event)`.
    - **Attaching**: It calls `targetElement.addEventListener(eventName, eventListener, options)`.
    - **Cleanup**: It returns a cleanup function that calls `targetElement.removeEventListener(eventName, eventListener, options)`.
4.  **Dependencies**: By depending on `eventName`, `element`, and `options`, the main effect ensures that the listener is correctly removed and re-added if the event type, the target element, or the listener options change.
