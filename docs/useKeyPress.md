# `useKeyPress` Hook

Detects whether a specific key on the keyboard is currently being pressed down. Returns a boolean state reflecting the key's press status.

## Usage

```typescript
import React from "react";
import { useKeyPress } from "@supunlakmal/hooks"; // Adjust the import path as needed

function KeyPressDemo() {
  const isAPressed = useKeyPress("a");
  const isShiftPressed = useKeyPress("Shift");
  const isEscapePressed = useKeyPress("Escape");
  const isEnterPressed = useKeyPress("Enter");

  return (
    <div>
      <h1>useKeyPress Demo</h1>
      <p>Try pressing the 'a', 'Shift', 'Escape', or 'Enter' keys.</p>
      <ul>
        <li>'a' key pressed? {isAPressed ? "Yes" : "No"}</li>
        <li>'Shift' key pressed? {isShiftPressed ? "Yes" : "No"}</li>
        <li>'Escape' key pressed? {isEscapePressed ? "Yes" : "No"}</li>
        <li>'Enter' key pressed? {isEnterPressed ? "Yes" : "No"}</li>
      </ul>

      {isEscapePressed && (
        <p style={{ color: "orange" }}>Escape key is currently pressed!</p>
      )}
    </div>
  );
}

export default KeyPressDemo;
```

## API

### Parameters

- `targetKey`: A string (`string`) representing the specific key to monitor. This should match the value of the `KeyboardEvent.key` property for the desired key.
  - Examples: `'a'`, `'A'`, `'Enter'`, `'Escape'`, `'ArrowUp'`, `'Tab'`, `' '` (for spacebar), `'1'`.
  - Refer to the [MDN documentation on `KeyboardEvent.key` values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) for a comprehensive list.

### Returns

- A boolean (`boolean`). Returns `true` if the `targetKey` is currently being held down, and `false` otherwise.

## How it Works

1.  **State Initialization**: Uses `useState` to keep track of whether the target key is pressed (`keyPressed`), initialized to `false`.
2.  **Event Handlers**: Defines two event handler functions:
    - `downHandler`: Listens for `keydown` events. If the `event.key` matches the `targetKey`, it sets the `keyPressed` state to `true`.
    - `upHandler`: Listens for `keyup` events. If the `event.key` matches the `targetKey`, it sets the `keyPressed` state to `false`.
3.  **Effect Setup**: Uses `useEffect` to add the `downHandler` and `upHandler` as event listeners to the `window` for the `keydown` and `keyup` events, respectively.
4.  **Cleanup**: The `useEffect` hook returns a cleanup function. This function removes both event listeners from the `window` when the component unmounts or when the `targetKey` dependency changes. This prevents memory leaks.
5.  **Dependency Array**: The effect depends on `targetKey`. If the `targetKey` prop changes, the old listeners are removed, and new ones are added for the new key.
