# `useMediatedState` Hook

## Description

The `useMediatedState` hook allows you to manage state that can be updated both internally and externally through a mediator function. This is useful when you need to synchronize state changes between different parts of your application or when state updates should be processed or validated before being applied.

## Usage

```
typescript
import { useMediatedState } from '@supunlakmal/hooks';

function MyComponent() {
  const [state, setState] = useMediatedState<number>(0, (newValue, currentValue) => {
    console.log('Mediator function called with:', newValue, currentValue);
    if (newValue > 100) {
      return 100;
    }
    if (newValue < 0) {
      return 0
    }
    return newValue;
  });

  return (
    <div>
      <p>Current state: {state}</p>
      <button onClick={() => setState(state + 1)}>Increment</button>
      <button onClick={() => setState(500)}>Set to 500</button>
        <button onClick={() => setState(-1)}>Set to -1</button>
    </div>
  );
}
```

## API

```
typescript
type Mediator<T> = (newValue: T, currentValue: T) => T;

function useMediatedState<T>(
  initialValue: T | (() => T),
  mediator: Mediator<T>
): [T, React.Dispatch<React.SetStateAction<T>>];
```

## Parameters

- **initialValue:** `T | (() => T)`
  - Type: `T` or a function that returns `T`.
  - Description: The initial value of the state. Can be a direct value or a function that provides the initial value.
- **mediator:** `Mediator<T>`
  - Type: `(newValue: T, currentValue: T) => T`
  - Description: A function that receives the proposed new value and the current value. It must return the value that will actually be set as the new state. This allows for validation, transformation, or rejection of the new value.

## Returns

- **state:** `T`
  - Type: `T`
  - Description: The current state value.
- **setState:** `React.Dispatch<React.SetStateAction<T>>`
  - Type: `(value: T | ((prevState: T) => T)) => void`
  - Description: A function to update the state. It accepts either a new value or a function that receives the previous state and returns the new state. The `mediator` function is called before the state is updated.

## How it Works

The `useMediatedState` hook uses the `useState` hook internally to manage the state. When the `setState` function is called, it passes the new value and the current value to the `mediator` function. The `mediator` function then processes these values and returns the value that should be used to update the state.

- **React Hooks:** `useState` is used to manage the state.
- **Logic and Calculations:** The hook relies on the `mediator` function for any calculations or transformations.
- **Cleanup Procedures:** No specific cleanup is needed as it primarily relies on `useState`.
- **Reasoning:** This design pattern is chosen to encapsulate the logic of state updates, allowing for more controlled and potentially complex state transitions. It abstracts the complexity of state management into the `mediator` function, keeping the component code cleaner.
