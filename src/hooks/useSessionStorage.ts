import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

// Type definition for the return value, similar to useState
type SetValue<T> = Dispatch<SetStateAction<T>>;

// Helper function to safely get value from sessionStorage
function getSessionStorageValue<T>(
  key: string,
  initialValue: T | (() => T)
): T {
  // Check if sessionStorage is available (client-side)
  if (
    typeof window === "undefined" ||
    typeof window.sessionStorage === "undefined"
  ) {
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  }

  try {
    const item = window.sessionStorage.getItem(key);
    // Parse stored json or return initialValue if item is null/undefined
    return item
      ? (JSON.parse(item) as T)
      : typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  } catch (error) {
    // Return initialValue if error parsing JSON or accessing storage
    console.warn(`Error reading sessionStorage key “${key}”:`, error);
    return typeof initialValue === "function"
      ? (initialValue as () => T)()
      : initialValue;
  }
}

/**
 * Custom hook similar to useState but persists the value in sessionStorage.
 *
 * @template T The type of the value to store.
 * @param {string} key The key under which to store the value in sessionStorage.
 * @param {T | (() => T)} initialValue The initial value or a function to compute it. This is used if the key is not found in sessionStorage.
 * @returns {[T, SetValue<T>]} A tuple containing the current value and a function to update it.
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, SetValue<T>] {
  // State to store our value
  // Pass lazy initial state function to useState
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getSessionStorageValue(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that...
  // ...persists the new value to sessionStorage.
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to sessionStorage
        if (typeof window !== "undefined" && window.sessionStorage) {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.warn(`Error setting sessionStorage key “${key}”:`, error);
      }
    },
    [key, storedValue]
  ); // Include storedValue if value can be a function

  // Read latest stored value from sessionStorage when key changes
  useEffect(() => {
    setStoredValue(getSessionStorageValue(key, initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only re-run if key changes

  // Optional: Listen to storage events (less relevant for sessionStorage but can handle programmatic changes)
  // Note: Standard 'storage' event doesn't fire for sessionStorage changes.
  // You might need custom event logic if cross-component sync (without prop drilling) is needed.
  // For simplicity, we'll omit direct cross-component sync via storage events here.

  return [storedValue, setValue];
}


