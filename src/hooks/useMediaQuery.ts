import { useState, useEffect } from 'react';

/**
 * Custom hook for tracking the state of a CSS media query.
 *
 * @param {string} query The CSS media query string (e.g., '(max-width: 768px)').
 * @returns {boolean} Returns `true` if the media query matches, `false` otherwise.
 *                  Returns `false` during server-side rendering or before the first client-side check.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Ensure window.matchMedia is available (client-side)
    if (typeof window.matchMedia !== 'function') {
      console.warn(
        '`useMediaQuery` requires `window.matchMedia` to function, which is not available in this environment.'
      );
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Handler to update state when query match status changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set the initial state
    setMatches(mediaQueryList.matches);

    // Add listener for changes
    // Using addEventListener for modern browsers, fallback for older ones
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Deprecated method for older browsers (e.g., Safari < 14)
      mediaQueryList.addListener(handleChange);
    }

    // Cleanup function to remove the listener
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]); // Re-run effect if the query string changes

  return matches;
}
