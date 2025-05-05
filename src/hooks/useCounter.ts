import { useCallback, useState, useMemo, useRef, type Dispatch } from 'react';

// --- useSyncedRef (Seems OK, no changes needed) ---
/**
 * Like `useRef`, but it returns immutable ref that contains actual value.
 * Ensures the .current getter always provides the latest value passed to the hook.
 * @param value The value to track.
 */
const useSyncedRef = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);

  // Update the ref's current value on every render
  ref.current = value;

  // Return a memoized, frozen object with a getter
  // The object identity is stable, but the getter always reads the latest ref.current
  return useMemo(
    () =>
      Object.freeze({
        get current() {
          return ref.current;
        },
      }),
    [] // Empty dependency array is correct here
  );
};

// --- State Helpers (Simplified and Corrected) ---
type StateInitializerFN<State> = () => State;
type StateUpdaterFN<State, PreviousState = State> = (
  previousState: PreviousState
) => State;

export type InitialState<State> = State | StateInitializerFN<State>;
export type NextState<State, PreviousState = State> =
  | State
  | StateUpdaterFN<State, PreviousState>;

/** Internal helper to resolve initial state */
const resolveInitialState = <State>(
  initialState: InitialState<State>
): State => {
  // Check if initialState is a function (initializer) and call it
  if (typeof initialState === 'function') {
    // We cast here because TS struggles with the typeof check narrowing perfectly in this context
    return (initialState as StateInitializerFN<State>)();
  }
  return initialState;
};

/** Internal helper to resolve next state based on previous state */
const resolveNextState = <State, PreviousState = State>(
  nextState: NextState<State, PreviousState>,
  previousState: PreviousState
): State => {
  // Check if nextState is a function (updater) and call it with previousState
  if (typeof nextState === 'function') {
    // We cast here for the same reason as above
    return (nextState as StateUpdaterFN<State, PreviousState>)(previousState);
  }
  return nextState;
};

// --- useMediatedState (Corrected) ---
/**
 * Like `useState`, but every value set is passed through a mediator function
 * before the state is updated. The initial state is NOT mediated by default.
 * @template State The type of the state managed by the hook (after mediation).
 * @template RawState The type of the value passed to the setter (before mediation). Defaults to State.
 * @param initialState Initial state value or initializer function. Resolved value is used directly.
 * @param mediator Optional function that takes the resolved raw value and returns the final state value. Applied only on updates.
 */
export const useMediatedState = <State, RawState = State>(
  initialState: InitialState<State>,
  mediator?: (resolvedRawValue: RawState) => State
): [State, Dispatch<NextState<RawState, State>>] => {
  // Use useSyncedRef to track the latest mediator function without causing setter recreation
  const mediatorRef = useSyncedRef(mediator);

  // Initialize state using the provided initialState helper
  // The initial state itself is NOT mediated here. Mediation happens on updates.
  const [state, setState] = useState<State>(() =>
    resolveInitialState(initialState)
  );

  // Memoize the setter function
  const setMediatedState = useCallback<Dispatch<NextState<RawState, State>>>(
    (valueOrFn) => {
      // Use the functional update form of setState to ensure we have the latest previous state
      setState((prevState) => {
        // 1. Resolve the raw value (handles both direct value and updater function)
        const resolvedRawValue = resolveNextState<RawState, State>(
          valueOrFn,
          prevState
        );

        // 2. Get the current mediator function from the ref
        const currentMediator = mediatorRef.current;

        // 3. Apply mediator if it exists, otherwise return the resolved raw value
        if (currentMediator) {
          return currentMediator(resolvedRawValue);
        } else {
          // If no mediator, assume RawState is assignable to State
          // Add type assertion for safety, though ideally State == RawState here
          // Or the user should ensure compatibility or provide an identity mediator.
          return resolvedRawValue as unknown as State;
        }
      });
    },
    [] // setState is stable, mediatorRef handles mediator changes. No deps needed.
  );

  // Return the current state and the memoized setter
  return [state, setMediatedState];
};

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
  }, [clamp]); // Depends on the clamp function (which depends on min/max)
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
