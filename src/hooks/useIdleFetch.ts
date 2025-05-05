import { useState, useCallback } from 'react';
import { useIdleTimer } from './useIdleTimer'; 
import { useFetch, FetchState } from './useFetch'; 

// Define options type for useIdleFetch
interface UseIdleFetchOptions {
  idleTimeout: number; // Timeout in ms before user is considered idle
  fetchOptions?: RequestInit; // Fetch options are optional now
  idleDebounce?: number; // Optional debounce for idle timer
}

/**
 * A hook that combines useIdleTimer and useFetch to trigger a data fetch
 * only when the user becomes active after a period of inactivity.
 *
 * @template T The expected data type from the fetch request.
 * @param targetUrl The URL to fetch data from when the user becomes active.
 * @param options Configuration options including idleTimeout and optional fetchOptions/idleDebounce.
 * @returns The result object from useFetch ({ data, error, loading }).
 */
export function useIdleFetch<T = unknown>(
  targetUrl: string,
  options: UseIdleFetchOptions
): FetchState<T> {
  const { idleTimeout, fetchOptions, idleDebounce } = options;

  // State to control the URL passed to useFetch. Start with null.
  const [fetchUrl, setFetchUrl] = useState<string | null>(null);

  // Call useFetch, passing the stateful URL and options
  const fetchResult = useFetch<T>(fetchUrl, fetchOptions);

  // Callback for when the user becomes active
  const handleOnActive = useCallback(() => {
    console.log('User became active, initiating fetch...');
    // Set the URL to trigger the fetch
    setFetchUrl(targetUrl);
  }, [targetUrl]);

  // Callback for when the user goes idle (required by useIdleTimer)
  const handleOnIdle = useCallback(() => {
    // console.log('User went idle...');
    // Optionally reset fetchUrl to null if you want to refetch *every* time user becomes active
    // setFetchUrl(null);
  }, []);

  // Initialize useIdleTimer
  useIdleTimer({
    onActive: handleOnActive,
    onIdle: handleOnIdle, // Provide the required onIdle
    timeout: idleTimeout,
    debounce: idleDebounce, // Pass optional debounce
  });

  // Return the fetch results (data, error, loading)
  return fetchResult;
}
