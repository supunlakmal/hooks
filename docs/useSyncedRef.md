# `useSyncedRef` Hook

## Description

The `useSyncedRef` hook provides a way to create a ref that automatically stays in sync with a given value. This is useful when you need to pass a value to a component that relies on refs, and you want to ensure the ref always reflects the latest value, without needing to manually update it.

## Usage

Here's an example of how to use the `useSyncedRef` hook:
```
typescript
import { useSyncedRef } from '@supunlakmal/hooks';
import React, { useEffect, useRef } from 'react';

function MyComponent({ value }: { value: number }) {
  const syncedRef = useSyncedRef(value);
  const previousValueRef = useRef<number | null>(null);

  useEffect(() => {
    if(previousValueRef.current != syncedRef.current)
    console.log('Synced Ref Value:', syncedRef.current);
    previousValueRef.current = syncedRef.current;
  }, [syncedRef.current]);

  return <div>Synced Ref: {syncedRef.current}</div>;
}
```
## API
```
typescript
function useSyncedRef<T>(value: T): React.MutableRefObject<T>;
```
## Parameters

*   **`value`**:
    *   **Type:** `T`
    *   **Description:** The value that the ref should be synced with. This can be of any type.

## Returns

*   **Return Type:** `React.MutableRefObject<T>`
*   **Details:** The hook returns a mutable ref object that holds the current value of `value`. Changes to `value` will automatically update the ref's `.current` property.
*   **Behavior Explanation:** Every time the `value` prop passed to the hook changes, the ref's `.current` property will be updated to the new value.

## How it Works

The `useSyncedRef` hook internally uses the `useRef` hook from React. It takes the provided `value` and assigns it to the `.current` property of the ref. When the `value` changes, the hook's internal logic reassigns this new value to the ref's `.current` property. No other React hooks are utilized in this implementation. There are no cleanup procedures involved. The core reasoning is to offer an uncomplicated method of establishing a ref that mirrors a provided value.