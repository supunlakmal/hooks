import { useState, useCallback, useRef, useEffect } from "react";

// Status types for the mutation
type MutationStatus = "idle" | "loading" | "success" | "error";

// Result type for the hook
interface UseMutationResult<TData = any, TError = Error, TVariables = void> {
  /** The current status of the mutation. */
  status: MutationStatus;
  /** The data returned from a successful mutation. */
  data: TData | undefined;
  /** The error object if the mutation failed. */
  error: TError | undefined;
  /** Boolean indicating if the mutation is currently executing. */
  isLoading: boolean;
  /** Boolean indicating if the mutation has successfully completed. */
  isSuccess: boolean;
  /** Boolean indicating if the mutation failed. */
  isError: boolean;
  /** Boolean indicating if the mutation has not started yet. */
  isIdle: boolean;
  /** The function to trigger the mutation. Accepts variables if the mutation function requires them. */
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  /** Async version of mutate */
  mutateAsync: (variables: TVariables) => Promise<TData>;
  /** Resets the mutation state back to idle. */
  reset: () => void;
}

// Options for the hook
interface UseMutationOptions<TData = any, TError = Error, TVariables = void> {
  /** Callback function executed on successful mutation. Receives the data and variables. */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback function executed on mutation error. Receives the error and variables. */
  onError?: (error: TError, variables: TVariables) => void;
  /** Callback function executed when the mutation starts. Receives the variables. */
  onMutate?: (variables: TVariables) => void;
  /** Callback function executed when mutation finishes (either success or error). Receives data/error and variables. */
  onSettled?: (
    data: TData | undefined,
    error: TError | undefined,
    variables: TVariables
  ) => void;
}

/**
 * Hook to manage asynchronous operations that modify data (mutations).
 * Handles loading, success, and error states, and provides callbacks.
 *
 * @template TData The type of data returned by the mutation function on success.
 * @template TError The type of error thrown or returned on failure.
 * @template TVariables The type of variables the mutation function accepts.
 * @param mutationFn The asynchronous function that performs the mutation.
 * @param options Optional configuration with callbacks (onSuccess, onError, etc.).
 * @returns State and functions to manage the mutation lifecycle.
 */
function useMutation<TData = any, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<TError | undefined>(undefined);

  // Use refs for callbacks to avoid including them in the mutate callback dependencies
  const optionsRef = useRef(options);
  const mutationFnRef = useRef(mutationFn);

  // Update refs if functions change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    mutationFnRef.current = mutationFn;
  }, [mutationFn]);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(undefined);
    setError(undefined);
  }, []);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setStatus("loading");
      setData(undefined);
      setError(undefined);

      optionsRef.current?.onMutate?.(variables);

      try {
        const result = await mutationFnRef.current(variables);
        setData(result);
        setStatus("success");
        optionsRef.current?.onSuccess?.(result, variables);
        optionsRef.current?.onSettled?.(result, undefined, variables);
        return result;
      } catch (err: any) {
        const typedError = err as TError;
        setError(typedError);
        setStatus("error");
        optionsRef.current?.onError?.(typedError, variables);
        optionsRef.current?.onSettled?.(undefined, typedError, variables);
        // Rethrow the error so callers of mutateAsync can catch it if needed
        throw err;
      }
    },
    []
  ); // No dependencies needed due to refs

  const mutate = useCallback(
    (variables: TVariables): Promise<TData | undefined> => {
      return mutateAsync(variables).catch(() => {
        // Catch the rethrown error from mutateAsync to prevent unhandled promise rejections
        // when using the non-async mutate function. The error state is already set.
        // console.debug("Caught error in non-async mutate wrapper:", err);
        return undefined; // Return undefined on error for the non-async version
      });
    },
    [mutateAsync]
  );

  return {
    status,
    data,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    isIdle: status === "idle",
    mutate,
    mutateAsync,
    reset,
  };
}

export default useMutation;
