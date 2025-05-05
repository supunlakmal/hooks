# useEventCallback

The `useEventCallback` hook creates a stable function reference (memoized callback) that always delegates to the _latest_ version of the provided callback function. This is particularly useful for optimizing child components that depend on stable callback props (e.g., when using `React.memo` or including callbacks in dependency arrays of other hooks like `useEffect`) without causing unnecessary re-renders when the parent's callback definition changes.

## Usage

```jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useEventCallback } from '@supunlakmal/hooks'; // Assuming installation

// Example Child Component that uses React.memo
const MemoizedChild = React.memo(({ onClick, label }) => {
  console.log(`Rendering Child: ${label}`);
  return <button onClick={onClick}>Click Me ({label})</button>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);

  // A regular callback that changes whenever `count` changes.
  // Passing this directly to MemoizedChild would cause it to re-render on every count change.
  const regularHandleClick = () => {
    console.log(`Regular click! Count is: ${count}`);
    // Do something with count
  };

  // Use useEventCallback to create a stable function reference.
  // This `stableHandleClick` function's identity will not change across renders,
  // but it will always call the *latest* version of the inline function defined here.
  const stableHandleClick = useEventCallback(() => {
    console.log(`Stable click! Count is: ${count}`);
    // Do something with the LATEST count
  });

  useEffect(() => {
    // Example: Using the stable callback in a dependency array
    // This effect will NOT re-run just because the logic inside stableHandleClick's definition changes
    console.log('Effect with stable callback dependency runs only once');
  }, [stableHandleClick]);

  return (
    <div>
      <h2>useEventCallback Example</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment Count</button>
      <hr />
      {/* This child will re-render every time count changes because regularHandleClick changes */}
      <MemoizedChild onClick={regularHandleClick} label="Regular Callback" />
      <br />
      {/* This child will NOT re-render when count changes because stableHandleClick's reference is stable */}
      <MemoizedChild
        onClick={stableHandleClick}
        label="Stable Callback (useEventCallback)"
      />
    </div>
  );
}

export default ParentComponent;
```

## API

### Parameters

- `callback`: `T extends (...args: any[]) => any`
  - **Required**. The callback function you want to stabilize. The hook ensures that the returned function always calls the most recent version of this `callback`.

### Return Value

- `(memoizedCallback: T)`: `T`
  - Returns a memoized function with a stable reference. This function, when called, will execute the latest `callback` passed to the hook.

## Behavior

- Internally uses `useRef` to store the latest version of the `callback`.
- Uses `useEffect` to update the ref whenever the `callback` prop changes.
- Returns a `useCallback` function with an empty dependency array (`[]`), ensuring its reference remains stable across renders.
- The stable function reads the latest callback from the ref and executes it when called.
- Throws an error if the callback is somehow invoked before the internal ref has been initialized (though this is unlikely in standard usage).
