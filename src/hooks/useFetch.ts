import { useState, useEffect, useRef } from "react";

interface FetchOptions extends RequestInit {
  // Allows extending with custom options if needed in the future
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook for fetching data from an API endpoint.
 *
 * @template T The expected type of the data to be fetched.
 * @param {string | null | undefined} url The URL to fetch data from. If null or undefined, the fetch is not executed.
 * @param {FetchOptions} [options] Optional fetch options (e.g., method, headers, body).
 * @returns {FetchState<T>} An object containing the fetched data, loading state, and error state.
 */
function useFetch<T>(
  url: string | null | undefined,
  options?: FetchOptions
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Use useRef to keep track of the options object to prevent infinite loops
  // if a new options object is passed on every render.
  // A simple JSON.stringify can be used for deep comparison if needed, but be cautious of performance.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    // Only fetch if the URL is provided
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const fetchData = async () => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await fetch(url, optionsRef.current);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setState({ data: result as T, loading: false, error: null });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error("An unknown error occurred"),
        });
      }
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // Re-run effect only if URL changes. Options dependency managed via ref.

  return state;
}

export default useFetch;
