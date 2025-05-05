# `useAsyncAbortable` Hook

This hook manages asynchronous operations, providing a way to execute an async function and abort it if needed. It provides states for loading, error, and the result of the async operation.

## Usage

```
typescript
import useAsyncAbortable from '@supunlakmal/hooks/useAsyncAbortable';

function MyComponent() {
  const [state, actions, meta] = useAsyncAbortable(
    async (signal, arg1, arg2) => {
      // Make async call here and return result
    },
    initialValue
  );

  // Accessing the abort controller
  const abortController = meta.abortControllerRef.current;

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

## API

```
typescript
interface AsyncState<T, E = Error> {
  loading: boolean;
  error: E | null;
  value: T | undefined;
}

export type UseAsyncAbortableActions<Args extends unknown[] = unknown[]> = {
  execute: (...params: Args) => Promise<void>;
  reset: () => void;
  abort: () => void;
};

export type UseAsyncAbortableMeta<Args extends unknown[] = unknown[]> = {
  call: (...params: Args) => Promise<void>;
  abortControllerRef: RefObject<AbortController | undefined>;
};
```

## Parameters

- **asyncFn**: `(...params: ArgsWithAbortSignal<Args>) => Promise<T>`
  - Type: `function`
  - Description: The asynchronous function to be executed. It receives `AbortSignal` as the first argument.
- **initialValue**: `T` (optional)
  - Type: `any`
  - Description: The initial value of the async operation, if any

## Returns

- `AsyncState<T, E>`: An object with `loading`, `error`, and `value` properties.
  - `loading`: `boolean` - Indicates whether the async operation is in progress.
  - `error`: `E | null` - Stores any error that occurred during the operation.
  - `value`: `T | undefined` - The result of the successful async operation.
- `UseAsyncAbortableActions<Args>`: An object with `execute`, `reset`, and `abort` functions.
  - `execute`: `(...params: Args) => Promise<void>` - Starts or restarts the async function.
  - `reset`: `() => void` - Resets the state to the initial values.
  - `abort`: `() => void` - Aborts the current async operation.
- `UseAsyncAbortableMeta<Args>`: An object with `call` and `abortControllerRef` properties.
  - `call`: `(...params: Args) => Promise<void>` - Shorthand for `actions.execute`.
  - `abortControllerRef`: `RefObject<AbortController | undefined>` - Ref object to access the `AbortController`.

## How it Works

`useAsyncAbortable` uses `useState`, `useCallback`, `useMemo`, and `useRef` to manage the state and lifecycle of the async operation. It creates an `AbortController` for each async call, allowing the operation to be aborted. The `execute` function starts the async call, updating the loading state. The `abort` function aborts the current operation via the `AbortController`. The result or error is stored in the state, and the `reset` function allows reverting to the initial state.
