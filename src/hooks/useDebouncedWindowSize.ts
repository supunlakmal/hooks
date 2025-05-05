import { useEffect } from 'react';
import { useWindowSize, WindowSize } from './useWindowSize'; // Assuming signature: () => { width: number; height: number }
import { useDebouncedState } from './useDebouncedState'; // Assuming signature: <S>(initialState: S, delay: number) => [S, (value: S) => void]

/**
 * A hook that provides debounced window dimensions.
 * Useful for reacting to window size changes without excessive re-renders during rapid resizing.
 *
 * @param delay The debounce delay in milliseconds.
 * @returns An object containing the debounced `width` and `height` of the window. Returns { width: 0, height: 0 } on the server or if window is undefined.
 */
export function useDebouncedWindowSize(delay: number): WindowSize {
  // Get the live window size
  const liveSize = useWindowSize();

  // Create debounced state, initialized with the current live size
  const [debouncedSize, setDebouncedSize] = useDebouncedState<WindowSize>(
    liveSize,
    delay
  );

  // Effect to update the debounced state when the live size changes
  useEffect(() => {
    setDebouncedSize(liveSize);
    // Depend on the liveSize object. Using width/height individually might cause unnecessary runs
    // if the object reference changes but values don't, though useWindowSize likely memoizes.
  }, [liveSize, setDebouncedSize]);

  // Return the debounced dimensions
  return debouncedSize;
}
