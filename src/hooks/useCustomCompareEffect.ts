import {type DependencyList, useEffect, useRef} from 'react';

export type DependenciesComparator<Deps extends DependencyList = DependencyList> = (
	a: Deps,
	b: Deps
) => boolean;

export type Predicate = (previous: any, next: any) => boolean;

export type ConditionsList = readonly any[];

export type ConditionsPredicate<Cond extends ConditionsList = ConditionsList> = (
	conditions: Cond
) => boolean;

export const noop = (): void => {};

export const isBrowser =
	typeof globalThis !== 'undefined' &&
	typeof navigator !== 'undefined' &&
	typeof document !== 'undefined';

export const isStrictEqual: Predicate = (previous: any, next: any): boolean => previous === next;

export const truthyAndArrayPredicate: ConditionsPredicate = (conditions): boolean =>
	conditions.every(Boolean);

export const truthyOrArrayPredicate: ConditionsPredicate = (conditions): boolean =>
	conditions.some(Boolean);
export type EffectCallback = () => void | (() => void | undefined);

export type EffectHook<
	Callback extends EffectCallback = EffectCallback,
	Deps extends DependencyList = DependencyList,
	HookRestArgs extends any[] = any[],
> = (...args: [Callback, Deps, ...HookRestArgs]) => void;

const myUseEffect:EffectHook = (callback,dependencies) => {
	return useEffect(callback,dependencies)
}
export const basicDepsComparator: DependenciesComparator = (prevDeps, nextDeps): boolean =>
	prevDeps.length === nextDeps.length && prevDeps.every((item, i) => item === nextDeps[i]);

/**
 * Like `useEffect` but uses provided comparator function to validate dependency changes.
 *
 * @param callback Function that will be passed to the underlying effect hook.
 * @param deps Dependency list like the one passed to `useEffect`.
 * @param comparator Function that compares two dependency arrays,
 * and returns `true` if they're equal.
 * @param effectHook Effect hook that will be used to run
 * `callback`. Must match the type signature of `useEffect`, meaning that the `callback` should be
 * placed as the first argument and the dependency list as second.
 * @param effectHookRestArgs Extra arguments that are passed to the `effectHook`
 * after the `callback` and the dependency list.
 */
// eslint-disable-next-line max-params
export const useCustomCompareEffect = <Callback extends EffectCallback = EffectCallback,
	Deps extends DependencyList = DependencyList,
	HookRestArgs extends any[] = any[],
	R extends HookRestArgs = HookRestArgs,
>(
	callback: Callback,
	deps: Deps,
	comparator: DependenciesComparator<Deps> = basicDepsComparator,
	effectHook: EffectHook<Callback, Deps, HookRestArgs> = myUseEffect,
	...effectHookRestArgs: R
): void => {
	const dependencies = useRef<Deps>(undefined);

	// Effects are not run during SSR, therefore, it makes no sense to invoke the comparator
	if (
		dependencies.current === undefined ||
		(isBrowser && !comparator(dependencies.current, deps))
	) {
		dependencies.current = deps;
	}

	effectHook(callback, dependencies.current, ...effectHookRestArgs);
}