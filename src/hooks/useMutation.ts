import { useState, useCallback, useRef, useEffect } from "react";

// Status types for the mutation
type MutationStatus = "idle" | "loading" | "success" | "error";

// Result type for the hook
interface UseMutationResult {
  /** The current status of the mutation. */
  status: MutationStatus;
  /** The data returned from a successful mutation. */
  data: any;
  /** The error object if the mutation failed. */
  error: any;
  /** Boolean indicating if the mutation is currently executing. */
  isLoading: boolean;
  /** Boolean indicating if the mutation has successfully completed. */
  isSuccess: boolean;
  /** Boolean indicating if the mutation failed. */
  isError: boolean;
  /** Boolean indicating if the mutation has not started yet. */
  isIdle: boolean;
  /** The function to trigger the mutation. Accepts variables if the mutation function requires them. */
  mutate: (variables: any) => Promise<any>;
  /** Async version of mutate */
  mutateAsync: (variables: any) => Promise<any>;
  /** Resets the mutation state back to idle. */
  reset: () => void;
}

// Options for the hook
interface UseMutationOptions {
  /** Callback function executed on successful mutation. Receives the data and variables. */
  onSuccess?: (data: any, variables: any) => void;
  /** Callback function executed on mutation error. Receives the error and variables. */
  onError?: (error: any, variables: any) => void;
  /** Callback function executed when the mutation starts. Receives the variables. */
  onMutate?: (variables: any) => void;
  /** Callback function executed when mutation finishes (either success or error). Receives data/error and variables. */
  onSettled?: (
    data: any, 
    error: any, 
    variables: any) => void;
}


  
/** 
 * Hook to manage asynchronous operations that modify data (mutations).
 * Handles loading, success, and error states, and provides callbacks.
 *
 * @param mutationFn The asynchronous function that performs the mutation.
 * @param options Optional configuration with callbacks (onSuccess, onError, etc.).
 * @returns State and functions to manage the mutation lifecycle.
 */
export const useMutation = (
  mutationFn: (variables: any) => Promise<any>,
  options?: UseMutationOptions,
): UseMutationResult =>{
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [data, setData] = useState<any>(undefined);
  const [error, setError] = useState<any>(undefined);

  // Use refs for callbacks to avoid including them in the mutate callback dependencies
  const optionsRef = useRef(options);
  const mutationFnRef = useRef(mutationFn);

  // Update refs if options change
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
    async (variables: any): Promise<any> => {
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
        setError(err);
        setStatus("error");
        optionsRef.current?.onError?.(err, variables);
        optionsRef.current?.onSettled?.(undefined, err, variables);
        // Rethrow the error so callers of mutateAsync can catch it if needed
        throw err;
      }
    },
    []
  ); // No dependencies needed due to refs

  const mutate = useCallback(
    (variables: any): Promise<any> => {
      return mutateAsync(variables);
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

