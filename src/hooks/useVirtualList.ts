import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVirtualListOptions<T> {
  /** Height of each item in pixels. Assumes fixed height for simplicity. */
  itemHeight: number;
  /** The full list of data items. */
  list: T[];
  /** Ref to the scrollable container element. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Number of items to render above and below the visible area (overscan). Defaults to 5. */
  overscan?: number;
  /** Optional initial scroll top position. */
  initialScrollTop?: number;
  /** Optional callback when scroll position changes. */
  onScroll?: (scrollTop: number) => void;
}

interface VirtualItem<T> {
  /** The original data item. */
  data: T;
  /** The index of the item in the original list. */
  index: number;
  /** The calculated top offset for positioning the item. */
  offsetTop: number;
}

interface UseVirtualListResult<T> {
  /** The subset of items that should be currently rendered. */
  virtualItems: VirtualItem<T>[];
  /** The total height of the list content (for the scrollable container). */
  totalHeight: number;
  /** Ref to the inner element that holds the virtual items. Should be placed inside the containerRef element. */
  innerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Optimizes rendering of long lists by only rendering the items currently visible
 * in the viewport, plus a configurable number of items above and below (overscan).
 * Assumes fixed item height for simplicity.
 *
 * @template T The type of the items in the list.
 * @param options Configuration options including the list data, item height, and container ref.
 * @returns An object containing the items to render and the total list height.
 */
export const useVirtualList = <T>(
  options: UseVirtualListOptions<T>
): UseVirtualListResult<T> => {
  const {
    list,
    itemHeight,
    containerRef,
    overscan = 5,
    initialScrollTop = 0,
    onScroll,
  } = options;

  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const innerRef = useRef<any>(null);

  // Update scroll position on scroll events
  const handleScroll = useCallback(
    (event: Event) => {
      const currentScrollTop = (event.target as HTMLElement).scrollTop;
      setScrollTop(currentScrollTop);
      onScroll?.(currentScrollTop);
    },
    [onScroll]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial scroll position if provided
    if (initialScrollTop > 0) {
      container.scrollTop = initialScrollTop;
    }

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, handleScroll, initialScrollTop]);

  const totalHeight = list.length * itemHeight;

  // Calculate visible items based on scroll position
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    list.length - 1,
    Math.floor(
      (scrollTop + (containerRef.current?.clientHeight || 0)) / itemHeight
    ) + overscan
  );

  const virtualItems = list
    .slice(startIndex, endIndex + 1)
    .map((item, index) => {
      const originalIndex = startIndex + index;
      return {
        data: item,
        index: originalIndex,
        offsetTop: originalIndex * itemHeight,
      };
    });

  // Style the inner container to position items correctly
  useEffect(() => {
    if (innerRef.current) {
      // Although items are positioned absolutely, setting the height ensures scrollbar size is correct.
      innerRef.current.style.height = `${totalHeight}px`;
      innerRef.current.style.position = 'relative'; // Needed for absolute positioning of children
    }
  }, [totalHeight]);

  return {
    virtualItems,
    totalHeight,
    innerRef,
  };
};
