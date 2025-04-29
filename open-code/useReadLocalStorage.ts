import { useEffect, useState } from 'react';

function useReadLocalStorage<T>(key: string, defaultValue: T): T | undefined {
  const [storedValue, setStoredValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        setStoredValue(defaultValue);
      } else {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, defaultValue]);

  return storedValue;
}

export default useReadLocalStorage;