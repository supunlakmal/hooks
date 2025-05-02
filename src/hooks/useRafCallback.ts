import { useCallback, useRef } from 'react';
import { useSyncedRef } from './useSyncedRef';
import { useUnmountEffect } from './useUnmountEffect';
import {isBrowser} from '../util/const';

/**
 * Makes passed function to be called within next animation frame.
 *
 * Consequential calls, before the animation frame occurred, cancel previously scheduled call.
 *
 * @param cb Callback to fire within animation frame.
 */

export const useRafCallback = (
	callback: (...args: any[]) => void,
): ((...args: any[]) => void) => {
	const cbRef = useSyncedRef(callback);
	const frame = useRef<number>(0);

	const cancel = useCallback(() => {
		if (!isBrowser) {
			return;
		}

		if (frame.current) {
			cancelAnimationFrame(frame.current);
			frame.current = 0;
		}
	}, []);

	useUnmountEffect(cancel);

	const rafCallback = useCallback(
		(...args: any[]) => {
			if (!isBrowser) {
				return;
			}

			cancel();

			frame.current = requestAnimationFrame(() => {
				cbRef.current(...args);
				frame.current = 0;
			});
		},
		[],
	);

	return rafCallback;
};