import { useRef, useCallback, useEffect } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number; // Corresponds to IntersectionObserver threshold
  root?: Element | null;
  rootMargin?: string;
}

/**
 * Custom hook to implement infinite scrolling.
 * It uses IntersectionObserver to detect when a target element is near the bottom
 * of the viewport or scrollable container, triggering a callback to load more data.
 *
 * @param {UseInfiniteScrollOptions} options - Configuration options.
 * @param {boolean} options.loading - Whether data is currently being loaded.
 * @param {boolean} options.hasNextPage - Whether there is more data to load.
 * @param {() => void} options.onLoadMore - Callback function to load more data.
 * @param {number} [options.threshold=0.1] - IntersectionObserver threshold (how much of the target needs to be visible). Defaults to 0.1.
 * @param {Element | null} [options.root=null] - The scrollable container element (defaults to viewport).
 * @param {string} [options.rootMargin='0px'] - IntersectionObserver rootMargin.
 * @returns {RefObject<any>} A ref object to attach to the target element that triggers loading more data when it becomes visible.
 * @returns {(node: T | null) => void} A callback ref setter function to attach to the target element.
 */
export function useInfiniteScroll<T extends Element>({
  loading,
  hasNextPage,
  onLoadMore,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
}: UseInfiniteScrollOptions): (node: T | null) => void {
  const observer = useRef<IntersectionObserver | null>(null);

  // Use `useCallback` for the ref setter to get a stable function reference
  const ref = useCallback(
    (node: T | null) => {
      if (loading || !hasNextPage) return; // Don't observe if loading or no more pages

      // Disconnect previous observer
      if (observer.current) observer.current.disconnect();

      // Create and assign new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            onLoadMore();
          }
        },
        { root, rootMargin, threshold }
      );

      // Observe the node if it exists
      if (node) observer.current.observe(node);
    },
    [loading, hasNextPage, onLoadMore, root, rootMargin, threshold]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return ref; // Return the callback ref function directly
}


