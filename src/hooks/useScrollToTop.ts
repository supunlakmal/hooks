import { useCallback } from "react";

interface ScrollToTopOptions {
  behavior?: ScrollBehavior; // 'auto' or 'smooth'
}

/**
 * Custom hook that provides a function to scroll the window to the top.
 *
 * @param {ScrollToTopOptions} [options] - Optional configuration for the scroll behavior.
 * @param {'auto' | 'smooth'} [options.behavior='auto'] - Defines the transition animation.
 * @returns {() => void} A function that scrolls the window to the top when called.
 */
export const useScrollToTop = ({
  behavior = "auto",
}: ScrollToTopOptions = {}): (() => void) => {


  const scrollToTop: () => void = useCallback(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window !== "undefined") {
      try {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: behavior,
        });
      } catch (e) {
        // Fallback for browsers that don't support smooth scrolling options
        console.warn(
          "ScrollToOptions not supported, falling back to simple scroll."
        );
        window.scrollTo(0, 0);
      }
    }
  }, [behavior]);

  return scrollToTop;
}


