# `useMediatedState`

## Overview

`useMediatedState` is a custom React hook that behaves similarly to `useState`, but with an added capability: it allows you to pass every new state value through a "mediator" function before the state is actually updated. This mediator function can modify or transform the incoming value, providing a centralized place to handle state validation, transformation, or clamping.

A key feature is that the initial state value is **not** passed through the mediator by default. Mediation only applies to subsequent updates triggered by the setter.

This hook is particularly useful when:
- You need to consistently transform or validate state updates.
- You want to encapsulate complex state update logic.
- You are building more complex hooks that need to manage state with specific constraints (e.g., `useCounter` which uses it for clamping values).

## API

```typescript
const [state, setMediatedState] = useMediatedState<State, RawState = State>(
  initialState: InitialState<State>,
  mediator?: (resolvedRawValue: RawState) => State
): [State, Dispatch<NextState<RawState, State>>];
```

### Parameters

-   **`initialState: InitialState<State>`**
    -   The initial value for the state, or a function that returns the initial value (e.g., `() => 0`).
    -   This value is used directly and is **not** passed through the `mediator` function upon initialization.
    -   Type: `State | (() => State)`

-   **`mediator?: (resolvedRawValue: RawState) => State`** (optional)
    -   A function that receives the "raw" value intended for a state update and returns the actual value that should be set.
    -   This function is called every time the `setMediatedState` dispatcher is called, but *not* for the `initialState`.
    -   If not provided, the raw value is set directly (assuming `RawState` is assignable to `State`).
    -   Type: `(resolvedRawValue: RawState) => State`

### Return Value

Returns a tuple containing:

1.  **`state: State`**
    -   The current mediated state value.

2.  **`setMediatedState: Dispatch<NextState<RawState, State>>`**
    -   A dispatcher function to update the state.
    -   It accepts either a direct `RawState` value or an updater function `(prevState: State) => RawState`.
    -   The value produced (either directly or by the updater) is then passed to the `mediator` (if provided) before the actual state update occurs.
    -   Type: `(valueOrFn: RawState | ((prevState: State) => RawState)) => void`

### Type Parameters

-   **`State`**: The type of the state managed by the hook (i.e., the type of the value *after* mediation).
-   **`RawState = State`**: The type of the value accepted by the setter *before* it's passed to the `mediator`. Defaults to `State`, meaning if no `mediator` is used or the mediator expects the same type, `RawState` can be omitted.

## Helper Types and Functions (Exported from `useMediatedState.ts`)

These are also exported from `useMediatedState.ts` as they are part of its public API and can be useful when working with the hook or creating similar stateful logic.

-   **`InitialState<State>`**: `State | (() => State)`
    -   Type alias for the initial state, which can be a direct value or an initializer function.
-   **`NextState<State, PreviousState = State>`**: `State | ((previousState: PreviousState) => State)`
    -   Type alias for the next state, which can be a direct value or an updater function.
-   **`resolveInitialState<State>(initialState: InitialState<State>): State`**
    -   A helper function that takes an `InitialState` (value or function) and returns the resolved state value.
-   **`resolveNextState<State, PreviousState = State>(nextState: NextState<State, PreviousState>, previousState: PreviousState): State`**
    -   A helper function that takes a `NextState` (value or function) and the `previousState`, and returns the resolved next state value.

## Example Usage

### Basic Mediation (Logging)

```tsx
import React from 'react';
import { useMediatedState } from './useMediatedState'; // Adjust path as needed

const MyComponent = () => {
  const [name, setName] = useMediatedState<string, string>(
    "Guest",
    (rawValue) => {
      console.log(`Mediating: "${rawValue}" to uppercase.`);
      return rawValue.toUpperCase();
    }
  );

  return (
    <div>
      <p>Current Name: {name}</p>
      <button onClick={() => setName("Alice")}>Set to Alice</button>
      <button onClick={() => setName("bob")}>Set to bob</button>
      <button onClick={() => setName((prev) => prev.toLowerCase() + " (modified)")}>
        Modify
      </button>
    </div>
  );
};

export default MyComponent;
```
In this example, `name` will always be stored in uppercase.
- Initial state: "Guest" (not mediated)
- Click "Set to Alice": `mediator("Alice")` -> "ALICE"
- Click "Set to bob": `mediator("bob")` -> "BOB"
- Click "Modify" (assuming current name is "BOB"): `mediator("bob (modified)")` -> "BOB (MODIFIED)"


### Input Clamping (Similar to `useCounter`)

```tsx
import React from 'react';
import { useMediatedState, type InitialState, type NextState } from './useMediatedState'; // Adjust path

const NumberInput = ({
  initialValue = 0,
  min = 0,
  max = 100,
}: {
  initialValue?: InitialState<number>;
  min?: number;
  max?: number;
}) => {
  const clamp = (value: number) => {
    console.log(`Clamping ${value} between ${min} and ${max}`);
    return Math.min(Math.max(value, min), max);
  };

  // Note: Initial value is NOT clamped by useMediatedState automatically.
  // If initial clamping is needed, do it before passing to the hook:
  const resolvedInitial = typeof initialValue === 'function' ? initialValue() : initialValue;
  const initiallyClamped = clamp(resolvedInitial);


  const [value, setValue] = useMediatedState<number, number>(
    initiallyClamped, // Start with a pre-clamped value
    clamp             // Use clamp as the mediator for updates
  );

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue((v) => v + 10)}>Increment by 10</button>
      <button onClick={() => setValue((v) => v - 10)}>Decrement by 10</button>
      <button onClick={() => setValue(50)}>Set to 50</button>
      <button onClick={() => setValue(150)}>Set to 150 (will be clamped to {max})</button>
      <button onClick={() => setValue(-50)}>Set to -50 (will be clamped to {min})</button>
    </div>
  );
};

export default NumberInput;
```
This example demonstrates how `useMediatedState` can be used to enforce boundaries on a number, similar to how `useCounter` uses it. It also shows the importance of pre-processing the `initialState` if it also needs to be mediated/clamped from the very beginning.

## When to Use `useMediatedState` vs. `useState` with a Manual Mediator

-   **`useMediatedState` is better when:**
    -   The mediation logic is complex or reused across multiple components/hooks.
    -   You want to ensure mediation is consistently applied by encapsulating it within the hook.
    -   You are building other custom hooks that require this mediated behavior (like `useCounter`).

-   **`useState` with manual mediation in the event handler/setter might be simpler when:**
    -   The mediation is very simple and specific to one component.
    -   You need the "raw" unmediated value for other purposes before setting the state. `useMediatedState`'s mediator only returns the final state.

## Internal Helpers

The hook also relies on a small utility `useSyncedRef`.

### `useSyncedRef`

-   **`useSyncedRef<T>(value: T): { readonly current: T }`**
    -   Similar to `useRef`, but it always returns a ref object whose `.current` property reflects the latest `value` passed to it during render.
    -   The ref object itself is stable (memoized).
    -   This is used internally by `useMediatedState` to ensure the `mediator` function used in the setter callback is always the latest one passed to the hook, without needing to re-create the setter callback itself if the `mediator` changes.

This ensures that even if the `mediator` function prop changes, the `setMediatedState` function (which is memoized for performance) will still use the newest `mediator` logic on the next state update.
