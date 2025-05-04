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
    [], // Empty dependency array is correct here
  );
};


// --- State Helpers (Seem OK, no changes needed but adding types for clarity) ---
type StateInitializerFN<State> = () => State;
type StateUpdaterFN<State, PreviousState = State> = (previousState: PreviousState) => State;

export type InitialState<State> = State | StateInitializerFN<State>;
export type NextState<State, PreviousState = State> = State | StateUpdaterFN<State, PreviousState>;

const initState = <State>(initialState: InitialState<State>): State => {
  // Check if initialState is a function (initializer) and call it
  if (typeof initialState === 'function') {
    // We cast here because TS struggles with the typeof check narrowing perfectly in this context
    return (initialState as StateInitializerFN<State>)();
  }
  return initialState;
}

const updateState = <State, PreviousState = State>(
  nextState: NextState<State, PreviousState>,
  previousState: PreviousState,
): State {
  // Check if nextState is a function (updater) and call it with previousState
  if (typeof nextState === 'function') {
    // We cast here for the same reason as above
    return (nextState as StateUpdaterFN<State, PreviousState>)(previousState);
  }
  return nextState;
}

/** Internal helper to resolve initial or next state */
const resolveHookState = <State, PreviousState = State>(
  stateOrFn: InitialState<State>
): State => {
	return initState(stateOrFn as InitialState<State>);
};
const resolveHookState = <State, PreviousState = State>(
  stateOrFn: NextState<State, PreviousState>,
  previousState: PreviousState,
): State => {
	return updateState(stateOrFn as NextState<State, PreviousState>, previousState);
};


// --- useMediatedState (Fixed) ---
/**
 * Like `useState`, but every value set is passed through a mediator function
 * before the state is updated.
 * @template State The type of the state managed by the hook (after mediation).
 * @template RawState The type of the value passed to the setter (before mediation). Defaults to State.
 * @param initialState Initial state value or initializer function.
 * @param mediator Function that takes the resolved raw value and returns the final state value.
 */
export const useMediatedState = <State, RawState = State>(
  initialState: InitialState<State>, // Made initialState non-optional for clarity, use `undefined` explicitly if needed
  mediator?: (resolvedRawValue: RawState) => State,
): [State, Dispatch<NextState<RawState, State>>] => { // Return type uses State, not State | undefined assuming initialState provides a non-undefined State

  // Use useSyncedRef to track the latest mediator function without causing setter recreation
  const mediatorRef = useSyncedRef(mediator);

  // Initialize state using the provided initialState helper
  const [state, setState] = useState<State>(() => initState(initialState));

  // Memoize the setter function
  const setMediatedState = useCallback<Dispatch<NextState<RawState, State>>>(
    (valueOrFn) => {
      // Use the functional update form of setState to ensure we have the latest previous state
      setState(prevState => {
        // Resolve the raw value (handles both direct value and updater function)
        const resolvedRawValue = resolveHookState<RawState, State>(valueOrFn, prevState);

        // Get the current mediator function from the ref
        const currentMediator = mediatorRef.current;

        // Apply mediator if it exists, otherwise return the resolved raw value
        // (Assuming State and RawState are compatible if no mediator is provided)
        if (currentMediator) {
          return currentMediator(resolvedRawValue);
        } else {
          // If no mediator, assume RawState is assignable to State
          // Add type assertion if necessary, but ideally State == RawState in this case
          return resolvedRawValue as unknown as State;
        }
      });
    },
    [setState], // setState is stable, mediatorRef handles mediator changes
  );

  // Return the current state and the memoized setter
  return [state, setMediatedState];
}


// --- useCounter (Refactored to use useMediatedState and fixed) ---

export type CounterActions = {
  /**
   * Returns the current value of the counter.
   */
  get: () => number;
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
   * Resets the counter to its originally resolved initial value. Clamped by min/max.
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
  min?: number,
): [number, CounterActions] => {
    
  // 1. Create the clamping mediator function, memoized based on min/max
  const mediator = useCallback((value: number): number => {
    let clampedValue = value;
    if (max !== undefined) {
      clampedValue = Math.min(max, clampedValue);
    }
    if (min !== undefined) {
      clampedValue = Math.max(min, clampedValue);
    }
    return clampedValue;
  }, [max, min]); // Recreate mediator only if min/max change

  // 2. Resolve and store the *initial* value *after* mediation, for reset()
  // We need to resolve it once and keep it stable.
  const initialResolvedAndMediatedValue = useMemo(() => {
        const resolved = initState(initialValue);
        return mediator(resolved);
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Calculate only once on initial render


  // 3. Use useMediatedState with the clamped initial value and the mediator
  const [state, setState] = useMediatedState<number, number>(
    initialResolvedAndMediatedValue, // Start with the correctly clamped initial value
    mediator
  );

  // 4. Define stable actions using the setter from useMediatedState
  const actions = useMemo<CounterActions>(() => ({
    get: () => state, // Directly return the current state
    set: (value) => {
        // Pass value/fn directly; useMediatedState handles resolution and mediation
        setState(value);
    },
    inc: (delta = 1) => {
        setState(prev => prev + resolveHookState(delta, prev)); // Resolve delta, add, then mediate
    },
    dec: (delta = 1) => {
        setState(prev => prev - resolveHookState(delta, prev)); // Resolve delta, subtract, then mediate
    },
    reset: () => {
        setState(initialResolvedAndMediatedValue); // Reset to the stored initial mediated value
    },
  }), [state, setState, initialResolvedAndMediatedValue]); // Dependencies needed for get() and reset()

  return [state, actions];
}

