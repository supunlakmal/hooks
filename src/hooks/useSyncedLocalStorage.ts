import { useState, useEffect, useCallback, useRef } from 'react';

// Helper function to safely parse JSON
function safeJsonParse<T>(value: string | null): T | null {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.error('Error parsing JSON from localStorage', e);
    return null; // Return null or a default value if parsing fails
  }
}

// Helper to check if running in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * A hook similar to useState that persists the value in localStorage
 * and syncs its state across multiple tabs/windows using the same key via the 'storage' event.
 *
 * @template T The type of the value to store.
 * @param {string} key The key to use in localStorage.
 * @param {T | (() => T)} initialValue The initial value or a function to compute it.
 * @returns {[T, React.Dispatch<React.SetStateAction<T>>]} A stateful value and a function to update it.
 */
export function useSyncedLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Resolve the initial value once
  const resolvedInitialValue = useRef(
    typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  ).current;

  // Get initial value from localStorage if available, otherwise use the resolved initial value
  const getInitialStoredValue = useCallback(() => {
    if (!isBrowser) {
      return resolvedInitialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      const parsed = safeJsonParse<T>(item);
      // Use parsed value if valid, otherwise fallback to the resolved initial value
      return parsed ?? resolvedInitialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      // Fallback to the resolved initial value on error
      return resolvedInitialValue;
    }
    // Dependency is only on 'key' now, as initialValue is resolved outside and captured in resolvedInitialValue
  }, [key, resolvedInitialValue]); // Depends on resolvedInitialValue

  // State to store our value, initialized using the function above
  const [storedValue, setStoredValue] = useState<T>(getInitialStoredValue);

  // Ref to store the current state setter function, avoids including it in effect deps
  const setStateRef = useRef(setStoredValue);
  useEffect(() => {
    setStateRef.current = setStoredValue;
  }, []);

  // Effect to update localStorage when state changes
  useEffect(() => {
    if (!isBrowser) return;
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]);

  // Effect to listen for storage events from other tabs/windows
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === key &&
        event.newValue !== null &&
        event.storageArea === window.localStorage
      ) {
        try {
          const newValue = safeJsonParse<T>(event.newValue);
          if (newValue !== null) {
            // Use the ref to get the current setter function
            // Check if the new value is actually different to avoid unnecessary re-renders
            // Note: This deep comparison might be expensive for large objects.
            // Consider a shallow comparison or requiring serializable values if performance is critical.
            if (JSON.stringify(newValue) !== JSON.stringify(storedValue)) {
              setStateRef.current(newValue);
            }
          }
        } catch (error) {
          console.error(
            `Error processing storage event for key “${key}”:`,
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // Ensure storedValue is a dependency here to re-evaluate the comparison inside the handler
    // when the local state changes. key is also needed.
  }, [key, storedValue]);

  // Return the state and the setter function
  return [storedValue, setStoredValue];
}
