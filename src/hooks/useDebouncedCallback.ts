import { useCallback, useRef } from 'react';

type Procedure = (...args: any[]) => void;

function useDebouncedCallback<T extends Procedure>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

export default useDebouncedCallback;