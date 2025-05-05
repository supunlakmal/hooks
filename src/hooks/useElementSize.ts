import { useState, useEffect, RefObject } from 'react';
import { useResizeObserver } from './useResizeObserver';

interface UseElementSize {
  width: number;
  height: number;
}

/**
 * Custom hook that observes an element's size and provides its width and height.
 *
 * @param elementRef - The ref attached to the element being observed.
 * @returns - The width and height of the element.
 */
export const useElementSize = (
  elementRef: RefObject<HTMLElement | null>
): UseElementSize => {
  const [size, setSize] = useState<UseElementSize>({
    width: 0,
    height: 0,
  });

  // Get the ResizeObserver entry for the element ref
  const entry = useResizeObserver(elementRef);

  // Update size state when ResizeObserver entry changes or the element appears
  useEffect(() => {
    if (entry) {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    }
  }, [entry]);

  return size;
};
