# useEyeDropper

**(Experimental)**

The `useEyeDropper` hook provides an interface to the experimental [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API), allowing users to sample colors from anywhere on their screen using a native browser eyedropper tool.

**Note:** Browser support for the EyeDropper API is limited (primarily Chrome-based browsers as of late 2023/early 2024). Always check for compatibility and provide fallbacks if necessary.

## Usage

```jsx
import React from 'react';
import { useEyeDropper } from '@supunlakmal/hooks'; // Assuming installation

function ColorPickerComponent() {
  const { isSupported, sRGBHex, open, error } = useEyeDropper({
    onError: (err) => {
      // Optional: Handle errors more specifically if needed
      console.error("Custom error handler:", err.message);
    },
  });

  return (
    <div>
      <h2>useEyeDropper Example (Experimental)</h2>
      
      {!isSupported && (
        <p style={{ color: 'orange' }}>
          Warning: EyeDropper API is not supported in your browser.
        </p>
      )}

      <button onClick={open} disabled={!isSupported}>
        Open EyeDropper
      </button>

      {sRGBHex && (
        <div style={{ marginTop: '20px' }}>
          Selected Color: 
          <span 
            style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              backgroundColor: sRGBHex,
              border: '1px solid black',
              verticalAlign: 'middle',
              marginLeft: '5px',
              marginRight: '5px',
            }}
          ></span>
          <code>{sRGBHex}</code>
        </div>
      )}

      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Error: {error.message} (User cancellation might also be reported here if not explicitly handled as non-error)
        </p>
      )}

      <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
        <i>Click the button and then click anywhere on your screen (inside or outside the browser window) to pick a color.</i>
      </p>
    </div>
  );
}

export default ColorPickerComponent;
```

## API

### Parameters

-   `options`: `UseEyeDropperOptions` (optional)
    -   An object containing optional configuration:
        -   `onError`: `(error: Error) => void` (optional): A callback function that gets called if an error occurs during the eyedropper operation (e.g., API not supported, or other failures). Note that user cancellation might also trigger an error.

### Return Value

The hook returns an object (`UseEyeDropperReturn`) with the following properties:

-   `isSupported`: `boolean`
    -   Indicates whether the EyeDropper API (`window.EyeDropper`) is available in the current browser environment.
-   `sRGBHex`: `string | null`
    -   The selected color in sRGB hexadecimal format (e.g., `#aabbcc`), or `null` if no color is currently selected or the operation was cancelled/failed.
-   `open`: `() => Promise<void>`
    -   An asynchronous function to initiate the eyedropper process. Calling this will typically display the native eyedropper UI. The promise resolves when the user selects a color or cancels the operation.
-   `error`: `Error | null`
    -   An `Error` object if an error occurred (other than user cancellation, which might be filtered out), or `null` otherwise.

## Behavior

-   **Support Check:** On initialization, it checks if `window.EyeDropper` exists and sets the `isSupported` flag accordingly.
-   **Opening:** The `open` function first checks for API support. If not supported, it sets an error and calls `options.onError`. If supported, it creates a new `EyeDropper` instance and calls its `open()` method.
-   **Color Selection:** If the user successfully selects a color, the `sRGBHex` state is updated with the result.
-   **Cancellation/Error:** If the user cancels (e.g., presses Escape) or an error occurs, the `catch` block is executed. User cancellation (often an `AbortError` or specific `DOMException`) is typically logged to the console but *not* set as a state `error` to avoid displaying an error message for normal cancellation. Other errors are set to the `error` state and passed to `options.onError`.
-   **State Reset:** Calling `open` clears any previous `error` and resets `sRGBHex` to `null` before starting the process.
