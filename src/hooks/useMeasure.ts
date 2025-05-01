import { useState, type RefObject, useEffect, useRef } from 'react';
// Removed unused: type MutableRefObject
// Removed unused: import useHookableRef from './useHookableRef';
import { useRafCallback } from './useRafCallback'; // Assuming this hook exists and works correctly
import useResizeObserver, { type ResizeObserverEntryExtended } from './useResizeObserver'; // Assuming this hook exists and works correctly

export type Measures = {
	width: number;
	height: number;
};

/**
 * Uses ResizeObserver to track element dimensions and re-render component when they change.
 * Provides a ref to attach to the target element.
 *
 * @param enabled Whether resize observer is enabled or not. Defaults to true.
 *                Note: This currently only prevents state updates. The underlying
 *                ResizeObserver might still be active if `useResizeObserver`
 *                doesn't internally handle an 'enabled' state.
 * @returns A tuple containing:
 *          - `measures`: An object with `width` and `height`, or `undefined` initially.
 *          - `elementRef`: A RefObject to attach to the DOM element being measured.
 */
export function useMeasure<T extends Element>(
	enabled = true,
): [Measures | undefined, RefObject<T | null>] {
	const elementRef = useRef<T | null>(null);
	const [measures, setMeasures] = useState<Measures>();

	// Wrap the state update in requestAnimationFrame to batch updates
	const [observerHandler] = useRafCallback((entry: ResizeObserverEntryExtended) => {
		// Extract width and height from the contentRect
		const { width, height } = entry.contentRect;
		// Update state only if dimensions have actually changed to prevent unnecessary re-renders
		setMeasures((prevMeasures) => {
			if (prevMeasures?.width === width && prevMeasures?.height === height) {
				return prevMeasures;
			}
			return { width, height };
		});
	});

	// useResizeObserver hook listens to the ref and returns the latest entry
	// Assumption: useResizeObserver handles attaching/detaching the observer to elementRef.current
	const entry = useResizeObserver(elementRef); // Pass the ref here

	useEffect(() => {
		// Only process the resize entry if the hook is enabled and an entry exists
		if (enabled && entry) {
			observerHandler(entry);
		}
        // Note: If !enabled, we don't update state, but useResizeObserver might still be listening.
        // For optimization, useResizeObserver could potentially accept an 'enabled' option.
	}, [entry, enabled, observerHandler]); // Dependencies: trigger effect if entry, enabled status, or the handler changes

	// Return the latest measures and the ref
	return [measures, elementRef];
}

export default useMeasure;