# `useSetState` Hook

## Description

The `useSetState` hook provides a way to manage state in a component using an object, similar to the `setState` method in class components. It allows you to update multiple properties of the state object at once, without replacing the entire object. This hook is especially useful for managing complex state objects with multiple properties.

## Usage

A clear code example demonstrating how to use the hook.
```
typescript
import { useSetState } from '@supunlakmal/hooks';

function MyComponent() {
  const [state, setState] = useSetState({ count: 0, name: 'Initial Name' });

  const increment = () => {
    setState({ count: state.count + 1 });
  };

  const updateName = (newName: string) => {
    setState({ name: newName });
  };

  const updateBoth = () => {
      setState({count: state.count + 1, name: "new name"});
  }

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Name: {state.name}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={() => updateName('New Name')}>Update Name</button>
      <button onClick={updateBoth}>update both</button>
    </div>
  );
}
```
## API

Define the TypeScript types and interfaces used by the hook.
```
typescript
type SetState<T> = Partial<T> | ((prevState: T) => Partial<T>);

function useSetState<T extends object>(
  initialState: T | (() => T)
): [T, (newState: SetState<T>) => void];
```
## Parameters

-   **`initialState`**
    -   Type: `T | (() => T)`
    -   Detailed description: The initial state object or a function that returns the initial state.
    - Mark optional parameters: No

## Returns

-   **`state`**
    -   Type: `T`
    -   Details: The current state object.
-   **`setState`**
    -   Type: `(newState: SetState<T>) => void`
    -   Details: A function to update the state. It accepts either a partial state object (to update only specific properties) or a function that receives the previous state and returns a partial state object.

## How it Works

The `useSetState` hook uses the `useState` hook internally to manage the state object. It provides a custom `setState` function that merges the partial state updates with the previous state object using the spread syntax (`...prev`).

-   **React hooks used**:
    -   `useState`
-   **Logic and calculations**:
    -   When `setState` is called, it merges the provided partial state with the current state using `Object.assign({}, prev, typeof newState === 'function' ? newState(prev) : newState)`.
-   **Cleanup procedures**:
    -   No special cleanup procedures are needed.
-   **Reasoning behind implementation choices**:
    -   The design choice of merging partial state updates is similar to `setState` in class components, allowing for efficient updates of complex objects.
    - By making it possible to send a callback, it is possible to manage async data.