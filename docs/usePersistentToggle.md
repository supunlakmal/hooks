# `usePersistentToggle` Hook

## Description

`usePersistentToggle` is a custom React hook that manages a boolean state that automatically persists its value in the browser's local storage. It provides a simple interface to toggle the boolean value and set it explicitly to true or false, remembering the last state across page reloads.

## Usage

```typescript
import React from 'react';
import { usePersistentToggle } from '@supunlakmal/hooks'; // Adjust the import path

function PersistentToggleComponent() {
  // Use the hook with a storage key and an optional initial value
  const [isOn, { toggle, setTrue, setFalse }] = usePersistentToggle(
    'myAppToggleState', // Key for local storage
    false // Initial value if no value is found in storage
  );

  return (
    <div>
      <h1>Persistent Toggle</h1>
      <p>
        Current State: <strong>{isOn ? 'ON' : 'OFF'}</strong>
      </p>
      <button onClick={toggle}>Toggle State</button>
      <button onClick={setTrue} disabled={isOn}>
        Set ON
      </button>
      <button onClick={setFalse} disabled={!isOn}>
        Set OFF
      </button>
      <p style={{ marginTop: '15px', fontSize: '0.9em', color: 'gray' }}>
        (Toggle state will be saved in local storage under the key
        'myAppToggleState')
      </p>
    </div>
  );
}

export default PersistentToggleComponent;
```

## API

```typescript
interface UsePersistentToggleActions {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

function usePersistentToggle(
  key: string,
  initialValue?: boolean
): [boolean, UsePersistentToggleActions];
```

## Parameters

- **`key`**: `string` (Required)
  - The unique key used to store and retrieve the boolean value in `localStorage`.
- **`initialValue`**: `boolean` (Optional, defaults to `false`)
  - The initial value of the toggle if no value is found for the given `key` in `localStorage`.

## Returns

The hook returns a tuple containing:

1.  **`state`**: `boolean`
    - The current boolean value of the persistent toggle.
2.  **`actions`**: `UsePersistentToggleActions`
    - An object containing helper functions:
        - `toggle`: `() => void` - A function to switch the boolean state to the opposite value (true to false, false to true).
        - `setTrue`: `() => void` - A function to set the boolean state explicitly to `true`.
        - `setFalse`: `() => void` - A function to set the boolean state explicitly to `false`.

## How it Works

`usePersistentToggle` combines the functionality of `useLocalStorage` and `useBoolean`. It uses `useLocalStorage` to read the initial boolean value from storage (or use the `initialValue` fallback) and to save the updated boolean value whenever it changes. It provides the `toggle`, `setTrue`, and `setFalse` functions by managing the boolean state internally and ensuring that any changes are written to local storage via the `useLocalStorage` hook's setter.
