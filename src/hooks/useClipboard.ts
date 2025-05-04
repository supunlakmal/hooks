import { useState, useCallback } from "react";

interface UseClipboardReturn {
  value: string | null;
  error: Error | DOMException | null;
  copy: (text: string) => Promise<void>;
  paste: () => Promise<string>;
}

/**
 * Custom hook for interacting with the system clipboard (copy and paste).
 * Uses the modern asynchronous Clipboard API (`navigator.clipboard`).
 *
 * @param {UseClipboardOptions} [options] - Optional configuration options.
 * @returns {UseClipboardReturn} An object containing the clipboard value, error state, and copy/paste functions.
 */
export const useClipboard = (): UseClipboardReturn => {
  const [value, setValue] = useState<string | null>(null);
  const [error, setError] = useState<Error | DOMException | null>(null);

  // Check if Clipboard API is available
  const isClipboardApiAvailable =
    typeof navigator !== "undefined" && !!navigator.clipboard;

  const copy = useCallback(
    async (text: string): Promise<void> => {
      if (!isClipboardApiAvailable) {
        const err = new Error("Clipboard API not available.");
        setError(err);
        return Promise.reject(err);
      }

      try {
        await navigator.clipboard.writeText(text);
        // Optionally update local state if needed, though copy doesn't usually read
        // setValue(text); // Uncomment if you want state to reflect what was copied
        setError(null);
        return Promise.resolve();
      } catch (err) {
        console.error("Failed to copy text to clipboard:", err);
        setError(
          err instanceof Error || err instanceof DOMException
            ? err
            : new Error("Copy failed")
        );
        setValue(null); // Clear value state on copy error
        return Promise.reject(err);
      }
    },
    [isClipboardApiAvailable]
  );

  const paste = useCallback(async (): Promise<string> => {
    if (!isClipboardApiAvailable) {
      const err = new Error("Clipboard API not available.");
      setError(err);
      return Promise.reject(err);
    }

    try {
      const text = await navigator.clipboard.readText();
      setValue(text);
      setError(null);
      return Promise.resolve(text);
    } catch (err) {
      console.error("Failed to read text from clipboard:", err);
      setError(
        err instanceof Error || err instanceof DOMException
          ? err
          : new Error("Paste failed")
      );
      setValue(null); // Clear value state on paste error
      return Promise.reject(err);
    }
  }, [isClipboardApiAvailable]);

  return {
    value,
    error,
    copy,
    paste,
  };
}


