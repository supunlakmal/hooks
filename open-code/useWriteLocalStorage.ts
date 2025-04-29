import { useEffect } from 'react';

function useWriteLocalStorage<T>(key: string, value: T): void {
  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);
}

export default useWriteLocalStorage;