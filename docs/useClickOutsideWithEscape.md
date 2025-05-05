# useClickOutsideWithEscape

A custom React hook that triggers a callback function when the user either clicks outside of a specified DOM element or presses the 'Escape' key. It conveniently combines the functionality of `useClickOutside` and `useKeyPress`.

This is particularly useful for closing modals, dropdown menus, or sidebars when the user interacts outside of them or uses the standard 'Escape' key shortcut.

## Usage

```jsx
import { useRef, useState } from 'react';
import { useClickOutsideWithEscape } from '@supunlakmal/hooks'; // Adjust import path

function ModalComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Callback to close the modal
  const closeModal = () => {
    setIsOpen(false);
    console.log('Modal closed by outside click or Escape key.');
  };

  // Attach the hook to the modal's ref and provide the callback
  useClickOutsideWithEscape(modalRef, closeModal);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen && (
        <div
          ref={modalRef}
          style={{
            border: '1px solid black',
            padding: '20px',
            marginTop: '10px',
            background: 'lightgray',
          }}
        >
          <h2>Modal Content</h2>
          <p>Click outside this box or press 'Escape' to close.</p>
        </div>
      )}
    </div>
  );
}

export default ModalComponent;
```

## Parameters

-   **`ref`**: `RefObject<T extends HTMLElement>` (Required)
    -   A React ref object attached to the DOM element you want to monitor for clicks outside of.
-   **`callback`**: `() => void` (Required)
    -   The function that will be executed when a click occurs outside the referenced element OR when the 'Escape' key is pressed.

## Return Value

-   **`void`**
    -   This hook does not return any value. Its purpose is to trigger the provided callback based on user interactions.

## Notes

-   Internally, this hook utilizes `useClickOutside` to detect clicks outside the element and `useKeyPress` to detect 'Escape' key presses.
-   Ensure the `ref` is correctly attached to the container element whose outside clicks should trigger the callback.
