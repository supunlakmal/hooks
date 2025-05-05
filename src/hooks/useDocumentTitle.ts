import { useEffect, useRef } from 'react';

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

interface UseDocumentTitleOptions {
  /**
   * If true, the original document title will be restored when the component unmounts.
   * Defaults to false.
   */
  restoreOnUnmount?: boolean;
}

/**
 * Sets the document title (`document.title`).
 *
 * @param {string} title The string to set as the document title.
 * @param {UseDocumentTitleOptions} [options={ restoreOnUnmount: false }] Options for the hook.
 */
export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = { restoreOnUnmount: false }
): void {
  const { restoreOnUnmount } = options;
  // Store the original title only if we need to restore it
  const originalTitleRef = useRef<string | null>(
    restoreOnUnmount && isBrowser ? document.title : null
  );

  useEffect(() => {
    if (!isBrowser) {
      return; // Cannot set title on the server
    }

    if (document.title !== title) {
      document.title = title;
    }

    // Cleanup function: Restore the original title if requested
    return () => {
      if (restoreOnUnmount && originalTitleRef.current !== null) {
        // Only restore if the current title is still the one we set
        // (avoids issues if another hook/component changed it meanwhile)
        if (document.title === title) {
          document.title = originalTitleRef.current;
        }
      }
    };
  }, [title, restoreOnUnmount]); // Re-run effect if title or restore option changes

  // Additional effect to capture the *current* original title if restoreOnUnmount
  // becomes true *after* the initial render. This is an edge case but ensures correctness.
  useEffect(() => {
    if (isBrowser && restoreOnUnmount && originalTitleRef.current === null) {
      originalTitleRef.current = document.title;
    }
  }, [restoreOnUnmount]);
}
