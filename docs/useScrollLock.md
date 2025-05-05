# useScrollLock

The `useScrollLock` hook provides functions to prevent and allow scrolling on the `<body>` element of the page. This is commonly used when displaying modals, overlays, or off-canvas menus to keep the background content fixed.

## Usage

```jsx
import React, { useState } from 'react';
import { useScrollLock } from '@supunlakmal/hooks'; // Assuming installation

function ModalExample() {
  const [showModal, setShowModal] = useState(false);
  const { isLocked, lockScroll, unlockScroll } = useScrollLock();

  const openModal = () => {
    lockScroll(); // Lock scroll when opening the modal
    setShowModal(true);
  };

  const closeModal = () => {
    unlockScroll(); // Unlock scroll when closing the modal
    setShowModal(false);
  };

  return (
    <div style={{ minHeight: '150vh', border: '2px dashed green', padding: '20px' }}>
      <h2>useScrollLock Example</h2>
      <p>Scroll down to see the button.</p>
      
      <button onClick={openModal} disabled={isLocked}>
        Open Modal (and Lock Scroll)
      </button>

      <p style={{ marginTop: '20px' }}>Scroll Locked: {isLocked ? 'Yes' : 'No'}</p>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal} // Close on backdrop click
        >
          <div 
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '5px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
          >
            <h3>Modal Content</h3>
            <p>Page scrolling should be disabled now.</p>
            <button onClick={closeModal}>Close Modal (and Unlock Scroll)</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '100vh' }}>
        Bottom of the page content.
      </div>
    </div>
  );
}

export default ModalExample;
```

## API

### Parameters

None.

### Return Value

The hook returns an object (`UseScrollLockReturn`) with the following properties:

-   `isLocked`: `boolean`
    -   Indicates whether the scroll is currently locked.
-   `lockScroll`: `() => void`
    -   A function to lock the body scroll. It saves the current `overflow` and `paddingRight` styles, sets `overflow` to `hidden`, and adds padding to compensate for the scrollbar width if necessary.
-   `unlockScroll`: `() => void`
    -   A function to unlock the body scroll. It restores the original `overflow` and `paddingRight` styles.

## Behavior

-   **State:** Maintains an internal `isLocked` state.
-   **Locking (`lockScroll`):**
    -   Checks if running in a browser and if scroll isn't already locked.
    -   Saves the current `body.style.overflow` and `body.style.paddingRight`.
    -   Calculates the scrollbar width (`window.innerWidth - document.documentElement.clientWidth`) if not already calculated. This accounts for the space the scrollbar occupies.
    -   Sets `body.style.overflow = 'hidden'` to disable scrolling.
    -   If a scrollbar existed (`scrollbarWidth > 0`), sets `body.style.paddingRight` to the calculated width to prevent content layout shifts.
    -   Sets `isLocked` state to `true`.
-   **Unlocking (`unlockScroll`):**
    -   Checks if running in a browser and if scroll is currently locked.
    -   Restores the saved `overflow` and `paddingRight` styles to the `body`.
    -   Sets `isLocked` state to `false`.
-   **Cleanup:** Includes a `useEffect` hook that ensures scroll is unlocked if the component using the hook unmounts while scroll is still locked. This prevents the page from getting stuck in a locked state.
-   **Idempotency:** Calling `lockScroll` or `unlockScroll` multiple times when already in the desired state has no effect.
-   **Browser Check:** Operations are conditional on `typeof window !== 'undefined'`.
