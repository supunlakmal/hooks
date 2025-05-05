import { useEffect, useRef } from 'react';

export const usePreviousDifferent = <T>(value: T): T | undefined => {
  const previousRef = useRef<T | undefined>(undefined);
  const previousDifferentRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (previousRef.current !== value) {
      previousDifferentRef.current = previousRef.current;
    }
    previousRef.current = value;
  });

  return previousDifferentRef.current;
};
