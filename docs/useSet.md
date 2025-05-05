# `useSet` Hook

A hook to manage state in the form of a JavaScript `Set` object, providing utility functions for common set operations while ensuring immutability for React state updates.

## Usage

Provide an optional initial `Set` or an iterable (like an array) to the hook. It returns a tuple: the current `Set` instance and an `actions` object containing functions to modify the set.

```typescript
import React, { useState } from "react";
import { useSet } from "@supunlakmal/hooks"; // Adjust path

function SetStateExample() {
  // Initialize with some default values
  const initialData = ["apple", "banana", "orange"];
  const [set, actions] = useSet<string>(initialData);

  const [valueInput, setValueInput] = useState("");

  const handleAdd = () => {
    if (valueInput) {
      actions.add(valueInput);
      setValueInput("");
    }
  };

  const handleRemove = (value: string) => {
    actions.remove(value);
  };

  const handleToggle = (value: string) => {
    actions.toggle(value);
  };

  return (
    <div>
      <h1>useSet Example</h1>

      <div>
        <h3>Current Set Contents:</h3>
        {set.size === 0 ? (
          <p>(Set is empty)</p>
        ) : (
          <ul>
            {[...set].map((value) => (
              <li key={value}>
                {value}
                <button
                  onClick={() => handleRemove(value)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
                <button
                  onClick={() => handleToggle(value)}
                  style={{ marginLeft: "5px" }}
                >
                  Toggle
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Controls:</h3>
        <input
          type="text"
          placeholder="Value to add/toggle"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
        />
        <button onClick={handleAdd} style={{ marginLeft: "5px" }}>
          Add
        </button>
        <button
          onClick={() => handleToggle(valueInput)}
          disabled={!valueInput}
          style={{ marginLeft: "5px" }}
        >
          Toggle Input Value
        </button>
        <button onClick={actions.clear} style={{ marginLeft: "10px" }}>
          Clear All
        </button>
        <button onClick={actions.reset} style={{ marginLeft: "10px" }}>
          Reset to Initial
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <p>Has 'apple'? {actions.has("apple") ? "Yes" : "No"}</p>
        <p>Has 'grape'? {actions.has("grape") ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

export default SetStateExample;
```

## API

```typescript
interface SetActions<T> {
  add: (value: T) => void;
  remove: (value: T) => void;
  toggle: (value: T) => void;
  reset: () => void;
  clear: () => void;
  has: (value: T) => boolean;
}

type UseSetResult<T> = [Set<T>, SetActions<T>];

function useSet<T>(initialSet?: Set<T> | Iterable<T>): UseSetResult<T>;
```

### Parameters

- `initialSet`: (Optional) `Set<T> | Iterable<T>` - The initial state for the set. Can be an existing `Set` instance or any iterable (like an array `['a', 'b']`). If omitted, the set starts empty.

### Returns

- `UseSetResult<T>`: A tuple containing:
  1.  `set`: `Set<T>` - The current state of the Set.
  2.  `actions`: `SetActions<T>` - An object with the following memoized functions to manipulate the set state:
      - `add(value: T)`: Adds a value to the set. If the value already exists, the state remains unchanged. Creates a new Set instance if the value is added.
      - `remove(value: T)`: Removes a value from the set. If the value doesn't exist, the state remains unchanged. Creates a new Set instance if the value exists.
      - `toggle(value: T)`: Adds the value if it doesn't exist in the set, or removes it if it does. Creates a new Set instance.
      - `reset()`: Resets the set state back to the `initialSet` provided when the hook was first initialized. Creates a new Set instance.
      - `clear()`: Removes all values from the set. Creates a new empty Set instance.
      - `has(value: T)`: Checks if a value exists in the current set state. Returns `true` or `false`. Note: Calling `has` itself does not trigger a re-render.

## How it Works

1.  **State Initialization**: Uses `useState` to initialize the set state. It creates a `new Set()` using the `initialSet` argument passed to the hook.
2.  **Immutability**: All action functions (`add`, `remove`, `toggle`, `reset`, `clear`) work by creating a _new_ `Set` instance based on the previous state before applying the modification. This ensures React detects the change and triggers re-renders.
3.  **Memoized Actions**: The `actions` object is memoized using `useMemo`. The dependency array includes `initialSet`, so the actions object reference only changes if the initial set changes.
4.  **`has` Function**: The `has` action directly checks the current `set` state variable. It doesn't modify state or cause re-renders itself.
