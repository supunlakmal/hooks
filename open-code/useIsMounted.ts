import { useState, useEffect, useRef } from 'react';

function useIsMounted(): () => boolean {
  const isMountedRef = useRef<boolean>(false);
  const [isMountedState, setIsMountedState] = useState<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    setIsMountedState(true)
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isMounted = (): boolean => {
    return isMountedRef.current;
  };
  return isMounted;
}

export default useIsMounted;