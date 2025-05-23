import { useCallback, useMemo } from 'react';
import {
  useMediatedState,
  type InitialState,
  type NextState,
  resolveInitialState,
  resolveNextState,
} from './useMediatedState';

// --- useCounter (Refactored to use useMediatedState and Corrected) ---

export type CounterActions = {
  /**
   * Returns the current value of the counter. (Getter removed, use state value directly)
   */
  // get: () => number; // Removed: Just use the `value` returned by the hook directly
  /**
   * Increment the counter by the given `delta`. Clamped by min/max.
   * @param delta Amount to increment by. Can be a number or function `(prevValue) => number`. Defaults to 1.
   */
  inc: (delta?: NextState<number, number>) => void;
  /**
   * Decrement the counter by the given `delta`. Clamped by min/max.
   * @param delta Amount to decrement by. Can be a number or function `(prevValue) => number`. Defaults to 1.
   */
  dec: (delta?: NextState<number, number>) => void;
  /**
   * Set the counter to any value. Clamped by min/max.
   * @param value New value or function `(prevValue) => number`.
   */
  set: (value: NextState<number, number>) => void;
  /**
   * Resets the counter to its originally resolved and clamped initial value.
   */
  reset: () => void;
};

/**
 * Tracks a numeric value with optional min/max boundaries and provides counter actions.
 *
 * @param initialValue The initial value (or initializer function). Defaults to 0.
 * @param max Optional maximum value. Initial value is clamped if needed.
 * @param min Optional minimum value. Initial value is clamped if needed.
 */
export const useCounter = (
  initialValue: InitialState<number> = 0,
  max?: number,
  min?: number
): [number, CounterActions] => {
  // 1. Define the clamping function (mediator logic) based on min/max
  const clamp = useCallback(
    (value: number): number => {
      let clampedValue = value;
      if (max !== undefined) {
        clampedValue = Math.min(max, clampedValue);
      }
      if (min !== undefined) {
        clampedValue = Math.max(min, clampedValue);
      }
      return clampedValue;
    },
    [max, min]
  ); // Recreate clamp only if min/max change

  // 2. Resolve and clamp the *initial* value *once* for the reset functionality
  // and to ensure the starting state is valid.
  const initialClampedValue = useMemo(() => {
    const resolvedInitial = resolveInitialState(initialValue);
    return clamp(resolvedInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, clamp]);
  // initialValue is only needed on mount, but including clamp ensures
  // if min/max change the initial value *conceptually* aligns, though reset stays fixed.
  // Alternatively, use [] if you strictly want the *first ever* clamped value.
  // Using [clamp] makes slightly more sense if min/max could change, though unusual for an initial value.

  // 3. Use useMediatedState with the initially clamped value and the clamp function as mediator
  const [state, setState] = useMediatedState<number, number>(
    initialClampedValue, // Start with the correctly clamped initial value
    clamp // Use clamp as the mediator for subsequent updates
  );

  // 4. Define stable actions using the setter from useMediatedState
  const actions = useMemo<CounterActions>(
    () => ({
      // `get` is removed - the state value is returned directly by the hook
      set: (value) => {
        // Pass value/fn directly; useMediatedState handles resolution and mediation (clamping)
        setState(value);
      },
      inc: (delta = 1) => {
        // setState uses functional update. We resolve delta *inside* it.
        // The outer value passed to setState is the updater function.
        setState((prev) => prev + resolveNextState(delta, prev));
      },
      dec: (delta = 1) => {
        setState((prev) => prev - resolveNextState(delta, prev));
      },
      reset: () => {
        // Reset directly to the stored initial clamped value.
        // This ensures reset goes back to the *first* clamped value,
        // even if min/max props change later.
        setState(initialClampedValue);
      },
      // Note: state is not needed in deps here because actions only depend on setState and initialClampedValue
      // which are stable or memoized correctly.
    }),
    [setState, initialClampedValue]
  );

  return [state, actions];
};
