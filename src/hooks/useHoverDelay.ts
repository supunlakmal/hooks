import { useState, useEffect, RefObject } from 'react';
import { useHover } from './useHover'; // Returns [ref, isHovered]
import { useTimeout } from './useTimeout'; // Signature: (cb, delay | null) => void

/**
 * Tracks if an element has been hovered for a minimum specified duration.
 * Returns a ref to attach to the element and a boolean state.
 * The state becomes true only after hover persists for `delay` milliseconds.
 * The state becomes false immediately when hover ends.
 *
 * @param delay The minimum hover duration in milliseconds before returning true.
 * @returns {[RefObject<T | null>, boolean]} A tuple containing:
 *           - hoverRef: Ref to attach to the target element.
 *           - isDelayedHover: Boolean state indicating if hover delay is met.
 */
export function useHoverDelay<T extends HTMLElement = HTMLElement>(
  delay: number
): [RefObject<T | null>, boolean] {
  // Get ref and live hover state from useHover
  const [hoverRef, isHovering] = useHover<T>();

  // State to track if the delay has been met
  const [isDelayedHover, setIsDelayedHover] = useState<boolean>(false);

  // Callback for the timeout - sets state to true when delay completes
  const timeoutCallback = () => {
    setIsDelayedHover(true);
  };

  // Use useTimeout. Pass the delay if hovering, or null to clear/prevent if not.
  useTimeout(
    timeoutCallback,
    isHovering ? delay : null
  );

  // Effect to handle the immediate reset when hover stops.
  // This is necessary because useTimeout only triggers the callback *after* the delay.
  // If the user stops hovering *before* the delay is met, we need to reset isDelayedHover immediately.
  useEffect(() => {
    if (!isHovering) {
      setIsDelayedHover(false);
    }
    // This effect depends only on the live hovering state.
  }, [isHovering]);

  // Return the ref from useHover and the calculated delayed state
  return [hoverRef, isDelayedHover];
}
