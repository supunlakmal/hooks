import { useState, useEffect, useCallback } from "react";

/**
 * Represents the state of an asynchronous operation.
 *
 * @template T The type of the value returned by the async function.
 * @template E The type of the error thrown by the async function (defaults to Error).
 */
interface AsyncState<T, E = Error> {
  loading: boolean;
  error: E | null;
  value: T | null;
}

/**
 * Represents the return value of the useAsync hook.
 *
 * @template T The type of the value returned by the async function.
 * @template E The type of the error thrown by the async function.
 */
interface UseAsyncReturn<T, E = Error> extends AsyncState<T, E> {
  execute: () => Promise<void>;
}

/**
 * Custom hook to manage the state of an asynchronous function call.
 *
 * @template T The expected type of the successful result.
 * @template E The expected type of the error (defaults to Error).
 * @param {() => Promise<T>} asyncFunction The asynchronous function to execute.
 * @param {boolean} [immediate=true] Whether to execute the function immediately on mount. Defaults to true.
 * @returns {UseAsyncReturn<T, E>} An object containing the loading state, error, value, and an execute function.
 */
function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T, E> {
  const [state, setState] = useState<AsyncState<T, E>>({
    loading: immediate,
    error: null,
    value: null,
  });

  // The execute function wraps asyncFunction and manages state updates
  const execute = useCallback(async () => {
    setState({
      loading: true,
      error: null,
      value: null,
    });

    try {
      const response = await asyncFunction();
      setState({
        loading: false,
        error: null,
        value: response,
      });
    } catch (error) {
      setState({
        loading: false,
        error: error as E, // Cast the error to the specified type E
        value: null,
      });
    }
  }, [asyncFunction]);

  // Call execute immediately if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]); // Only re-run if immediate changes, execute dependency is managed by useCallback

  return { ...state, execute };
}

export default useAsync;
