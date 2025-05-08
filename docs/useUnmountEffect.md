# `useUnmountEffect` Hook

## Description

The `useUnmountEffect` hook is a specialized version of `useEffect` that runs its effect function only once, specifically when the component unmounts. It is essentially a convenient shorthand for `useEffect(() => () => { /* cleanup code */ }, [])`, clearly signaling the intent to perform cleanup logic.

## Usage

Provide a cleanup function as the argument to `useUnmountEffect`. This function will be executed when the component is unmounted.

```typescript
import React, { useState, useEffect } from 'react';
import { useUnmountEffect } from '@supunlakmal/hooks'; // Adjust the import path

function EventListenerComponent() {
  // Simulate setting up a global event listener
  useEffect(() => {
    console.log('Component mounted: Adding event listener...');
    const handleGlobalClick = () => {
      console.log('Global click detected!');
    };
    document.addEventListener('click', handleGlobalClick);

    // The cleanup function for useEffect will run on unmount or re-run
    return () => {
      console.log('useEffect cleanup: Removing event listener...');
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []); // Empty dependency array: effect runs once on mount and cleans up on unmount

  // Use useUnmountEffect to perform cleanup ONLY on unmount
  useUnmountEffect(() => {
    console.log('useUnmountEffect: Component unmounting. Final cleanup.');
    // This callback runs when the component is completely gone.
  });

  return (
    <div>
      <h1>useUnmountEffect Example</h1>
      <p>This component sets up an effect that cleans up on unmount.</p>
      <p>There is also a useUnmountEffect that logs when the component is unmounted.</p>
      <p>Check the console logs when mounting/unmounting this component.</p>
    </div>
  );
}

function ParentComponent() {
    const [show, setShow] = useState(true);
    return (
        <div>
            <button onClick={() => setShow(s => !s)}>
                {show ? "Hide Component" : "Show Component"}
            </button>
            {show && <EventListenerComponent />}
        </div>
    )
}

export default ParentComponent;
```

## API

```typescript
function useUnmountEffect(cleanup: () => void): void;
```

## Parameters

- **`cleanup`**: `() => void`
  - Type: `function`
  - Description: The function to execute when the component unmounts. This function should not accept any arguments.

## Returns

- `void`: This hook does not return any value.

## How it Works

`useUnmountEffect` is a thin wrapper around `React.useEffect`. It calls `useEffect` with an empty dependency array (`[]`), which means the effect's setup function runs only once after the initial render. The function passed to `useUnmountEffect` is provided as the _cleanup function_ returned by the `useEffect` setup function. React guarantees that the cleanup function of an effect with an empty dependency array is called exactly once when the component unmounts.
