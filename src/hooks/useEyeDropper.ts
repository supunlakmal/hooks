import { useState, useCallback } from 'react';

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropper {
  open: (options?: { signal?: AbortSignal }) => Promise<EyeDropperResult>;
  // close: () => void; // Note: close() method is not standard
}

declare global {
  interface Window {
    EyeDropper?: { new(): EyeDropper };
  }
}

interface UseEyeDropperOptions {
  onError?: (error: Error) => void;
}

interface UseEyeDropperReturn {
  isSupported: boolean;
  sRGBHex: string | null;
  open: () => Promise<void>;
  error: Error | null;
}

const isBrowser = typeof window !== 'undefined';

/**
 * Hook to use the experimental EyeDropper API.
 *
 * Allows users to sample colors from their screen.
 * Note: This API is experimental and browser support is limited.
 *
 * @param {UseEyeDropperOptions} [options] Configuration options.
 * @returns {UseEyeDropperReturn} Object with EyeDropper state and controls.
 */
export function useEyeDropper(options?: UseEyeDropperOptions): UseEyeDropperReturn {
  const [isSupported] = useState<boolean>(() => {
    return isBrowser && typeof window.EyeDropper === 'function';
  });
  const [sRGBHex, setSRGBHex] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const open = useCallback(async () => {
    if (!isSupported) {
      const notSupportedError = new Error('EyeDropper API is not supported in this browser.');
      setError(notSupportedError);
      options?.onError?.(notSupportedError);
      console.error(notSupportedError.message);
      return;
    }

    setError(null); // Clear previous errors
    setSRGBHex(null); // Reset color

    const eyeDropper = new window.EyeDropper!();
    // AbortController can be used if cancellation is needed, but basic usage shown here
    // const controller = new AbortController();
    // const signal = controller.signal;

    try {
      const result: EyeDropperResult = await eyeDropper.open(/* { signal } */);
      setSRGBHex(result.sRGBHex);
    } catch (err) {
        // Handle errors, including user cancellation (which typically throws DOMException: The user aborted a request.)
        const currentError =
            err instanceof Error
            ? err
            : new Error('Failed to open EyeDropper or operation was cancelled.');

        // Don't treat user cancellation as a hook error state unless specifically desired
        if (currentError.name !== 'AbortError' && !(currentError instanceof DOMException && currentError.message.includes('aborted')) ) {
             setError(currentError);
             options?.onError?.(currentError);
             console.error('EyeDropper error:', currentError);
        } else {
            // User cancelled, reset color potentially
             setSRGBHex(null);
             console.log('EyeDropper operation cancelled by user.');
        }

    }
  }, [isSupported, options]);

  return { isSupported, sRGBHex, open, error };
}
