import { useState, useCallback, useEffect, useRef } from 'react';
import { useClipboard } from '@/hooks/useClipboard'; // Updated path

type UseClipboardWithFeedbackReturn = [
  string | null,
  (text: string) => Promise<boolean>,
  boolean,
];

/**
 * A hook that extends useClipboard to provide feedback when text is copied.
 *
 * @param {number} feedbackDuration Duration in milliseconds to show the feedback state (default: 2000ms).
 * @returns A tuple containing:
 *          - The current clipboard text ('value' from useClipboard).
 *          - The function to copy text to the clipboard (returns boolean success).
 *          - A boolean indicating if text was recently copied (for feedback).
 */
export function useClipboardWithFeedback(
  feedbackDuration: number = 2000
): UseClipboardWithFeedbackReturn {
  const { value, copy: baseCopyFn } = useClipboard();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  // Changed NodeJS.Timeout to number for browser compatibility
  const timeoutIdRef = useRef<number | null>(null); 

  const clearExistingTimeout = useCallback(() => {
    if (timeoutIdRef.current) {
      window.clearTimeout(timeoutIdRef.current); // Explicitly use window.clearTimeout
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, [clearExistingTimeout]);

  const copyFn = useCallback(
    async (text: string): Promise<boolean> => {
      clearExistingTimeout();

      try {
        await baseCopyFn(text);
        setIsCopied(true);
        timeoutIdRef.current = window.setTimeout(() => { // Explicitly use window.setTimeout
          setIsCopied(false);
          timeoutIdRef.current = null;
        }, feedbackDuration);
        return true;
      } catch (err: unknown) { // Typed catch parameter
        console.error('Clipboard copy failed:', err);
        setIsCopied(false);
        return false;
      }
    },
    [baseCopyFn, feedbackDuration, clearExistingTimeout]
  );

  return [value, copyFn, isCopied];
}
