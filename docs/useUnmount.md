# `useUnmount` Hook

A simple hook that executes a cleanup function when the component unmounts. This is essentially a convenience wrapper around `useEffect` specifically for unmount logic.

## Usage

Provide a function to the `useUnmount` hook. This function will be called exactly once when the component instance is destroyed.

```typescript
import React, { useState, useEffect } from "react";
import { useUnmount } from "@supunlakmal/hooks"; // Adjust path

const ChildComponent = () => {
  useUnmount(() => {
    console.log("ChildComponent is unmounting! Cleaning up...");
    // Perform any cleanup tasks here, e.g.,
    // - Clear timers
    // - Remove global listeners
    // - Release resources
  });

  useEffect(() => {
    console.log("ChildComponent mounted");
    // Setup logic here
  }, []);

  return <div>I am the child component.</div>;
};

function UnmountExample() {
  const [showChild, setShowChild] = useState(true);

  return (
    <div>
      <h1>useUnmount Example</h1>
      <button onClick={() => setShowChild((s) => !s)}>
        {showChild ? "Hide Child" : "Show Child"}
      </button>
      {showChild && <ChildComponent />}
    </div>
  );
}

export default UnmountExample;
```

## API

```typescript
function useUnmount(onUnmount: () => void): void;
```

### Parameters

- `onUnmount`: `() => void` - The function to execute when the component unmounts. This function should not take any arguments and should not return anything.

### Returns

- `void` - This hook does not return any value.

## How it Works

1.  **`useRef`**: It uses `useRef` (`onUnmountRef`) to store the latest version of the `onUnmount` callback function provided by the user. This ensures that even if the component re-renders with a new callback identity, the cleanup function will always call the most recent one.
2.  **Update Ref Effect**: A `useEffect` hook with `onUnmount` in its dependency array updates `onUnmountRef.current` whenever the `onUnmount` function changes.
3.  **Unmount Effect**: Another `useEffect` hook with an empty dependency array (`[]`) is used. This effect runs its setup function only once after the initial mount.
4.  **Cleanup Function**: The crucial part is the _cleanup function_ returned by the unmount `useEffect`. React automatically calls this cleanup function when the component unmounts. Inside this cleanup, the hook calls `onUnmountRef.current()`, executing the latest unmount callback.
