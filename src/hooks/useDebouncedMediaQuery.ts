import { useMediaQuery } from './useMediaQuery'; // Assuming path and signature: (query: string) => boolean
import { useDebouncedState } from './useDebouncedState'; // Assuming path and signature: <S>(initialState: S, delay: number) => [S, (value: S) => void]
import { useEffect } from 'react';

/**
 * A hook that tracks whether a media query matches, but debounces the result.
 * Useful to avoid rapid state changes during events like window resizing.
 *
 * @param query The media query string (e.g., '(min-width: 768px)').
 * @param delay The debounce delay in milliseconds.
 * @returns A boolean indicating whether the media query matches (debounced).
 */
export function useDebouncedMediaQuery(
  query: string,
  delay: number
): boolean {
  // Get the live match state from useMediaQuery
  const matches = useMediaQuery(query);

  // Create a debounced version of the match state
  const [debouncedMatches, setDebouncedMatches] = useDebouncedState(
    matches, // Initialize debounced state with the current live state
    delay
  );

  // Effect to update the debounced state when the live state changes
  useEffect(() => {
    setDebouncedMatches(matches);
  }, [matches, setDebouncedMatches]);

  // Return the debounced value
  return debouncedMatches;
}
