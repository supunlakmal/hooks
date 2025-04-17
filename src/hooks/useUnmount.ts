import { useEffect, useRef } from "react";

/**
 * Custom hook that runs a callback function when the component unmounts.
 * Ensures the callback is only called once during the unmount phase.
 *
 * @param onUnmount - The function to call on unmount.
 */
function useUnmount(onUnmount: () => void): void {
  // Use a ref to store the latest callback without causing re-renders
  const onUnmountRef = useRef(onUnmount);

  // Update the ref each time the callback function potentially changes
  useEffect(() => {
    onUnmountRef.current = onUnmount;
  }, [onUnmount]);

  // useEffect with an empty dependency array runs the cleanup only on unmount
  useEffect(() => {
    return () => {
      // Call the latest version of the callback stored in the ref
      onUnmountRef.current();
    };
  }, []); // Empty array ensures this effect runs only once on mount and cleans up on unmount
}

export default useUnmount;
