import { useRef, useEffect } from "react";

/**
 * A simple utility hook that returns true only on the initial render of a component.
 * Returns false for all subsequent renders.
 *
 * @returns {boolean} True if it's the first render, false otherwise.
 */
function useIsFirstRender(): boolean {
  // Create a ref to track if the component has rendered before
  const isFirst = useRef(true);

  // On the first render, the ref is true. The effect runs *after* the first render.
  useEffect(() => {
    // After the first render, set the ref to false.
    isFirst.current = false;
  }, []); // Empty dependency array ensures this effect runs only once after the initial render.

  // Return the *current* value of the ref. On the first render pass, it's true.
  // On subsequent renders, the ref will have been set to false by the effect.
  return isFirst.current;
}

export default useIsFirstRender;
