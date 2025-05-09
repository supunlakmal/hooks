# `useMapState` Hook

## Description

The `useMapState` hook provides a convenient way to manage an object or a Map-like state in React functional components. It offers helper functions to set, remove, and reset key-value pairs within the state, making it easier to work with object-based state management.

## Usage

Here's an example of how to use the `useMapState` hook:

```
typescript
import { useMapState } from '@supunlakmal/hooks';

function MyComponent() {
  const [myMap, set, remove, reset] = useMapState({ a: 1, b: 2 });

  const handleSet = () => {
    set('c', 3); // Adds { a: 1, b: 2, c: 3 }
  };

  const handleRemove = () => {
    remove('a'); // Removes key 'a'
  };

  const handleReset = () => {
    reset(); // Resets to the initial { a: 1, b: 2 }
  };

  return (
    <div>
      <p>Current State: {JSON.stringify(myMap)}</p>
      <button onClick={handleSet}>Set</button>
      <button onClick={handleRemove}>Remove</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

## API

```
typescript
type MapState<K extends string | number | symbol, V> = {
  [key in K]: V;
};

function useMapState<K extends string | number | symbol, V>(
  initialState: MapState<K, V> = {} as MapState<K, V>
): [
  MapState<K, V>,
  (key: K, value: V) => void,
  (key: K) => void,
  () => void
];
```

## Parameters

- **`initialState`**
  - Type: `MapState<K, V>`
  - Description: The initial state of the object. It is an object with keys of type `K` and values of type `V`.
  - Optional: Yes. If not provided, it defaults to an empty object `{}`.

## Returns

The hook returns an array containing:

- **`state`**
  - Type: `MapState<K, V>`
  - Description: The current state of the object.
- **`set`**
  - Type: `(key: K, value: V) => void`
  - Description: A function to add or update a key-value pair in the object. It takes a `key` of type `K` and a `value` of type `V`.
- **`remove`**
  - Type: `(key: K) => void`
  - Description: A function to remove a key-value pair from the object by key. It takes a `key` of type `K`.
- **`reset`**
  - Type: `() => void`
  - Description: A function to reset the object to its `initialState`.

## How it Works

- **React Hooks Used:**
  - `useState`: Manages the internal state of the object.
  - `useCallback`: Memoizes the `set`, `remove`, and `reset` functions to prevent unnecessary re-renders.
- **Logic and Calculations:**
  - The `set` function updates the state by creating a new object with the new key-value pair added or updated, using the spread syntax (`...prev`).
  - The `remove` function removes a key-value pair by creating a new object without the removed property.
  - The `reset` function sets the state back to the `initialState`.
- **Cleanup Procedures:**
  - There are no specific cleanup procedures required for this hook, as it does not subscribe to any external resources or events.
- **Reasoning Behind Implementation Choices:**
  - `useState` is used because it's the standard way to manage state in functional components.
  - `useCallback` is used to avoid unnecessary re-renders when passing the state updating functions as props.
  - The `remove` function creates a new object and returns it as a new state, effectively removing the specified key-value pair. This approach ensures that the state updates are performed immutably, which is a recommended practice in React.
