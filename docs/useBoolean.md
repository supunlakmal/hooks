# `useBoolean` Hook

## Description

`useBoolean` is a custom React hook that provides a convenient way to manage a boolean state with helper functions to toggle, set to true, and set to false.

This hook is useful for managing simple on/off or true/false states within your components. It abstracts away the need to manage `useState` and provide custom functions for common boolean operations.

## Parameters

This hook takes one optional parameter:

- `initialValue`: The initial boolean value for the state (default is `false`).

## Return Value

The hook returns a tuple containing:

1.  The current boolean state (`value`).
2.  An object containing helper functions:
    - `toggle`: A function to switch the boolean state to the opposite value.
    - `setTrue`: A function to set the boolean state to `true`.
    - `setFalse`: A function to set the boolean state to `false`.

## Example

```typescript
import React from 'react';
import { useBoolean } from '@supunlakmal/hooks'; // Adjust the import path

function BooleanToggle() {
  const [isOn, { toggle, setTrue, setFalse }] = useBoolean(false); // Initialize with false

  return (
    <div>
      <h1>useBoolean Example</h1>
      <p>Current State: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue} disabled={isOn}>
        Set ON
      </button>
      <button onClick={setFalse} disabled={!isOn}>
        Set OFF
      </button>
    </div>
  );
}

export default BooleanToggle;
```
