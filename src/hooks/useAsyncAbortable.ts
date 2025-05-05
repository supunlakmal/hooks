import { useState, useCallback, useMemo, useRef, RefObject } from 'react';

/**
 * Represents the state of an asynchronous operation.
 */
interface AsyncState<T, E = Error> {
  loading: boolean;
  error: E | null;
  value: T | undefined; // Use undefined to align with initial state possibility
}

export type UseAsyncActions<Args extends unknown[] = unknown[]> = {
  /**
   *  Start or restart the async function invocation.
   */
  execute: (...params: Args) => Promise<void>; // execute often doesn't need to return the value directly

  /**
   * Reset the state to initial.
   */
  reset: () => void;
};

export type UseAsyncAbortableActions<Args extends unknown[] = unknown[]> =
  UseAsyncActions<Args> & {
    /**
     *  Abort the currently running async function invocation.
     */
    abort: () => void;
  };

export type UseAsyncAbortableMeta<Args extends unknown[] = unknown[]> = {
  /**
   * Call `execute` with provided arguments. Shorthand for `actions.execute`.
   */
  call: (...params: Args) => Promise<void>;

  /**
   * Ref object holding the currently active `AbortController`.
   * Access the controller via `.current`. Note that the controller instance
   * changes on each execution. It's `undefined` if no operation is active.
   */
  abortControllerRef: RefObject<AbortController | undefined>;
};

export type ArgsWithAbortSignal<Args extends unknown[] = unknown[]> = [
  AbortSignal,
  ...Args,
];

/**
 * Like `useAsync`, but also provides `AbortSignal` as the first argument to the async function,
 * and allows aborting the ongoing operation.
 *
 * @template T The type of the value resolved by the async function.
 * @template E The type of the error rejected by the async function. Defaults to `Error`.
 * @template Args The type of the arguments accepted by the async function (excluding the AbortSignal).
 * @param asyncFn Function that accepts AbortSignal and other args, and returns a Promise resolving to T.
 * @param initialValue Value that will be set on initialisation and on reset.
 */
export const useAsyncAbortable = <
  T,
  E = Error,
  Args extends unknown[] = unknown[],
>( // Add export
  asyncFn: (...params: ArgsWithAbortSignal<Args>) => Promise<T>,
  initialValue?: T
): [
  AsyncState<T, E>,
  UseAsyncAbortableActions<Args>,
  UseAsyncAbortableMeta<Args>,
] => {
  // Ref to hold the AbortController for the current or last execution
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  // State for loading, error, and resolved value
  const [state, setState] = useState<AsyncState<T, E>>({
    loading: false,
    error: null,
    value: initialValue, // Initialize with initialValue
  });

  // Memoize the internal function that handles abort logic and calls the user's asyncFn
  const memoizedFn = useCallback(
    async (...args: Args): Promise<T> => {
      // Abort previous async operation if it exists
      abortControllerRef.current?.abort();

      // Create a new controller for the current async call
      const ac = new AbortController();
      abortControllerRef.current = ac;

      try {
        // Pass down abort signal and received arguments to the user's function
        const result = await asyncFn(ac.signal, ...args);
        // If the signal was aborted during the asyncFn execution, throw an error
        // Or let asyncFn handle it internally by checking signal.aborted
        if (ac.signal.aborted) {
          // Optionally throw a specific AbortError or let it proceed if asyncFn handles it.
          // For now, let's assume asyncFn might throw or handle it.
          // If it resolves despite abort, we proceed, but the controller state is 'aborted'.
        }
        return result;
      } finally {
        // Clear the ref *only* if this specific call is the most recent one
        // (i.e., no newer call has overwritten the ref)
        if (abortControllerRef.current === ac) {
          abortControllerRef.current = undefined;
        }
      }
    },
    [asyncFn]
  ); // Dependency: only recreate if the async function itself changes

  // Memoized function to execute the async operation
  const execute = useCallback(
    async (...params: Args): Promise<void> => {
      setState(() => ({
        // Keep previous value during loading for smoother UI, or reset to initialValue
        // Let's reset to initialValue for consistency with reset()
        value: initialValue,
        loading: true,
        error: null,
      }));

      try {
        const response = await memoizedFn(...params);
        // Check if the operation associated with this state update attempt was aborted *before* setState
        // This check is imperfect because the abort might happen between `await` and here.
        // Relying on the `finally` block in `memoizedFn` and potentially errors thrown due to abort is more robust.
        if (
          abortControllerRef.current === undefined ||
          !abortControllerRef.current.signal.aborted
        ) {
          setState({
            loading: false,
            error: null,
            value: response,
          });
        } else {
          // If it was aborted, keep loading: false but don't update value/error, potentially reset?
          // Or rely on the error path if aborting causes memoizedFn to throw.
          // Let's assume abort causes an error or is handled gracefully.
          // If it resolved *after* being aborted, the state might be ambiguous.
          // Current setup: if it resolves successfully even after abort, it sets the state.
          // If it throws (e.g., DOMException: AbortError), it goes to the catch block.
        }
      } catch (error) {
        // Check if the error is due to the abort signal we controlled
        if (error instanceof Error && error.name === 'AbortError') {
          // If aborted, reset state cleanly or keep error? Let's reset.
          setState({
            loading: false,
            // Setting specific AbortError or null is a design choice.Null is simpler.
            error: null, // Or: error as E if E can be AbortError
            value: initialValue,
          });
        } else {
          // Handle other errors
          setState({
            loading: false,
            error: error as E, // Cast the error to the specified type E
            value: initialValue, // Reset value on error
          });
        }
      }
    },
    [memoizedFn, initialValue]
  ); // Dependencies: the memoized function and initialValue

  // Memoized function to reset the state
  const reset = useCallback(() => {
    // Abort any ongoing operation before resetting state
    abortControllerRef.current?.abort();
    abortControllerRef.current = undefined; // Clear the ref explicitly on reset
    setState({
      loading: false,
      error: null,
      value: initialValue,
    });
  }, [initialValue]); // Dependency: initialValue

  // Memoized actions object
  const actions = useMemo(
    () => ({
      reset,
      abort: () => {
        abortControllerRef.current?.abort();
        // Optionally update state to reflect abort? e.g., set loading: false
        // setState(s => ({...s, loading: false})); // Example
      },
      execute,
    }),
    [execute, reset]
  ); // Dependencies: the memoized execute and reset functions

  // Memoized meta object
  const meta = useMemo(
    () => ({
      // Expose the ref object itself. Consumer accesses .current
      abortControllerRef: abortControllerRef,
      // 'call' is just an alias for execute
      call: execute,
    }),
    [execute, abortControllerRef]
  ); // Dependencies: execute and the ref object itself

  return [state, actions, meta];
};
