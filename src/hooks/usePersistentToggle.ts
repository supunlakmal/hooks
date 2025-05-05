import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage'; 

/**
 * A hook that provides a boolean state that persists in local storage,
 * along with a function to toggle it.
 *
 * @param key The key to use in local storage.
 * @param initialValue The initial value to use if no value is found in local storage.
 * @returns A tuple containing the current state, a toggle function, and the raw setter function from useLocalStorage.
 */
export function usePersistentToggle(
  key: string,
  initialValue: boolean
): [boolean, () => void, (value: boolean | ((prevState: boolean) => boolean)) => void] { 
  const [storedValue, setStoredValue] = useLocalStorage<boolean>(key, initialValue);

  const toggle = useCallback(() => {
    // Use functional update for robustness
    setStoredValue((prevValue) => !prevValue); 
  }, [setStoredValue]);

  return [storedValue, toggle, setStoredValue];
}

// Optional: Export as default
// export default usePersistentToggle;
