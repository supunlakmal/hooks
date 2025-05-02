import { useState, type RefObject, useEffect, useRef } from 'react';
import { useRafCallback } from './useRafCallback';
// Assuming useResizeObserver returns ResizeObserverEntryExtended | null
// You might need to import ResizeObserverEntryExtended if you use it explicitly below.
import { useResizeObserver } from './useResizeObserver';

// Ensure @types/resize-observer-browser is installed
// npm install --save-dev @types/resize-observer-browser

export type Measures = {
    width: number;
    height: number;
};

// If 'ResizeObserverEntryExtended' is an exported type from your hook's module,
// it's best to import and use it directly for the most precise typing:
// import { useResizeObserver, type ResizeObserverEntryExtended } from './useResizeObserver';
// type ObserverReturnType = ResizeObserverEntryExtended | null;

// If ResizeObserverEntryExtended is not exported or you only need base properties,
// using the standard ResizeObserverEntry is usually sufficient:
type ObserverReturnType = ResizeObserverEntry | null;


/**
 * Uses ResizeObserver to track element dimensions and re-render component when they change.
 * Provides a ref to attach to the target element.
 * Assumes useResizeObserver returns a SINGLE entry object or null.
 *
 * @template T The type of the DOM element being measured.
 * @param enabled Whether resize observation and state updates are enabled. Defaults to true.
 * @returns A tuple containing:
 *          - `measures`: An object with `width` and `height`, or `undefined` initially.
 *          - `elementRef`: A RefObject to attach to the DOM element being measured.
 */
export function useMeasure<T extends Element>(
    enabled = true,
): [Measures | undefined, RefObject<T | null>] {
    const elementRef = useRef<T | null>(null);
    const [measures, setMeasures] = useState<Measures>();

    const observerHandler = useRafCallback((entries: ResizeObserverEntry[]) => {
        if (!entries || entries.length === 0) {
            return;
        }
        const { width, height } = entries[0].contentRect;
        setMeasures((prevMeasures) => {
            if (prevMeasures?.width === width && prevMeasures?.height === height) {
                return prevMeasures;
            }
            return { width, height };
        });
    });

    // *** FIX HERE ***
    // Update the type annotation to include `null`
    const entry: ObserverReturnType = useResizeObserver(elementRef);
    // If you used ObserverReturnType = ResizeObserverEntryExtended | null above, this line is fine.
    // If you used ObserverReturnType = ResizeObserverEntry | null, this line is also fine,
    // as ResizeObserverEntryExtended should be assignable to the base ResizeObserverEntry.

    useEffect(() => {
        // The check `if (enabled && entry)` correctly handles `null` (it's falsy)
        if (enabled && entry) {
            // Pass the single entry wrapped in an array.
            // No type assertion needed here if ObserverReturnType is compatible
            // with ResizeObserverEntry (which it should be).
            observerHandler([entry]);
        }
    }, [entry, enabled, observerHandler]);

    return [measures, elementRef];
}

export default useMeasure;