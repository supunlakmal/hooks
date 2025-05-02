# useWakeLock

## Description

The `useWakeLock` hook provides a simple way to utilize the Screen Wake Lock API within your React application. This API allows you to request that the device's screen stays awake, preventing it from dimming or locking automatically. This is particularly useful for applications where the user needs the screen to remain active, such as presentation apps, recipe viewers, video players, or any application requiring continuous user attention.

## Usage

### Import
```
typescript
import { useWakeLock } from '@supunlakmal/hooks';
```
### Basic Example
```
typescript
import React, { useEffect } from 'react';
import { useWakeLock } from '@supunlakmal/hooks';

function MyComponent() {
  const { isSupported, isLocked, request, release } = useWakeLock();

  useEffect(() => {
    if (isSupported && !isLocked) {
      request();
    }
  }, [isSupported, isLocked, request]);

  return (
    <div>
      {isSupported ? (
        <>
          <p>Wake Lock API is supported.</p>
          {isLocked ? (
            <>
              <p>Screen is awake.</p>
              <button onClick={release}>Release Wake Lock</button>
            </>
          ) : (
            <p>Screen wake lock is not active.</p>
          )}
        </>
      ) : (
        <p>Wake Lock API is not supported.</p>
      )}
    </div>
  );
}
```
### Example with Toggle
```
typescript
import React, { useState } from 'react';
import { useWakeLock } from '@supunlakmal/hooks';

function MyComponent() {
  const { isSupported, isLocked, request, release } = useWakeLock();
  const [active, setActive] = useState(false);

  const toggleWakeLock = () => {
    if (isSupported) {
      if (!active) {
        request();
      } else {
        release();
      }
      setActive(!active);
    }
  };

  return (
    <div>
      {isSupported ? (
        <>
          <p>Wake Lock API is supported.</p>
          <button onClick={toggleWakeLock}>
            {active ? 'Deactivate Wake Lock' : 'Activate Wake Lock'}
          </button>
          {isLocked && <p>Screen is awake.</p>}
        </>
      ) : (
        <p>Wake Lock API is not supported.</p>
      )}
    </div>
  );
}
```
## Parameters

This hook does not take any parameters.

## Returns

The `useWakeLock` hook returns an object with the following properties:

-   **`isSupported: boolean`**: Indicates whether the Screen Wake Lock API is supported by the current browser.
-   **`isLocked: boolean`**: Indicates if the wake lock is currently active.
-   **`request: () => Promise<void>`**: A function to request the activation of the wake lock. It returns a Promise that resolves when the lock is acquired.
-   **`release: () => Promise<void>`**: A function to release the wake lock, allowing the screen to dim or lock automatically. It returns a Promise that resolves when the lock is released.

## Related Hooks

-   [`useFullscreen`](./useFullscreen.md): A hook for using the Fullscreen API.
-   [`useVisibility`](./useVisibility.md): A hook for monitoring the visibility state of a document.