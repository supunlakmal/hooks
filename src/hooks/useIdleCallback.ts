import { useRef, useEffect, useCallback, useState } from 'react';

// Define the type for the requestIdleCallback handle
type RequestIdleCallbackHandle = number;

type RequestIdleCallbackOptions = {
  timeout?: number;
};

type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

// Function signatures for requestIdleCallback and cancelIdleCallback
declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

const isBrowser = typeof window !== 'undefined';

/**
 * Hook to schedule a function execution during browser idle periods.
 * Uses `requestIdleCallback` API.
 *
 * @param callback The function to execute when the browser is idle.
 * @param options Optional configuration, primarily the `timeout`.
 * @returns A tuple containing functions to `start` and `cancel` the scheduled callback.
 */
export function useIdleCallback(
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    options?: RequestIdleCallbackOptions
): { start: () => void; cancel: () => void; isActive: boolean } {
    const idleCallbackHandleRef = useRef<RequestIdleCallbackHandle | null>(null);
    const [isActive, setIsActive] = useState(false);
    const callbackRef = useRef(callback);

    // Keep the callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const cancel = useCallback(() => {
        if (isBrowser && idleCallbackHandleRef.current !== null) {
            window.cancelIdleCallback(idleCallbackHandleRef.current);
            idleCallbackHandleRef.current = null;
            setIsActive(false);
        }
    }, []);

    const start = useCallback(() => {
        if (!isBrowser) return;

        // Cancel any existing callback before starting a new one
        cancel();

        idleCallbackHandleRef.current = window.requestIdleCallback(
            (deadline) => {
                 callbackRef.current(deadline);
                 idleCallbackHandleRef.current = null; // Callback executed, clear handle
                 setIsActive(false);
            },
            options
        );
        setIsActive(true);
    }, [options, cancel]);

    // Cleanup on unmount
    useEffect(() => {
        return cancel; // Cancel callback when component unmounts
    }, [cancel]);

    return { start, cancel, isActive };
}
