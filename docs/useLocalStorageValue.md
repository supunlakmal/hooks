# `useLocalStorageValue` Hook

## Description

The `useLocalStorageValue` hook provides a convenient way to manage a value stored in the browser's local storage. It synchronizes the state of a variable with the local storage, ensuring persistence across sessions.

## Usage
```
typescript
import { useLocalStorageValue } from '@supunlakmal/hooks';

function MyComponent() {
  const [name, setName] = useLocalStorageValue<string>('userName', 'Guest');

  return (
    <div>
      <p>Hello, {name}!</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```
## API
```
typescript
function useLocalStorageValue<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prevValue: T) => T)) => void];
```
## Parameters

*   **key**: `string`
    *   The key under which the value will be stored in local storage. This is required.
*   **initialValue**: `T | (() => T)`
    *   The initial value of the state, or a function that returns the initial value. If the value is not in local storage, this will be used. This is required.

## Returns

*   **[T, (value: T | ((prevValue: T) => T)) => void]**: A tuple containing:
    *   **T**: The current value of the state.
    *   **(value: T | ((prevValue: T) => T)) => void**: A function to update the state. It accepts either a new value or a function that receives the previous value and returns the new value.

## How it Works

The `useLocalStorageValue` hook uses the `useState` hook internally to manage the state. It also utilizes the `localStorage` API to store and retrieve the value. When the component mounts, it checks if a value exists in `localStorage` under the given key. If it exists, that value is used; otherwise, the `initialValue` is used and stored in `localStorage`. When the state is updated using the returned update function, the new value is immediately stored in `localStorage`. This hook also adds a `storage` event listener to update state changes from different tabs or windows.