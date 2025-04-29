import { useEffect, useRef } from 'react';

function usePreviousDistinct<T>(value: T, compare: (prev: T | undefined, next: T) => boolean = (a, b) => a === b): T | undefined {
  const previousValue = useRef<T>();

  useEffect(() => {
    if (!compare(previousValue.current, value)) {
      previousValue.current = value;
    }
  }, [value, compare]);

  return previousValue.current;
}

export default usePreviousDistinct;