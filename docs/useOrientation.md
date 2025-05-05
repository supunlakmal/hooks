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

  return (
    <div>
      <h2>Screen Orientation</h2>
      <p>Type: {type}</p>
      <p>Angle: {angle}°</p>
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
