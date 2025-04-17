# useToggle

A React hook that provides a simple way to manage boolean state with toggle functionality.

## Installation

This hook is included in the `@supunlakmal/hooks` package:

```bash
npm install @supunlakmal/hooks
# or
yarn add @supunlakmal/hooks
```

## Usage

```jsx
import { useToggle } from "@supunlakmal/hooks";

function ToggleExample() {
  // Use the hook with default initial value (false)
  const [isOpen, toggle, setOn, setOff] = useToggle();

  // Or with a custom initial value
  // const [isActive, toggle, activate, deactivate] = useToggle(true);

  return (
    <div>
      <div>Status: {isOpen ? "Open" : "Closed"}</div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setOn}>Open</button>
      <button onClick={setOff}>Close</button>
    </div>
  );
}
```

## API

### `useToggle(initialValue?: boolean): UseToggleReturn`

Returns an array with the current boolean state and functions to manipulate it.

#### Parameters

| Name           | Type      | Default | Description                        |
| -------------- | --------- | ------- | ---------------------------------- |
| `initialValue` | `boolean` | `false` | The initial state value (optional) |

#### Return Value

The hook returns an array with the following elements:

| Index | Type         | Description                          |
| ----- | ------------ | ------------------------------------ |
| `[0]` | `boolean`    | The current boolean state value      |
| `[1]` | `() => void` | Function to toggle the boolean value |
| `[2]` | `() => void` | Function to set the value to `true`  |
| `[3]` | `() => void` | Function to set the value to `false` |

## Implementation Details

- Uses React's `useState` hook internally
- All returned functions are wrapped in `useCallback` to maintain referential equality
- The toggle function uses the functional update form of `setState` to ensure it always has the latest state

## Example: Collapsible Panel

```jsx
import React from "react";
import { useToggle } from "@supunlakmal/hooks";

function CollapsiblePanel({ title, children }) {
  const [isExpanded, toggle, expand, collapse] = useToggle(false);

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <button onClick={toggle}>{isExpanded ? "Collapse" : "Expand"}</button>
      </div>

      {isExpanded && <div className="panel-content">{children}</div>}
    </div>
  );
}
```

## Example: Form Input with Show/Hide Password

```jsx
import React from "react";
import { useToggle } from "@supunlakmal/hooks";

function PasswordInput() {
  const [passwordVisible, toggleVisibility, showPassword, hidePassword] =
    useToggle();

  return (
    <div className="password-input-wrapper">
      <input
        type={passwordVisible ? "text" : "password"}
        placeholder="Enter password"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        aria-label={passwordVisible ? "Hide password" : "Show password"}
      >
        {passwordVisible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
```
