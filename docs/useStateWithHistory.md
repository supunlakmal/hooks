# `useStateWithHistory` Hook

Manages state similarly to `useState`, but additionally keeps track of the state's history, enabling undo (`back`), redo (`forward`), and direct navigation (`go`) through the state changes.

## Usage

Provide an initial state value and optionally a maximum history capacity. The hook returns an object containing the current state, a `setState` function (which automatically updates history), the history array itself, the current position (pointer) in the history, navigation functions (`back`, `forward`, `go`), and boolean flags (`canUndo`, `canRedo`) indicating whether undo/redo actions are possible.

```typescript
import React, { useState } from "react";
import { useStateWithHistory } from "@supunlakmal/hooks"; // Adjust path

function HistoryStateExample() {
  const {
    state,
    setState,
    history,
    pointer,
    back,
    forward,
    go,
    canUndo,
    canRedo,
  } = useStateWithHistory(0, 5); // Initial state 0, capacity 5

  const [inputValue, setInputValue] = useState("1"); // For the 'go' input

  return (
    <div>
      <h1>useStateWithHistory Example</h1>
      <p>
        Current State: <strong>{state}</strong>
      </p>
      <p>History Pointer: {pointer}</p>
      <p>History: {JSON.stringify(history)}</p>

      <div style={{ margin: "10px 0" }}>
        <button onClick={() => setState((current) => current + 1)}>
          Increment State (+1)
        </button>
        <button
          onClick={() => setState((current) => current - 1)}
          style={{ marginLeft: "5px" }}
        >
          Decrement State (-1)
        </button>
      </div>

      <div style={{ margin: "10px 0" }}>
        <button onClick={back} disabled={!canUndo}>
          Back (Undo)
        </button>
        <button
          onClick={forward}
          disabled={!canRedo}
          style={{ marginLeft: "5px" }}
        >
          Forward (Redo)
        </button>
      </div>

      <div style={{ margin: "10px 0" }}>
        Go to index:
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          min="0"
          max={history.length - 1}
          style={{ width: "50px", marginLeft: "5px", marginRight: "5px" }}
        />
        <button onClick={() => go(parseInt(inputValue, 10) || 0)}>Go</button>
      </div>

      <p>Can Undo: {canUndo ? "Yes" : "No"}</p>
      <p>Can Redo: {canRedo ? "Yes" : "No"}</p>
    </div>
  );
}

export default HistoryStateExample;
```

## API

```typescript
interface StateWithHistory<T> {
  state: T;
  setState: (newState: T | ((currentState: T) => T)) => void;
  history: T[];
  pointer: number;
  back: () => void;
  forward: () => void;
  go: (index: number) => void;
  canUndo: boolean;
  canRedo: boolean;
}

function useStateWithHistory<T>(
  initialState: T,
  capacity?: number // Default: 10
): StateWithHistory<T>;
```

### Parameters

- `initialState`: `T` - The initial value of the state.
- `capacity`: `number` (Optional) - The maximum number of history entries to store. Defaults to `10`. When the capacity is reached, the oldest entry is removed upon adding a new one.

### Returns

- `StateWithHistory<T>`: An object with the following properties:
  - `state`: `T` - The current state value.
  - `setState`: `(newState: T | ((currentState: T) => T)) => void` - A function to update the state. It works like React's `useState` setter (accepting a value or an updater function). When called:
    - It updates the current `state`.
    - It adds the new state to the `history` array.
    - If the history `pointer` was not at the end (due to an `undo`), it truncates the history from the pointer onwards before adding the new state.
    - It enforces the `capacity` limit.
    - It updates the `pointer` to the latest entry.
  - `history`: `T[]` - An array containing the recorded states, up to the specified `capacity`.
  - `pointer`: `number` - The index within the `history` array that corresponds to the current `state`.
  - `back`: `() => void` - A function to move the `pointer` back one step in history and update the `state` accordingly. Does nothing if `canUndo` is false.
  - `forward`: `() => void` - A function to move the `pointer` forward one step in history and update the `state` accordingly. Does nothing if `canRedo` is false.
  - `go`: `(index: number) => void` - A function to move the `pointer` to a specific `index` in the history array and update the `state`. The index is clamped between `0` and `history.length - 1`.
  - `canUndo`: `boolean` - True if the `pointer` is not at the beginning of the history (index > 0), meaning a `back` operation is possible.
  - `canRedo`: `boolean` - True if the `pointer` is not at the end of the history (index < history.length - 1), meaning a `forward` operation is possible.

## How it Works

1.  **Internal State**: Uses standard `useState` (`state`, `setInternalState`) to hold the _current_ state value, triggering re-renders when it changes.
2.  **History and Pointer Refs**: Uses `useRef` (`historyRef`, `pointerRef`) to store the array of past states and the current index within that array. Refs are used here because changes to the history itself or the pointer shouldn't trigger re-renders directly; only changes to the actual `state` value should.
3.  **Capacity Ref**: Uses `useRef` (`capacityRef`) to store the capacity, preventing updates to capacity from causing unnecessary hook recalculations.
4.  **`setState` Callback**: A memoized `useCallback` function wraps the logic for updating the state.
    - It calculates the `newState` based on the input (value or function).
    - It handles history truncation if `setState` is called after an `undo` operation.
    - It pushes the `newState` to `historyRef.current`.
    - It enforces the `capacity` by shifting out old entries if necessary.
    - It updates `pointerRef.current` to point to the new entry.
    - Crucially, it calls the internal `setInternalState(newState)` to update the actual state value and trigger a re-render.
5.  **Navigation Callbacks**: `go`, `back`, and `forward` are memoized callbacks.
    - `go` calculates the target index, clamps it within bounds, updates `pointerRef.current`, and then calls `setInternalState` with the state value from `historyRef.current` at the new pointer index.
    - `back` and `forward` simply call `go` with the calculated adjacent index.
6.  **Status Flags**: `canUndo` and `canRedo` are calculated directly based on the current `pointerRef.current` and `historyRef.current.length`.
