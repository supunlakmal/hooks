# `useHistoryState` Hook

## Description

The `useHistoryState` hook provides a way to manage state with built-in undo/redo capabilities. It allows you to track changes to a state value over time and easily navigate through the history of those changes. This is particularly useful for features like text editors, drawing applications, or any interface where users might want to revert to previous states.

## Usage

Here's a simple example of how to use the `useHistoryState` hook:

```
typescript
import { useHistoryState } from '@supunlakmal/hooks';

function MyComponent() {
  const [count, setCount, goBack, goForward, canGoBack, canGoForward] = useHistoryState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={goBack} disabled={!canGoBack}>Go Back</button>
      <button onClick={goForward} disabled={!canGoForward}>Go Forward</button>
    </div>
  );
}
```

## API

```
typescript
type HistoryStateReturn<T> = [
  T, // present state
  (newState: T) => void, // setState
  () => void, // goBack
  () => void, // goForward
  boolean, // canGoBack
  boolean // canGoForward
];

function useHistoryState<T>(initialState: T): HistoryStateReturn<T>;
```

## Parameters

- **`initialState`**:
  - **Type:** `T` (any type)
  - **Description:** The initial state value. This will be the first value in the history.

## Returns

The `useHistoryState` hook returns an array with the following elements:

- **`present`**:
  - **Type:** `T`
  - **Description:** The current state value. This is the value that is currently being displayed or used.
- **`setState`**:
  - **Type:** `(newState: T) => void`
  - **Description:** A function to update the present state. When called, it adds the new state to the history and updates the present state.
- **`goBack`**:
  - **Type:** `() => void`
  - **Description:** A function to move to the previous state in the history.
- **`goForward`**:
  - **Type:** `() => void`
  - **Description:** A function to move to the next state in the history.
- **`canGoBack`**:
  - **Type:** `boolean`
  - **Description:** A boolean indicating whether there is a previous state to go back to.
- **`canGoForward`**:
  - **Type:** `boolean`
  - **Description:** A boolean indicating whether there is a next state to go forward to.

## How it Works

The `useHistoryState` hook uses the following React hooks:

- **`useState`**: To maintain the current state, the history array, and the pointer position.
- **`useCallback`**: To memoize the `setState`, `goBack`, and `goForward` functions, ensuring they only change when necessary.

**Logic and Calculations:**

- The hook maintains an array called `history` that stores all the past states.
- A `pointer` variable keeps track of the current position within the `history` array.
- When `setState` is called, it adds the new state to the `history` and moves the `pointer` to the end of the history.
- `goBack` and `goForward` functions move the `pointer` backward or forward within the `history` array, respectively, and update the present state accordingly.
- `canGoBack` and `canGoForward` based on the `pointer` postion and the history length.

**Cleanup Procedures:**

- There are no specific cleanup procedures required for this hook, as it doesn't rely on side effects or external resources.

**Reasoning Behind Implementation Choices:**

- Using `useState` with an object containing `history` and `pointer` makes it easy to manage the complex state required by the hook.
- `useCallback` is used to prevent unnecessary re-renders.
- The hook ensures that the `pointer` never goes out of bounds of the `history` array.
