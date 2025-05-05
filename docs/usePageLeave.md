# usePageLeave

The `usePageLeave` hook triggers a callback function when the user's mouse cursor leaves the main browser window or document area.

This is commonly used to detect an "exit intent", for example, to display a modal or newsletter signup form just as the user seems about to navigate away.

## Usage

```jsx
import React, { useState } from 'react';
import { usePageLeave } from '@supunlakmal/hooks'; // Assuming installation

function ExitIntentComponent() {
  const [showModal, setShowModal] = useState(false);

  // Define the callback to run when the user's mouse leaves the page
  const handlePageLeave = () => {
    console.log('Mouse left the page viewport!');
    // Only show the modal once
    if (!showModal) {
      setShowModal(true);
    }
  };

  // Use the hook
  usePageLeave(handlePageLeave);

  // Example of disabling the hook conditionally
  // const [enabled, setEnabled] = useState(true);
  // usePageLeave(handlePageLeave, enabled);

  return (
    <div
      style={{ height: '200vh', border: '2px dashed blue', padding: '20px' }}
    >
      <h2>usePageLeave Example</h2>
      <p>
        Move your mouse cursor outside the browser window (e.g., towards the
        tabs or address bar, or off the screen) to trigger the callback.
      </p>
      <p>Check the browser console for messages.</p>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '30px',
            background: 'lightcoral',
            border: '1px solid red',
            zIndex: 1000,
          }}
        >
          <h3>Exit Intent Modal!</h3>
          <p>Looks like you were leaving?</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}

      {/* Button to test conditional disabling 
      <button onClick={() => setEnabled(!enabled)}>
        {enabled ? 'Disable' : 'Enable'} Hook
      </button>
      <p>Hook is currently: {enabled ? 'Enabled' : 'Disabled'}</p>
      */}
    </div>
  );
}

export default ExitIntentComponent;
```

## API

### Parameters

- `onPageLeave`: `() => void`
  - **Required**. The callback function to execute when the mouse leaves the page viewport.
- `enabled`: `boolean` (optional, defaults to `true`)
  - A boolean flag to conditionally enable or disable the hook's event listener.

### Return Value

None (`void`).

## Behavior

- The hook attaches a `mouseout` event listener to the `document.documentElement`.
- When the `mouseout` event fires, it checks if the mouse is moving _to_ an element outside the document (`event.relatedTarget` is null) while originating _from_ the document element (`event.target` is `document.documentElement`). This combination helps determine if the mouse is truly leaving the viewport area.
- If the exit condition is met and the hook is `enabled`, the `onPageLeave` callback is executed.
- The provided `onPageLeave` callback is wrapped in `useEventCallback` to ensure the latest version of the function is always called without needing to be included in the effect's dependency array.
- The event listener is automatically removed when the component unmounts or if the `enabled` state changes to `false`.
- It checks for a browser environment (`typeof window !== 'undefined'`) before attempting to add listeners.
