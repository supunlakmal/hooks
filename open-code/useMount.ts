import { useEffect, useRef } from "react";

/**
 * Custom hook that runs a callback function exactly once when the component mounts.
 *
 * @param onMount - The function to call on mount.
 */
function useMount(onMount: () => void): void {
  // Use a ref to store the callback to ensure the correct function is called,
  // even though useEffect with [] should only run once.
  // This pattern aligns with useUnmount and handles potential edge cases or future extensions.
  const onMountRef = useRef(onMount);

  // Update the ref in case the callback identity changes before the mount effect runs
  // (though unlikely to matter in practice for a mount-only effect).
  onMountRef.current = onMount;

  useEffect(() => {
    // Call the callback stored in the ref
    onMountRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once after initial mount
}

export default useMount;
