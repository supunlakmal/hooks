# useOrientation

Tracks the device's screen orientation using the Screen Orientation API.

Provides the current orientation `angle` and `type` (e.g., 'portrait-primary', 'landscape-secondary'). It also indicates if the Screen Orientation API is supported by the browser.

## Usage

```jsx
import React from 'react';
import { useOrientation } from '@supunlakmal/hooks'; // Adjust the import path as needed

function OrientationInfo() {
  const { angle, type, isSupported } = useOrientation();

  if (!isSupported) {
    return <p>Screen Orientation API is not supported by this browser.</p>;
  }

  // Optional: Add a visual indicator based on orientation
  const orientationStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    backgroundColor: type.includes('portrait') ? '#e0f7fa' : '#fff3e0',
    textAlign: 'center',
  };

  return (
    <div style={orientationStyle}>
      <h2>Screen Orientation</h2>
      <p>Type: <strong>{type}</strong></p>
      <p>Angle: <strong>{angle}°</strong></p>
      <p>Rotate your device or browser window to see the values change.</p>
    </div>
  );
}

export default OrientationInfo;
```

## API

`useOrientation()`

### Parameters

This hook takes no parameters.

### Returns

- **`orientationState`**: `object`
  An object containing the current orientation state:
  - `angle`: `number` - The current orientation angle of the screen (typically 0, 90, 180, or 270).
  - `type`: `OrientationType` - A string indicating the orientation type (e.g., `'portrait-primary'`, `'portrait-secondary'`, `'landscape-primary'`, `'landscape-secondary'`).
  - `isSupported`: `boolean` - Indicates whether the Screen Orientation API is available in the current browser environment.

## How it Works

1.  **Support Check:** On initial render, it checks if `window.screen.orientation` and its necessary methods (`lock`, `unlock`, `addEventListener`) exist to determine `isSupported`.
2.  **State:** Uses `useState` to hold the current `angle` and `type`. It initializes these states by reading the current values from `window.screen.orientation` if supported, defaulting to `0` and `'portrait-primary'` otherwise.
3.  **Event Listener:** Uses `useEffect` to add an event listener for the `change` event on `window.screen.orientation`. This listener's handler updates the `angle` and `type` states with the new orientation values from `event.target`.
4.  **Cleanup:** The `useEffect` cleanup function removes the `change` event listener when the component unmounts to prevent memory leaks.

## Notes

- The Screen Orientation API might have limited support or behavior differences across browsers and devices.
- Locking orientation (`screen.orientation.lock()`) typically requires user interaction and may not be available in all contexts.
