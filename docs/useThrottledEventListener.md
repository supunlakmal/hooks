# `useThrottledEventListener` Hook

## Description

`useThrottledEventListener` is a custom React hook that allows you to attach an event listener to an element and throttle the execution of the event handler. This is useful for performance optimization in situations where events fire rapidly, such as scrolling or resizing.

## Usage

```typescript
import React, { useRef, useState } from 'react';
import { useThrottledEventListener } from '@supunlakmal/hooks'; // Adjust the import path

function ThrottledResizeComponent() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Define the throttled event handler
  const handleResize = () => {
    console.log('Throttled resize event fired!');
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Attach the throttled event listener to the window
  useThrottledEventListener(
    'resize', // Event type
    handleResize, // Event handler
    { target: typeof window !== 'undefined' ? window : null, throttleTimeout: 200 } // Options: target is window, 200ms throttle
  );

  // For demonstrating throttling, you might also want a non-throttled version
  // React.useEffect(() => {
  //   const handleResizeImmediate = () => {
  //     console.log('Immediate resize event fired!');
  //   };
  //   window.addEventListener('resize', handleResizeImmediate);
  //   return () => window.removeEventListener('resize', handleResizeImmediate);
  // }, []);

  return (
    <div>
      <h1>useThrottledEventListener Example</h1>
      <p>Resize your browser window. The dimensions below update at most once every 200ms.</p>
      <p>Current Window Size (Throttled): {windowSize.width}px x {windowSize.height}px</p>
      <p>Check the console to see how often the throttled handler runs.</p>
    </div>
  );
}

export default ThrottledResizeComponent;
```

## API

```typescript
interface UseThrottledEventListenerOptions extends AddEventListenerOptions {
  readonly throttleTimeout?: number;
  readonly leading?: boolean;
  readonly trailing?: boolean;
  readonly target?: EventTarget | null;
}

function useThrottledEventListener<E extends keyof WindowEventMap>(
  type: E,
  handler: (event: WindowEventMap[E]) => void,
  options?: UseThrottledEventListenerOptions // target defaults to window
): void;
function useThrottledEventListener<E extends keyof DocumentEventMap>(
  type: E,
  handler: (event: DocumentEventMap[E]) => void,
  options?: UseThrottledEventListenerOptions // target defaults to document
): void;
function useThrottledEventListener<E extends string, T extends EventTarget>(
  type: E,
  handler: (event: Event) => void,
  options?: UseThrottledEventListenerOptions & { target: T | null }
): void;
```

## Parameters

- **`type`**: `string`
  - Type: `string`
  - Description: The type of event to listen for (e.g., 'scroll', 'resize', 'mousemove').
- **`handler`**: `function`
  - Type: `(event: Event) => void`
  - Description: The function to be executed when the event occurs, subject to throttling.
- **`options`**: `object` (optional)
  - Type: `UseThrottledEventListenerOptions`
  - Description: An optional object containing configuration options for the event listener and throttling.
    - `throttleTimeout`: `number` (optional, defaults to `100`) - The minimum time interval in milliseconds between consecutive executions of the `handler`.
    - `leading`: `boolean` (optional, defaults to `true`) - If true, the handler will be executed on the leading edge of the throttle timeout.
    - `trailing`: `boolean` (optional, defaults to `true`) - If true, the handler will be executed on the trailing edge of the throttle timeout.
    - `target`: `EventTarget | null` (optional) - The target element to attach the listener to. Defaults to `window` for `WindowEventMap` events and `document` for `DocumentEventMap` events. Can be a `RefObject<HTMLElement>` or a direct DOM element.
    - Other standard `AddEventListenerOptions` like `capture`, `once`, `passive` can also be included.

## Returns

- `void`: This hook does not return any value.

## How it Works

The `useThrottledEventListener` hook combines the functionality of `useEventListener` and throttling logic. It uses `useRef` to manage the timestamp of the last execution and a timer ID. When the event fires, instead of executing the handler immediately, it schedules it using `setTimeout` if the throttle timeout has passed or if `leading` is true and no timeout is pending. Subsequent events within the timeout window are ignored (or their execution is deferred to the trailing edge if `trailing` is true). The timeout is cleared on cleanup to prevent memory leaks.
