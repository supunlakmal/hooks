# `useStorageValue` Hook

## Description

The `useStorageValue` hook provides a convenient way to manage state that is persisted in either `localStorage` or `sessionStorage`. It allows you to store and retrieve values, and automatically updates the component when the storage value changes. It supports both string and object values and provides type safety.

## Usage

Here's an example of how to use the `useStorageValue` hook:

```
typescript
import { useStorageValue } from '@supunlakmal/hooks';

function MyComponent() {
  const [name, setName] = useStorageValue<string>('user-name', 'John Doe', 'localStorage');
  const [settings, setSettings] = useStorageValue<{ theme: string }>('app-settings', { theme: 'light' }, 'sessionStorage');

  return (
    <div>
      <p>User Name: {name}</p>
      <button onClick={() => setName('Jane Doe')}>Change Name</button>
      <p>Theme: {settings.theme}</p>
      <button onClick={() => setSettings({ theme: 'dark' })}>Change Theme</button>
    </div>
  );
}
```

## API

```
typescript
type StorageType = 'localStorage' | 'sessionStorage';

function useStorageValue<T>(
  key: string,
  defaultValue: T,
  storageType: StorageType,
): [T, (newValue: T) => void];
```

## Parameters

- **key**: `string`
  - The key under which the value will be stored in `localStorage` or `sessionStorage`.
- **defaultValue**: `T`
  - The default value to use if no value is found in storage for the given key.
- **storageType**: `StorageType`
  - Specifies which storage to use, either `'localStorage'` or `'sessionStorage'`.

## Returns

The hook returns an array with two elements:

- **value**: `T`
  - The current value stored in storage, or the default value if nothing is stored.
- **setValue**: `(newValue: T) => void`
  - A function to update the stored value. When called, it updates both the storage and the component's state.

## How it Works

The `useStorageValue` hook utilizes the following React hooks:

- **useState**: To manage the internal state of the value.
- **useEffect**: To synchronize the state with the storage whenever the key or value changes.
- **useEventListener**: detect change in storage.

Here's how it operates:

1.  **Initialization**:

    - When the hook is first called, it attempts to retrieve the value from the specified storage (`localStorage` or `sessionStorage`) using the provided `key`.
    - If a value is found, it's parsed and used as the initial state.
    - If no value is found or parsing fails, the `defaultValue` is used.

2.  **Updating the Value**:
    - When `setValue` is called, it updates the internal state using `useState` and then stores the new value in the specified storage.
    - The value is converted to a JSON string before storing to support object values.
3.  change detect
    - if change value in another tab update current tab value.
4.  **Cleanup**:

    - When the component unmounts, the event listener for storage changes is removed.

5.  **Error Handling:**

- if `setValue` new value is `undefined`, It will remove the item from the storage.
