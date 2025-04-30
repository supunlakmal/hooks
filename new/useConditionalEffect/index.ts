import { type DependencyList, useEffect } from 'react';

type DependenciesComparator<Deps extends DependencyList = DependencyList> = (
	a: Deps,
	b: Deps,
) => boolean;

type Predicate = (previous: any, next: any) => boolean;

type ConditionsList = readonly any[];

type ConditionsPredicate<Cond extends ConditionsList = ConditionsList> = (
	conditions: Cond,
) => boolean;

const noop = (): void => {};

const isBrowser =
	typeof globalThis !== 'undefined' &&
	typeof navigator !== 'undefined' &&
	typeof document !== 'undefined';

/**
 * You should only be reaching for this function when you're attempting to prevent multiple
 * redefinitions of the same function. In-place strict equality checks are more performant.
 */

const isStrictEqual: Predicate = (previous: any, next: any): boolean => previous === next;

const truthyAndArrayPredicate: ConditionsPredicate = (conditions): boolean =>
	conditions.every(Boolean);

const truthyOrArrayPredicate: ConditionsPredicate = (conditions): boolean =>
	conditions.some(Boolean);

type EffectCallback = (...args: any[]) => any;

type EffectHook<Callback extends EffectCallback = EffectCallback, Deps extends DependencyList | undefined = DependencyList | undefined, RestArgs extends any[] = any[]> = ((...args: [Callback, Deps, ...RestArgs]) => void) | ((...args: [Callback, Deps]) => void);

/**

 * Like `useEffect` but its callback is invoked only if all given conditions match a given predicate.
 *
 * @param callback Function that will be passed to the underlying effect hook.
 * @param deps Dependency list like the one passed to `useEffect`. If not
 * `undefined`, the effect will be triggered when the dependencies change and the given `conditions`
 * satisfy the `predicate`.
 * @param conditions List of conditions.
 * @param predicate Predicate that should be satisfied by every condition in `conditions`. By
 * default, the predicate checks that every condition in `conditions` is truthy.
 * @param effectHook Effect hook that will be used to run `callback`. Must match the type signature
 * of `useEffect`, meaning that the `callback` should be placed as the first argument and the
 * dependency list as second.
 * @param effectHookRestArgs Extra arguments that are passed to the `effectHook` after the
 * `callback` and the dependency list.
 */

export function useConditionalEffect<
	Cond extends ConditionsList,
	Callback extends EffectCallback = EffectCallback,
	Deps extends DependencyList | undefined = DependencyList | undefined,
	HookRestArgs extends any[] = [],
	R extends HookRestArgs = HookRestArgs,
>(
	callback: Callback,
	deps: Deps,
	conditions: Cond,
	predicate: ConditionsPredicate<Cond> = truthyAndArrayPredicate,
	effectHook: EffectHook<Callback, Deps, HookRestArgs> = useEffect,
	...effectHookRestArgs: R
): void {
	effectHook(
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		(() => {
			if (predicate(conditions)) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return callback();
			}
		}) as Callback,
		deps,
		...effectHookRestArgs,
	);
}

function on<T extends EventTarget>(
	object: T | null,
	...args:
		| Parameters<T['addEventListener']>
		| [string, EventListenerOrEventListenerObject | CallableFunction, ...any]
): void {
	object?.addEventListener?.(...(args as Parameters<HTMLElement['addEventListener']>));
}

function off<T extends EventTarget>(
	object: T | null,
	...args:
		| Parameters<T['removeEventListener']>
		| [string, EventListenerOrEventListenerObject | CallableFunction, ...any]
): void {
	object?.removeEventListener?.(...(args as Parameters<HTMLElement['removeEventListener']>));
}

const hasOwnProperty = <T extends Record<string | number | symbol, any>, K extends string | number | symbol>(
	object: T,
	property: K,
): object is T & Record<K, unknown> => Object.hasOwn(object, property);

const yieldTrue = () => true as const;
const yieldFalse = () => false as const;

const basicDepsComparator: DependenciesComparator = (d1, d2) => {
	if (d1 === d2) {
		return true;
	}
	if (d1.length !== d2.length) {
		return false;
	}
	for (const [i, element] of d1.entries()) {
		if (element !== d2[i]) {
			return false;
		}
	}
	return true;
};
