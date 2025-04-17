# `useFiniteStateMachine`

A hook for managing complex component state using an explicit state machine definition, inspired by libraries like XState.

## Usage

Define a state machine configuration object and pass it to the hook.

```tsx
import React, { useState } from "react";
import { useFiniteStateMachine, StateMachineConfig } from "your-hooks-library"; // Adjust import path

type FetchState = "idle" | "loading" | "success" | "error";
type FetchEvent = "FETCH" | "SUCCESS" | "ERROR" | "RETRY";
interface FetchContext {
  data?: any;
  error?: string;
  retries: number;
}

const fetchMachineConfig: StateMachineConfig<
  FetchState,
  FetchEvent,
  FetchContext
> = {
  initial: "idle",
  context: {
    retries: 0,
  },
  states: {
    idle: {
      on: {
        FETCH: "loading",
      },
    },
    loading: {
      entry: [(ctx) => console.log("Entering loading state...")],
      on: {
        SUCCESS: {
          target: "success",
          actions: [
            (ctx, payload) => ({ data: payload, error: undefined }), // Update context with data
          ],
        },
        ERROR: {
          target: "error",
          actions: [
            (ctx, payload) => ({ error: payload, data: undefined }), // Update context with error
          ],
        },
      },
      exit: [(ctx) => console.log("Exiting loading state.")],
    },
    success: {
      on: {
        FETCH: "loading", // Allow fetching again
      },
    },
    error: {
      on: {
        RETRY: {
          target: "loading",
          actions: [
            (ctx) => ({ retries: ctx.retries + 1 }), // Increment retry count
          ],
          cond: (ctx) => ctx.retries < 3, // Condition: only retry if retries < 3
        },
        FETCH: "loading", // Allow fetching again, resetting retries implicitly by context reset on fetch
      },
    },
  },
};

const DataFetcher: React.FC = () => {
  const { currentState, context, send, matches } =
    useFiniteStateMachine(fetchMachineConfig);
  const [userId, setUserId] = useState("1");

  const handleFetch = () => {
    send("FETCH");

    // Simulate API call
    setTimeout(async () => {
      try {
        // Simulate potential failure based on context or other factors
        if (Math.random() < 0.3 && context.retries < 2) {
          throw new Error(
            `Simulated network error (Retry attempt: ${context.retries + 1})`
          );
        }
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        send({ type: "SUCCESS", payload: data });
      } catch (error: any) {
        send({ type: "ERROR", payload: error.message || "Unknown error" });
      }
    }, 1500); // Simulate network delay
  };

  const handleRetry = () => {
    send("RETRY");
    // If the retry transition occurs (condition met), re-trigger the fetch logic
    // We need a way to re-run the fetch logic on entering 'loading' after RETRY.
    // This example simplifies by requiring manual re-fetch click after retry state change.
    // A more robust implementation might use state entry actions or effects.
    handleFetch(); // Re-trigger fetch immediately on retry for simplicity here
  };

  return (
    <div>
      <h2>Finite State Machine Fetcher</h2>
      <p>
        Current State: <strong>{currentState}</strong>
      </p>
      <p>Retries: {context.retries}</p>

      <div>
        <label>User ID:</label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={matches("loading")}
        />
      </div>

      {matches("idle") && <button onClick={handleFetch}>Fetch User</button>}
      {matches("loading") && <p>Loading...</p>}
      {matches("success") && (
        <div>
          <h3>Success!</h3>
          <pre>{JSON.stringify(context.data, null, 2)}</pre>
          <button onClick={handleFetch}>Fetch Again</button>
        </div>
      )}
      {matches("error") && (
        <div>
          <h3>Error</h3>
          <p style={{ color: "red" }}>{context.error}</p>
          {context.retries < 3 ? (
            <button onClick={handleRetry}>Retry</button>
          ) : (
            <p>Max retries reached.</p>
          )}
          <button onClick={handleFetch}>Fetch Again (Start Over)</button>
        </div>
      )}
    </div>
  );
};

export default DataFetcher;
```

## API

### `useFiniteStateMachine<TState, TEvent, TContext>(config: StateMachineConfig<TState, TEvent, TContext>): StateMachineInstance<TState, TEvent, TContext>`

#### Generics

- `TState` (string literal type, required): A union of all possible state names (e.g., `'idle' | 'loading' | 'success'`).
- `TEvent` (string literal type, required): A union of all possible event names (e.g., `'FETCH' | 'SUCCESS' | 'ERROR'`).
- `TContext` (type, optional): The type of the context object associated with the machine. Defaults to `any`.

#### Parameters

- `config` (`StateMachineConfig<TState, TEvent, TContext>`, required): The configuration object defining the state machine.

  - `initial` (`TState`): The initial state the machine starts in.
  - `context` (`TContext`, optional): An initial context object.
  - `states` (object): An object where keys are state names (`TState`). Each state object contains:
    - `on` (object, optional): An object where keys are event names (`TEvent`). The value defines the transition for that event:
      - **Shorthand:** `targetState` (`TState`): Directly specifies the target state name.
      - **Full Object:**
        - `target` (`TState`): The target state name.
        - `actions` (array, optional): An array of action functions `(context: TContext, eventPayload?: any) => Partial<TContext> | void`. These are executed during the transition. They receive the current context and the event payload. They can return an object with properties to update the context (shallow merge).
        - `cond` (function, optional): A condition function `(context: TContext, eventPayload?: any) => boolean`. If it returns `false`, the transition is blocked.
    - `entry` (array, optional): An array of action functions `(context: TContext) => Partial<TContext> | void`. These are executed when entering this state. They can update the context.
    - `exit` (array, optional): An array of action functions `(context: TContext) => Partial<TContext> | void`. These are executed when exiting this state. They can update the context.

#### Returns (`StateMachineInstance<TState, TEvent, TContext>` object)

- `currentState` (`TState`): The current state value of the machine.
- `context` (`TContext`): The current context object of the machine.
- `send` (`(event: TEvent | { type: TEvent; payload?: any }) => void`): A function to dispatch events to the machine. Accepts either just the event name (`TEvent`) or an object `{ type: TEvent, payload?: any }` to include data with the event.
- `matches` (`(state: TState) => boolean`): A utility function to check if the `currentState` matches the given state name.

## How it Works

1.  **State Management**: Uses `useState` internally to track the `currentState` and `context`.
2.  **Event Dispatch (`send`)**: When `send` is called:
    - It looks up the current state's configuration.
    - It finds the transition definition for the received event type.
    - If a `cond` (condition) function exists, it's evaluated. If false, the transition stops.
    - If the transition proceeds:
      - Exit actions for the current state are executed.
      - Transition actions (defined in `on`) are executed.
      - Entry actions for the target state are executed.
      - All actions can potentially update the context.
      - The `context` state is updated with the accumulated changes.
      - The `currentState` is updated to the target state.
3.  **Memoization**: The returned object (`machineInstance`) is memoized using `useMemo` to maintain a stable reference as long as the underlying state or context hasn't changed.

## Notes

- This hook provides a basic implementation. For more advanced features like parallel states, history states, or invoking services/actors, consider using a dedicated library like [XState](https://xstate.js.org/).
- Context updates within actions are shallowly merged.
- Order of execution: `exit` actions (current state) -> `transition` actions -> `entry` actions (target state).
