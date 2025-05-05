# `useMount` Hook

A simple hook that executes a callback function exactly once when the component mounts. This is a convenience wrapper around `useEffect` with an empty dependency array (`[]`) for mount-specific logic.

## Usage

Provide a function to the `useMount` hook. This function will be called once after the component's initial render.

```typescript
import React from "react";
import { useMount } from "@supunlakmal/hooks"; // Adjust path

const MyComponent = () => {
  useMount(() => {
    console.log("MyComponent has mounted! Performing initial setup...");
    // Perform tasks that should only run once on mount, e.g.,
    // - Initial data fetching
    // - Setting up subscriptions (if cleanup is handled elsewhere or not needed)
    // - Logging analytics events
  });

  return <div>I am the component. Check the console!</div>;
};

function MountExample() {
  return (
    <div>
      <h1>useMount Example</h1>
      <MyComponent />
    </div>
  );
}

export default MountExample;
```

## API

```typescript
function useMount(onMount: () => void): void;
```

### Parameters

- `onMount`: `() => void` - The function to execute when the component mounts. It should not take arguments or return a value.

### Returns

- `void` - This hook does not return any value.

## How it Works

1.  **`useRef` (Consistency)**: Although `useEffect` with `[]` runs only once, `useRef` (`onMountRef`) is used to store the `onMount` callback. This keeps the pattern consistent with `useUnmount` and potentially aids in edge cases or future hook extensions. The ref is updated with the latest `onMount` function on every render before the effect runs.
2.  **`useEffect`**: The core is a `useEffect` hook with an empty dependency array (`[]`).
3.  **Mount Execution**: Because the dependency array is empty, the effect's setup function runs only once, immediately after the initial render of the component. Inside this function, `onMountRef.current()` is called, executing the provided callback.
4.  **No Cleanup**: Unlike `useUnmount`, this hook does not involve or return a cleanup function from its `useEffect`.
