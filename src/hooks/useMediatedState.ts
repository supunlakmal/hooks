import { useCallback, useState, useMemo, useRef, type Dispatch } from 'react';

// --- useSyncedRef ---
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

// --- State Helpers ---
type StateInitializerFN<State> = () => State;
type StateUpdaterFN<State, PreviousState = State> = (
  previousState: PreviousState
) => State;

export type InitialState<State> = State | StateInitializerFN<State>;
export type NextState<State, PreviousState = State> =
  | State
  | StateUpdaterFN<State, PreviousState>;

/** Internal helper to resolve initial state */
export const resolveInitialState = <State>(
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
export const resolveNextState = <State, PreviousState = State>(
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

// --- useMediatedState ---
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
