import {type MutableRefObject, useMemo} from 'react';
import {useSyncedRef} from './useSyncedRef';

export type HookableRefHandler<T> = (v: T) => T;

export const useHookableRef = <T>(
	initialValue: T,
	onSet?: HookableRefHandler<T>,
	onGet?: HookableRefHandler<T>
): MutableRefObject<T>;
export const useHookableRef = <T = undefined>(): MutableRefObject<T | null | undefined> => undefined as any;

/**
 * Like `React.useRef` but it is possible to define get and set handlers
 *
 * @param initialValue Initial value of a hook.
 * @param onSet Function to be called while ref.current value set. Return value
 * will be stored in ref.
 * @param onGet Function to be called while ref.current value accessed. Return
 * value will be used as a return value.
 */
export const useHookableRef = <T>( 
	initialValue?: T,
	onSet?: HookableRefHandler<T>,
	onGet?: HookableRefHandler<T>,
): MutableRefObject<T | null | undefined> {
	const onSetRef = useSyncedRef(onSet);
	const onGetRef = useSyncedRef(onGet);

	return useMemo(() => {
		let v = initialValue;

		return {
			get current() {
				return onGetRef.current === undefined ? v : onGetRef.current(v as T);
			},

			set current(value) {
				v = onSetRef.current === undefined ? value : onSetRef.current(value as T);
			},
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}
