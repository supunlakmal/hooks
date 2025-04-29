import { useState, useCallback } from "react";

/**
 * Represents the result of the copy operation.
 * - `null`: Initial state, no copy attempt made yet.
 * - `true`: Copy successful.
 * - `false`: Copy failed.
 */
type CopyStatus = null | boolean;

/**
 * Represents the return value of the useCopyToClipboard hook.
 * - `status`: The current status of the copy operation (null, true, or false).
 * - `copy`: A function to trigger the copy operation.
 */
type UseCopyToClipboardReturn = [
  status: CopyStatus,
  copy: (text: string) => Promise<void>
];

/**
 * Custom hook for copying text to the clipboard.
 * Uses the modern Clipboard API (`navigator.clipboard.writeText`) with a fallback.
 *
 * @returns {UseCopyToClipboardReturn} A tuple containing the copy status and the copy function.
 */
function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [status, setStatus] = useState<CopyStatus>(null);

  const copy = useCallback(async (text: string) => {
    // Use the modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setStatus(true);
      } catch (error) {
        console.error("Failed to copy text using Clipboard API:", error);
        setStatus(false);
      }
    } else {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Prevent scrolling to bottom
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          setStatus(true);
        } else {
          throw new Error('document.execCommand("copy") failed');
        }
      } catch (error) {
        console.error("Failed to copy text using fallback method:", error);
        setStatus(false);
      }
    }

    // Optional: Reset status after a delay
    setTimeout(() => setStatus(null), 2000); // Reset after 2 seconds
  }, []);

  return [status, copy];
}

export default useCopyToClipboard;
