import { useState, useEffect, useRef } from 'react';

export default function useThrottledState<T>(
  initialValue: T,
  delay: number = 500
): [T, (newValue: T | ((prevValue: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [throttledValue, setThrottledValue] = useState<T>(initialValue);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
      return;
    } else {
       timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);
    }

    return () => { if(timer) clearTimeout(timer)};
  }, [value, delay]);

  return [throttledValue, setValue] as const ;
}