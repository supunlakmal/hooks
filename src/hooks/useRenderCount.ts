import { useRef } from "react";

/**
 * Custom hook to track the number of times a component has rendered.
 * Useful for debugging purposes and performance analysis.
 *
 * @returns {number} The current render count (starts at 1).
 */
function useRenderCount(): number {
 
  // Increment on subsequent renders (this runs *after* the return)
  // But since we return the ref's value *before* incrementing, it reflects the render number.
  // On first render, ref is 1, we return 1.
  // On second render, ref is still 1, we return 1, *then* increment to 2.
  // On third render, ref is 2, we return 2, *then* increment to 3.
  // To make it return the actual count *including* the current render, we increment before return.

  // Let's adjust to reflect the render count *including* the current one.
  // We initialize to 0 and increment *before* returning.
  const renderCount = useRef<number>(0);
  renderCount.current += 1;

  return renderCount.current;
}

export default useRenderCount;
