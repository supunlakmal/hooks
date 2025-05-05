# useIdleCallback

The `useIdleCallback` hook provides a convenient way to schedule a function to be called during a browser's idle periods using the `requestIdleCallback` API. It helps in performing background and low-priority tasks without interfering with higher-priority events like animations and input responses.

## Usage

```jsx
import React, { useState } from 'react';
import { useIdleCallback } from '@supunlakmal/hooks'; // Assuming installation

function IdleComponent() {
  const [status, setStatus] = useState('Idle callback not started.');
  const [result, setResult] = useState('');

  // Task to run during idle time
  const handleIdleTask = (deadline) => {
    setStatus(
      `Idle callback running... Time remaining: ${deadline.timeRemaining().toFixed(2)}ms`
    );
    // Simulate some work that might take time
    let calculation = 0;
    const startTime = performance.now();
    // Only work while there's time or if deadline.didTimeout is false
    while (
      (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
      performance.now() - startTime < 50
    ) {
      // Keep calculation loop short to yield frequently if needed
      for (let i = 0; i < 1000; i++) {
        calculation += Math.sqrt(i * Math.random());
      }
    }
    setResult(`Partial calculation result: ${calculation.toFixed(2)}`);
    setStatus('Idle callback cycle completed.');
    // Note: Real tasks might need to schedule subsequent calls if work isn't finished
  };

  const { start, cancel, isSupported, error } = useIdleCallback(
    handleIdleTask,
    { timeout: 2000 }
  );

  if (!isSupported) {
    return <div>requestIdleCallback is not supported in this browser.</div>;
  }

  if (error) {
    return <div>Error using useIdleCallback: {error.message}</div>;
  }

  return (
    <div>
      <h2>useIdleCallback Example</h2>
      <p>Status: {status}</p>
      <p>{result}</p>
      <button onClick={start} disabled={!isSupported || !!error}>
        Start Idle Callback
      </button>
      <button onClick={cancel} disabled={!isSupported || !!error}>
        Cancel Idle Callback
      </button>
    </div>
  );
}

export default IdleComponent;
```

## API

### Parameters

- `callback`: `(deadline: IdleDeadline) => void`
  - **Required**. The function to execute when the browser is idle. It receives an `IdleDeadline` object as an argument, which provides:
    - `didTimeout`: A boolean indicating if the callback is executing because the optional `timeout` was reached.
    - `timeRemaining()`: A method returning the estimated time (in milliseconds) remaining in the current idle period.
- `options?`: `IdleRequestOptions`
  - Optional configuration object passed directly to `requestIdleCallback`.
  - `timeout?`: `number` - If the callback hasn't been executed within this time (in milliseconds), it will be queued for execution at the next opportunity, even if it might impact latency-critical events.

### Return Value

The hook returns an object with the following properties:

- `start`: `() => void`
  - A function to schedule the idle callback.
- `cancel`: `() => void`
  - A function to cancel a scheduled idle callback.
- `isSupported`: `boolean`
  - Indicates whether the `requestIdleCallback` API is supported by the browser.
- `error`: `Error | null`
  - Stores any error encountered during the hook's operation (though errors are rare with `requestIdleCallback` itself, this could be extended).

## Behavior

- The `callback` is scheduled using `requestIdleCallback` when `start` is called.
- The hook automatically cancels any pending callback on component unmount using `cancelIdleCallback`.
- The `start` function ensures only one callback is scheduled at a time; calling `start` again will cancel any pending callback before scheduling a new one.
- The `cancel` function clears any currently scheduled callback.
