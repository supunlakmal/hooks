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

/**
 * Uses ResizeObserver to track element dimensions and re-render component when they change.
 * Provides a ref to attach to the target element.
 * Assumes useResizeObserver returns a SINGLE entry object or null.
 *
 * @template T The type of the DOM element being measured.
 * @param enabled Whether resize observation and state updates are enabled. Defaults to true.
 * @returns A tuple containing:
 *          - `measures`: An object with `width` and `height`, or `undefined` if there is no measures.
 *          - `ref`: A RefObject to attach to the DOM element being measured.
 */
export const useMeasure = <T extends Element>(
  enabled = true
): {
  measures: Measures | undefined;
  ref: RefObject<T | null>;
} => {
  const elementRef = useRef<T | null>(null);

  const [measures, setMeasures] = useState<Measures>();

  const observerHandler = useRafCallback((entry: ResizeObserverEntry) => {
    const { width, height } = entry.contentRect;
    setMeasures((prevMeasures) => {
      if (prevMeasures?.width === width && prevMeasures?.height === height) {
        return prevMeasures;
      }
      return { width, height };
    });
  });

  const entry: ResizeObserverEntry | null = useResizeObserver(
    elementRef
  ) as ResizeObserverEntry | null;

  useEffect(() => {
    if (enabled && entry) {
      observerHandler(entry);
    }
  }, [entry, enabled, observerHandler]);

  return { measures, ref: elementRef };
};

export default useMeasure;
