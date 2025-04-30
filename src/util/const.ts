export const noop = (): void => {};

export const isBrowser =
	typeof globalThis !== 'undefined' &&
	typeof navigator !== 'undefined' &&
	typeof document !== 'undefined';

/**
 * You should only be reaching for this function when you're attempting to prevent multiple
 * redefinitions of the same function. In-place strict equality checks are more performant.
 */

export const isStrictEqual = (previous: any, next: any): boolean => previous === next;

export const truthyAndArrayPredicate = (conditions: boolean[]): boolean =>
    conditions.every(Boolean);

export const truthyOrArrayPredicate = (conditions: boolean[]): boolean =>
    conditions.some(Boolean);