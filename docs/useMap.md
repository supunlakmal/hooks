# `useMap` Hook

A hook to manage state in the form of a JavaScript `Map` object, providing utility functions for common map operations while ensuring immutability for React state updates.

## Usage

Provide an optional initial `Map` or an iterable (like an array of `[key, value]` pairs) to the hook. It returns a tuple: the current `Map` instance and an `actions` object containing functions to modify the map.

```typescript
import React, { useState } from "react";
import { useMap } from "@supunlakmal/hooks"; // Adjust path

function MapStateExample() {
  // Initialize with some default entries
  const initialData: [string, number][] = [
    ["apples", 5],
    ["bananas", 3],
  ];
  const [map, actions] = useMap<string, number>(initialData);

  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("0");

  const handleAddOrUpdate = () => {
    if (keyInput) {
      actions.set(keyInput, parseInt(valueInput, 10) || 0);
      setKeyInput("");
      setValueInput("0");
    }
  };

  const handleRemove = (key: string) => {
    actions.remove(key);
  };

  return (
    <div>
      <h1>useMap Example</h1>

      <div>
        <h3>Current Map Contents:</h3>
        {map.size === 0 ? (
          <p>(Map is empty)</p>
        ) : (
          <ul>
            {[...map.entries()].map(([key, value]) => (
              <li key={key}>
                {key}: {value}
                <button
                  onClick={() => handleRemove(key)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
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
          placeholder="Key"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <input
          type="number"
          placeholder="Value"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
          style={{ marginLeft: "5px" }}
        />
        <button onClick={handleAddOrUpdate} style={{ marginLeft: "5px" }}>
          Set/Update
        </button>
        <button onClick={actions.clear} style={{ marginLeft: "10px" }}>
          Clear All
        </button>
        <button onClick={actions.reset} style={{ marginLeft: "10px" }}>
          Reset to Initial
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <p>Value for 'apples': {actions.get("apples") ?? "Not found"}</p>
      </div>
    </div>
  );
}

export default MapStateExample;
```

## API

```typescript
interface MapActions<K, V> {
  set: (key: K, value: V) => void;
  setAll: (entries: Iterable<readonly [K, V]>) => void;
  remove: (key: K) => void;
  reset: () => void;
  clear: () => void;
  get: (key: K) => V | undefined;
}

type UseMapResult<K, V> = [Map<K, V>, MapActions<K, V>];

function useMap<K, V>(
  initialMap?: Map<K, V> | Iterable<readonly [K, V]>
): UseMapResult<K, V>;
```

### Parameters

- `initialMap`: (Optional) `Map<K, V> | Iterable<readonly [K, V]>` - The initial state for the map. Can be an existing `Map` instance or any iterable that yields `[key, value]` pairs (e.g., an array like `[['a', 1], ['b', 2]]`). If omitted, the map starts empty.

### Returns

- `UseMapResult<K, V>`: A tuple containing:
  1.  `map`: `Map<K, V>` - The current state of the Map.
  2.  `actions`: `MapActions<K, V>` - An object with the following memoized functions to manipulate the map state:
      - `set(key: K, value: V)`: Adds or updates an entry in the map. Creates a new Map instance for the state update.
      - `setAll(entries: Iterable<readonly [K, V]>)`: Adds or updates multiple entries from an iterable. Merges with existing entries by default. Creates a new Map instance.
      - `remove(key: K)`: Removes an entry by its key. If the key doesn't exist, the state remains unchanged. Creates a new Map instance if the key exists.
      - `reset()`: Resets the map state back to the `initialMap` provided when the hook was first initialized. Creates a new Map instance.
      - `clear()`: Removes all entries from the map. Creates a new empty Map instance.
      - `get(key: K)`: Retrieves the value associated with a key from the current map state. Note: Calling `get` itself does not trigger a re-render.

## How it Works

1.  **State Initialization**: Uses `useState` to initialize the map state. It creates a `new Map()` using the `initialMap` argument passed to the hook.
2.  **Immutability**: All action functions (`set`, `setAll`, `remove`, `reset`, `clear`) work by creating a _new_ `Map` instance based on the previous state before applying the modification. This is crucial for React state updates, ensuring that React detects the change and triggers a re-render.
3.  **Memoized Actions**: The `actions` object containing the manipulator functions is memoized using `useMemo`. The dependency array includes `initialMap`, meaning the actions object reference only changes if the initial map provided to the hook changes (which is typically rare).
4.  **`get` Function**: The `get` action directly accesses the current `map` state variable to retrieve a value. It doesn't modify state or cause re-renders itself.
