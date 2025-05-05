# `useIsMounted` Hook

## Description

The `useIsMounted` hook provides a way to check if a component is currently mounted. This is particularly useful in asynchronous operations or callbacks where you need to ensure that the component is still in the DOM before performing state updates or other actions. It returns a function that, when called, returns a boolean indicating whether the component is mounted or not.

## Usage

A clear code example demonstrating how to use the hook.

```
typescript
import { useEffect } from 'react';
import { useIsMounted } from '@supunlakmal/hooks';

function MyComponent() {
  const isMounted = useIsMounted();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isMounted()) {
        // Component is still mounted, safe to update state or perform other actions.
        console.log('Component is mounted!');
      } else {
        console.log('Component is unmounted!');
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return <div>My Component</div>;
}
```

## API

```
typescript
function useIsMounted(): () => boolean;
```

## Parameters

This hook does not take any parameters.

## Returns

- **`() => boolean`**: A function that, when called, returns a boolean indicating whether the component is currently mounted (`true`) or not (`false`).

## How it Works

The `useIsMounted` hook internally uses a `useRef` to maintain a mutable reference to a boolean value that reflects the mount status of the component. It utilizes `useEffect` to set the value to `true` on mount and `false` on unmount. The returned function then reads this mutable reference to determine the current mount status. This approach ensures that the mount state can be reliably checked outside of the component's render cycle, such as within asynchronous callbacks. It does not involve any state updates.
