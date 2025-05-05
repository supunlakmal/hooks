import { useEffect } from 'react';
import { useFetch } from './useFetch'; // Assuming path and export
import { useDebouncedState } from './useDebouncedState'; // Assuming path

/**
 * A hook that fetches data like useFetch but debounces the request trigger.
 * Useful for cases like search inputs where you don't want to fetch on every keystroke.
 *
 * @param initialUrl The URL to fetch initially. Can be changed later.
 * @param options Options for the fetch request (standard RequestInit).
 * @param delay The debounce delay in milliseconds.
 * @returns The state and methods returned by the underlying useFetch hook (typed as any).
 */
export function useDebouncedFetch<T = any>(
  initialUrl: string | undefined,
  options: RequestInit = {},
  delay: number
): any {
  // Return type explicitly set to any
  // Debounce the URL and options that trigger the fetch
  const [debouncedUrl, setDebouncedUrl] = useDebouncedState(initialUrl, delay);
  const [debouncedOptions, setDebouncedOptions] = useDebouncedState(
    options,
    delay
  );

  // Update debounced values when inputs change
  useEffect(() => {
    setDebouncedUrl(initialUrl);
  }, [initialUrl, setDebouncedUrl]);

  useEffect(() => {
    setDebouncedOptions(options);
  }, [options, setDebouncedOptions]);

  // Use the debounced values with useFetch
  // Ensure debouncedUrl is string | undefined | null as expected by useFetch (adjust if necessary)
  const fetchState = useFetch<T>(debouncedUrl, debouncedOptions);

  return fetchState;
}
