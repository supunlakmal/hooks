# `useReducerLogger` Hook

A development utility hook that wraps React's built-in `useReducer` hook. It provides the same functionality but adds automatic console logging for every action dispatched and the resulting state changes. Logs are only output when `process.env.NODE_ENV === 'development'`.

This is helpful for debugging state transitions in complex components.

## Usage

Use it as a drop-in replacement for `useReducer`. Pass your reducer, initial state, optional initializer function, and an optional name for the logger instance.

```typescript
import React from "react";
// Import useReducerLogger instead of useReducer
import { useReducerLogger } from "@supunlakmal/hooks"; // Adjust path

// Example State and Actions
interface CounterState {
  count: number;
}

type CounterAction =
  | { type: "INCREMENT"; payload?: number }
  | { type: "DECREMENT"; payload?: number }
  | { type: "RESET" };

// Example Initializer Function (Optional)
const initCounter = (initialCount: number): CounterState => {
  return { count: initialCount };
};

// Example Reducer Function
const counterReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + (action.payload ?? 1) };
    case "DECREMENT":
      return { count: state.count - (action.payload ?? 1) };
    case "RESET":
      return initCounter(0); // Use initializer if needed for reset logic
    default:
      throw new Error("Unknown action type");
    // Or return state; for exhaustive checks
  }
};

function ReducerLoggerExample() {
  const initialStateValue = 0;

  // Use useReducerLogger instead of useReducer
  const [state, dispatch] = useReducerLogger(
    counterReducer,
    initialStateValue,
    initCounter, // Pass the initializer
    "CounterReducer" // Optional name for the logger
  );

  return (
    <div>
      <h1>useReducerLogger Example</h1>
      <p>
        Check the browser console for action and state change logs (only in dev
        mode).
      </p>
      <p>
        Count: <strong>{state.count}</strong>
      </p>
      <div>
        <button onClick={() => dispatch({ type: "INCREMENT", payload: 2 })}>
          Increment (+2)
        </button>
        <button
          onClick={() => dispatch({ type: "DECREMENT" })}
          style={{ marginLeft: "10px" }}
        >
          Decrement (-1)
        </button>
        <button
          onClick={() => dispatch({ type: "RESET" })}
          style={{ marginLeft: "10px" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default ReducerLoggerExample;
```

**(Make sure your development server sets `process.env.NODE_ENV = 'development'` for logs to appear)**

### Console Output Example:

```text
▼ CounterReducer Initial State @ 10:30:00 AM
    Initial State: ▶ {count: 0}
▼ CounterReducer Action @ 10:30:05 AM
    Previous State: ▶ {count: 0}
    Action: ▶ {type: 'INCREMENT', payload: 2}
    Next State: ▶ {count: 2}
▼ CounterReducer Action @ 10:30:08 AM
    Previous State: ▶ {count: 2}
    Action: ▶ {type: 'DECREMENT'}
    Next State: ▶ {count: 1}
▼ CounterReducer Action @ 10:30:10 AM
    Previous State: ▶ {count: 1}
    Action: ▶ {type: 'RESET'}
    Next State: ▶ {count: 0}
```

## API

```typescript
import { Reducer, Dispatch } from "react";

function useReducerLogger<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  initializer?: (initialArg: S) => S, // Optional
  loggerName?: string // Optional, default: 'Reducer'
): [S, Dispatch<A>];
```

### Parameters

Takes the same arguments as React's `useReducer`, plus an optional logger name:

- `reducer`: `Reducer<S, A>` - The reducer function: `(state, action) => newState`.
- `initialState`: `S` - The initial state value. If `initializer` is provided, this is passed as the argument to `initializer`.
- `initializer`: `(initialArg: S) => S` (Optional) - A function that returns the computed initial state.
- `loggerName`: `string` (Optional) - A name for this reducer instance, used as a prefix in console log groups. Defaults to `'Reducer'`.

### Returns

- `[S, Dispatch<A>]`: A tuple containing the current state (`S`) and the dispatch function (`Dispatch<A>`), exactly like the return value of `useReducer`.

## How it Works

1.  **Development Check**: The logging logic is wrapped in `if (process.env.NODE_ENV === 'development')` checks, so it adds no overhead in production builds (assuming `NODE_ENV` is correctly set and dead code elimination is performed by the bundler).
2.  **Initial State Logging**: Uses `useRef` to track if the component has mounted. On the first render in development, it logs the computed initial state in a collapsed console group.
3.  **Reducer Wrapping**: It creates a new function (`reducerWithLogger`) that wraps the original `reducer`.
4.  **Logging Logic**: Inside `reducerWithLogger`:
    - It first calls the original `reducer` to get the `nextState`.
    - If in development mode, it creates a collapsed console group (`console.groupCollapsed`) labeled with the `loggerName`, timestamp, and potentially the action type.
    - It logs the `Previous State`, the `Action` object, and the `Next State` within the group using styled `console.log` messages.
    - It closes the console group (`console.groupEnd()`).
    - Finally, it returns the `nextState` calculated by the original reducer.
5.  **Internal `useReducer`**: It calls React's `useReducer` hook internally, but passes the wrapped `reducerWithLogger` instead of the original one.
6.  **Return Value**: It returns the `state` and `dispatch` function obtained from the internal `useReducer` call, maintaining the standard hook signature.
