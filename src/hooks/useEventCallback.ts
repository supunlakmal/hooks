import { useRef, useEffect, useCallback } from 'react';

/**
 * Creates a stable callback function that always calls the latest version of the provided callback.
 *
 * Useful for optimizing child components that rely on stable function references (e.g., in `React.memo` or dependency arrays)
 * while ensuring the most up-to-date logic is executed.
 *
 * @template T Callback function type.
 * @param {T} callback The callback function whose latest version should always be invoked.
 * @returns {T} A stable function reference that delegates to the latest `callback`.
 */
export function useEventCallback<T extends (...args: any[]) => any>(callback: T): T {
    const callbackRef = useRef<T>(callback);

    // Use useEffect to update the ref whenever the callback changes.
    // Using useEffect instead of useLayoutEffect to avoid potential warnings during SSR,
    // as the callback ref update doesn't typically need to be synchronous with layout.
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Create a stable useCallback wrapper that reads the latest callback from the ref.
    const memoizedCallback = useCallback((...args: Parameters<T>): ReturnType<T> => {
        // Note: Using optional chaining and a check in case the hook is somehow called
        // before the initial useEffect runs, though typically callbackRef will be initialized.
        const currentCallback = callbackRef.current;
        if (currentCallback) {
            return currentCallback(...args);
        }
        // Consider throwing an error or returning undefined/null if callback is unexpectedly missing,
        // depending on desired strictness.
        // console.warn('useEventCallback invoked before callback ref was set.');
        // If the callback is truly missing, the function signature requires a return of type ReturnType<T>.
        // For now, we assume it's always present after the first effect. If not, an error should likely be thrown.
        // Throwing an error here if currentCallback is null/undefined might be the safest default.
        throw new Error('useEventCallback: Attempted to call callback before it was set.');

    }, []); // No dependencies: the function identity remains stable

    return memoizedCallback as T;
}
