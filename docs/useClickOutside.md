# `useClickOutside` Hook

Executes a callback function when a click (or touch) event occurs outside of a specified DOM element.
This is commonly used for closing modals, dropdowns, or popovers when the user interacts with other parts of the page.

## Usage

```typescript
import React, { useState, useRef } from "react";
import { useClickOutside } from "@supunlakmal/hooks"; // Adjust the import path as needed

function ModalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null); // Create a ref for the modal element

  // Use the hook: call setIsOpen(false) when clicking outside modalRef
  useClickOutside(modalRef, () => {
    if (isOpen) {
      // Only close if it's currently open
      setIsOpen(false);
      console.log("Clicked outside, closing modal.");
    }
  });

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div
          ref={modalRef} // Attach the ref to the modal container
          style={{
            padding: "20px",
            marginTop: "10px",
            border: "1px solid black",
            backgroundColor: "white",
            display: "inline-block",
          }}
        >
          <h2>Modal Content</h2>
          <p>Click outside this box to close it.</p>
          <button onClick={() => setIsOpen(false)}>Close Manually</button>
        </div>
      )}

      <p style={{ marginTop: "20px" }}>Other page content...</p>
    </div>
  );
}

export default ModalComponent;
```

### Using a different event type (e.g., `mouseup`)

```typescript
import React, { useState, useRef } from "react";
import { useClickOutside } from "@supunlakmal/hooks";

function DropdownComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on mouseup outside the element
  useClickOutside(
    dropdownRef,
    () => {
      if (isVisible) setIsVisible(false);
    },
    "mouseup"
  ); // Specify 'mouseup' as the event type

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle Dropdown</button>
      {isVisible && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            border: "1px solid #ccc",
            background: "#fff",
            padding: "10px",
            zIndex: 10,
          }}
        >
          <p>Dropdown Item 1</p>
          <p>Dropdown Item 2</p>
        </div>
      )}
    </div>
  );
}

export default DropdownComponent;
```

## API

### Parameters

- `ref`: A `RefObject<HTMLElement>` from `useRef`. This ref must be attached to the DOM element you want to detect clicks outside of.
- `handler`: A function (`() => void`) that will be called when a click/touch occurs outside the element referenced by `ref`.
- `eventType`: (Optional) The type of event to listen for. Defaults to `'mousedown'`. Can be `'mousedown'`, `'mouseup'`, `'touchstart'`, or `'touchend'`.

### Returns

None (`void`).

## How it Works

1.  **Effect Setup**: Uses `useEffect` to set up and clean up the event listener.
2.  **Event Listener Logic**: Defines a `listener` function that takes a `MouseEvent` or `TouchEvent`.
    - It checks if the `ref` exists and if the `event.target` (the element that was clicked/touched) is contained within the `ref.current` element.
    - If the click is _inside_ the `ref` element or the `ref` doesn't exist, it does nothing.
    - If the click is _outside_, it calls the provided `handler` function.
3.  **Attaching Listener**: Adds the `listener` to the `document` for the specified `eventType` (defaulting to `mousedown`).
    - If a touch event (`touchstart` or `touchend`) is specified, it _also_ adds a `mousedown` listener as a fallback for non-touch devices or interactions.
4.  **Cleanup**: The `useEffect` hook returns a cleanup function.
    - This function removes the event listener(s) from the `document` when the component unmounts or when the dependencies (`ref`, `handler`, `eventType`) change.
5.  **Dependency Array**: The effect depends on `ref`, `handler`, and `eventType`. If any of these change, the effect re-runs, removing the old listener and adding a new one with the updated references/values.
