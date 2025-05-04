import {type Dispatch, useCallback, useState, type SetStateAction} from 'react';
import {useSyncedRef} from './useSyncedRef'; // Assuming this exists and works
import {type InitialState, type NextState, resolveHookState} from '../util/resolve-hook-state'; // Assuming this exists and works

// --- Overload Signatures ---

// Overload 1: No arguments (infers State as undefined)
export function useMediatedState<State = undefined>(): [
	State | undefined,
	Dispatch<NextState<State | undefined>>,
];

// Overload 2: Initial state only (no mediator)
export function useMediatedState<State>(
	initialState: InitialState<State>
): [State, Dispatch<NextState<State>>];

// Overload 3: Initial state and mediator
export function useMediatedState<State, RawState = State>(
	initialState: InitialState<State>,
	mediator: (rawNextState: RawState) => State // Mediator takes the "raw" value intended by the setter
): [State, Dispatch<NextState<RawState, State>>];

// --- Implementation ---

/**
 * Like `useState`, but every value set is passed through a mediator function
 * before the state is updated.
 *
 * @param initialState The initial state value, or a function to compute it.
 * @param mediator An optional function that takes the raw value passed to the setter
 *                 and returns the final state value to be stored.
 */
export function useMediatedState<State, RawState = State>(
	initialState?: InitialState<State>,
	mediator?: (value: RawState /* | State | undefined */) => State // Implementation signature slightly more general internally
): [State | undefined, Dispatch<NextState<RawState, State | undefined>>] {
	// Use useState directly with the initialState. useState handles functional initializers.
	const [state, setState] = useState<State | undefined>(initialState);

	// Keep the mediator reference stable without causing re-renders or stale closures.
	const mediatorRef = useSyncedRef(mediator);

	const setMediatedState = useCallback<Dispatch<NextState<RawState, State | undefined>>>(
        (value) => {
            const currentMediator = mediatorRef.current;

            if (currentMediator) {
                // If a mediator exists, use the functional update form of setState
                // to ensure we're mediating based on the latest state if needed,
                // and always apply the mediator to the resolved next value.
                setState(previousState => {
                    // Calculate the next "raw" state value based on what was passed to the setter.
                    const nextRawValue = resolveHookState<RawState, State | undefined>(value, previousState);
                    // Pass the raw value through the mediator to get the final state.
                    return currentMediator(nextRawValue);
                });
            } else {
                // No mediator exists. In this case, the overload signatures ensure
                // that RawState is effectively the same as State or State | undefined.
                // We can safely cast the value to the type expected by setState.
                // setState handles both direct values and functional updates (`(prevState) => newState`).
                setState(value as SetStateAction<State | undefined>);
            }
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [] // Dependencies are empty because mediatorRef ensures mediator access is always current.
    );

	// Return the current state and the mediated setter function.
	return [state, setMediatedState];
}