import { useState, useEffect } from 'react';

const isBrowser = typeof window !== 'undefined';
const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Hook to detect if the user prefers reduced motion based on system settings.
 *
 * Uses the `prefers-reduced-motion` media query.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise, or null if not supported/determined yet.
 */
export function usePrefersReducedMotion(): boolean | null {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean | null>(
    isBrowser ? window.matchMedia(QUERY).matches : null
  );

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const mediaQueryList = window.matchMedia(QUERY);

    // Set initial state based on current match
    // (This might be redundant due to useState initializer, but safe)
    setPrefersReducedMotion(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Use addEventListener if available, otherwise fallback to addListener (for older Safari)
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener);
    } else if (mediaQueryList.addListener) {
      mediaQueryList.addListener(listener);
    }

    // Cleanup function
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener);
      } else if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(listener);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return prefersReducedMotion;
}
