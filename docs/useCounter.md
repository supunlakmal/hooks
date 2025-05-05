# `useCounter` Hook

**Description:**
The `useCounter` hook is a custom React hook designed to manage a numerical counter. It allows for incrementing, decrementing, and resetting the counter. It is useful for keeping track of counts, scores, or any numerical data within your React application.

**Usage:**

```
typescript
import { useCounter } from './src/hooks/useCounter';

function MyComponent() {
  const { count, increment, decrement, reset } = useCounter(0); // Initial count set to 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## API

```
typescript
type UseCounterReturn = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};
```

## Parameters

- **initialValue**
  - Type: `number`
  - Description: The starting value of the counter.
  - Optional: No

## Returns

- **count**
  - Type: `number`
  - Description: The current value of the counter.
- **increment**
  - Type: `() => void`
  - Description: A function to increment the counter by 1.
- **decrement**
  - Type: `() => void`
  - Description: A function to decrement the counter by 1.
- **reset**
  - Type: `() => void`
  - Description: A function to reset the counter to its initial value.

## How it Works

The `useCounter` hook uses the `useState` hook from React to manage the numerical counter. It initializes the counter with the provided `initialValue`.

- **State Management:**
  - `useState` is used to create a state variable `count`.
- **Increment Function:**
  - The `increment` function updates the `count` state by adding 1 to the current value.
- **Decrement Function:**
  - The `decrement` function updates the `count` state by subtracting 1 from the current value.
- **Reset Function:**
  - The `reset` function sets the `count` state back to the `initialValue`.
- No Cleanup procedures.
