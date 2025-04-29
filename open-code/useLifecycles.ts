import { useEffect, useRef } from 'react';

/**
 * Custom hook to run code on component mount and unmount.
 *
 * @param {() => void} onMount - The function to call on mount.
 * @param {() => void} onUnmount - The function to call on unmount.
 */
function useLifecycles(onMount: () => void, onUnmount: () => void): void {
  const onMountRef = useRef(onMount);
  const onUnmountRef = useRef(onUnmount);

  useEffect(() => {
    onMountRef.current();

    return () => {
      onUnmountRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useLifecycles;