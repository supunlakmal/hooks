import { useRef, useEffect } from 'react';

function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
}

export default useFirstMountState;