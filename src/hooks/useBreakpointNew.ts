import { useEffect, useState } from "react";

// Define default breakpoints (inspired by Tailwind CSS)
const defaultBreakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const; // Use 'as const' for stricter type inference

type DefaultBreakpointKey = keyof typeof defaultBreakpoints;

/**
 * Custom hook to determine the currently active responsive breakpoint based on window width.
 *
 * @template K Type of the breakpoint keys (defaults to keys of defaultBreakpoints).
 * @param {Record<K, string>} [customBreakpoints] - Optional custom breakpoints object. Keys are breakpoint names, values are media query strings.
 * @returns {K | null} The key of the largest currently active breakpoint, or null if none match.
 */
function useBreakpoint<K extends string = DefaultBreakpointKey>(
  customBreakpoints?: Record<K, string>
): K | null {
  const breakpoints = customBreakpoints ?? defaultBreakpoints;
  const [activeBreakpoint, setActiveBreakpoint] = useState<K | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return; // Cannot determine breakpoint on server or without matchMedia
    }

    const mediaQueryLists: { key: K; mql: MediaQueryList }[] = [];
    const listeners: {
      mql: MediaQueryList;
      listener: (event: MediaQueryListEvent) => void;
    }[] = [];

    const checkBreakpoints = () => {
      // Sort keys by descending min-width value extracted from the query
      const sortedKeys = Object.entries(breakpoints)
        .sort(([, queryA], [, queryB]) => {
          const widthA = parseInt(
            (queryA as string).match(/\d+/)?.[0] || "0",
            10
          );
          const widthB = parseInt(
            (queryB as string).match(/\d+/)?.[0] || "0",
            10
          );
          return widthB - widthA; // Sort descending by width
        })
        .map(([key]) => key as K);

      let currentActive: K | null = null;
      for (const key of sortedKeys) {
        const mediaQuery = breakpoints[key as keyof typeof breakpoints];
        if (window.matchMedia(mediaQuery).matches) {
          currentActive = key;
          break; // Found the largest active breakpoint
        }
      }

      setActiveBreakpoint(currentActive);
    };

    // Initial check
    checkBreakpoints();

    // Set up listeners for changes
    Object.entries(breakpoints).forEach(([key, query]) => {
      const mql = window.matchMedia(query as string);
      const listener = () => {
        checkBreakpoints(); // Re-check all breakpoints on any change
      };

      if (mql.addEventListener) {
        mql.addEventListener("change", listener);
      } else {
        mql.addListener(listener); // Deprecated fallback
      }
      mediaQueryLists.push({ key: key as K, mql });
      listeners.push({ mql, listener });
    });

    // Cleanup listeners
    return () => {
      listeners.forEach(({ mql, listener }) => {
        if (mql.removeEventListener) {
          mql.removeEventListener("change", listener);
        } else {
          mql.removeListener(listener);
        }
      });
    };
  }, [breakpoints]); // Re-run effect if breakpoints object changes

  return activeBreakpoint;
}

export default useBreakpoint;