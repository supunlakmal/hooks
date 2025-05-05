# `useFocusTrap` Hook

Manages keyboard focus, trapping it within a specified container element when active. This is crucial for accessibility in components like modals, dialogs, and off-canvas menus, ensuring users cannot accidentally tab outside the intended interaction area.

## Usage

Provide a ref to the container element that should trap focus, a boolean state indicating whether the trap is active, and optionally, a ref to an element that should receive focus when the trap activates.

```typescript
import React, { useState, useRef } from "react";
import { useFocusTrap } from "@supunlakmal/hooks"; // Adjust path

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<any>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Activate focus trap when the modal is open
  useFocusTrap(modalRef, isOpen, closeButtonRef); // Focus the close button initially

  if (!isOpen) {
    return null;
  }

  // Basic modal styling
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "30px",
    background: "white",
    border: "1px solid #ccc",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1050,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 1040,
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      {/* The ref is attached to the container div */}
      <div ref={modalRef} style={modalStyle} role="dialog" aria-modal="true">
        <h2>Modal Title</h2>
        <p>Focus is trapped within this modal. Try tabbing.</p>
        <label>
          First Name: <input type="text" placeholder="Enter first name" />
        </label>
        <label>
          Last Name: <input type="text" placeholder="Enter last name" />
        </label>
        <button onClick={onClose}>Submit</button>
        {/* Initial focus is set to this button via initialFocusRef */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          style={{ marginTop: "auto" }}
        >
          Close
        </button>
      </div>
    </>
  );
}

function FocusTrapExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>useFocusTrap Example</h1>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <p style={{ marginTop: "20px" }}>
        Other focusable elements outside the modal:
      </p>
      <button>Button 1</button>
      <input type="text" placeholder="Outside Input" />
      <button>Button 2</button>
    </div>
  );
}

export default FocusTrapExample;
```

## API

```typescript
import { RefObject } from 'react';

function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T>,
  isActive: boolean,
  initialFocusRef?: RefObject<HTMLElement> // Optional
): void;
```

### Parameters

- `containerRef`: `RefObject<T>` - A React ref object pointing to the container HTML element (`T` extends `HTMLElement`) within which focus should be trapped.
- `isActive`: `boolean` - A state variable indicating whether the focus trap should currently be active. When `true`, the trap is enabled; when `false`, it's disabled, and focus is returned to the element that was focused before the trap was activated.
- `initialFocusRef`: (Optional) `RefObject<HTMLElement>` - A React ref object pointing to a specific focusable element _inside_ the container. When the trap activates, focus will be moved to this element. If omitted, focus moves to the _first_ focusable element found within the container.

### Returns

- `void` - This hook does not return any value. It operates by adding and removing a `keydown` event listener on the `document`.

## How it Works

1.  **State and Refs**: It uses a `useRef` (`previousActiveElement`) to store the element that had focus _before_ the trap was activated, so focus can be restored later.
2.  **Focusable Elements**: A `useCallback` (`getFocusableElements`) finds all focusable elements within the `containerRef` using a predefined `FOCUSABLE_SELECTORS` list and filters out elements that are not currently rendered (`offsetParent !== null`).
3.  **`handleKeyDown`**: A memoized `keydown` event handler checks for the `Tab` key.
    - If the trap is active and `Tab` is pressed, it identifies the first and last focusable elements within the container.
    - It checks if the currently focused element is the first (when Shift+Tab is pressed) or the last (when Tab is pressed), or if focus is somehow outside the container.
    - If focus is at either end (or outside), it prevents the default tabbing behavior (`event.preventDefault()`) and manually moves focus to the opposite end (last element for Shift+Tab, first element for Tab), effectively wrapping the focus.
    - If focus is within the trap but not at the ends, it allows the default browser tabbing behavior.
4.  **`useEffect`**: This effect manages the activation and deactivation of the trap based on the `isActive` prop.
    - **Activation (`isActive` becomes `true`)**: Stores the currently focused element in `previousActiveElement`, focuses the `initialFocusRef` (or the first focusable element), and adds the `handleKeyDown` listener to the `document`.
    - **Deactivation (`isActive` becomes `false`)**: Removes the `handleKeyDown` listener and restores focus to the element stored in `previousActiveElement`.
    - **Cleanup**: The effect returns a cleanup function that removes the event listener and restores focus if the component unmounts while the trap is still active.
