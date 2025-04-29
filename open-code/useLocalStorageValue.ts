import { useState, useEffect, useCallback } from 'react';

type ValueType<T> = T | null;

function useLocalStorageValue<T>(key: string, initialValue: T): [ValueType<T>, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<ValueType<T>>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue === null ? initialValue : storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue, initialValue]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(null);
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    },[key])

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
        console.error(error)
    }
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorageValue;