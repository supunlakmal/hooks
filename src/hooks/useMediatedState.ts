import {
  useCallback, useState, type Dispatch
  
} from 'react';
import { useSyncedRef } from './useSyncedRef'; // Assuming this exists and works
import {
  type NextState,
  resolveHookState,
} from '../util/resolve-hook-state'; // Assuming this exists and works

type MediatedStateResult<State> = [State, Dispatch<NextState<State>>];
type MediatedStateResultWithUndefined<State = undefined> = [
  State | undefined,
  Dispatch<NextState<State | undefined>>,
];
type MediatedStateResultWithMediator<State, RawState> = [
  State,
  Dispatch<NextState<RawState, State>>,
];

export type InitialState<State> = State | (() => State)

export function useMediatedState<State = undefined>(): MediatedStateResultWithUndefined<State>;
export function useMediatedState<State>(
  initialState: InitialState<State>,
): MediatedStateResult<State>;
export function useMediatedState<State, RawState = State>(
  initialState: InitialState<State>,
  mediator: (rawNextState: RawState) => State
): MediatedStateResultWithMediator<State, RawState>;
export function useMediatedState<State, RawState>(
    initialState?: InitialState<State>,
    mediator?: (rawNextState: RawState) => State,
):
    MediatedStateResultWithUndefined<State> | MediatedStateResult<State> | MediatedStateResultWithMediator<State, RawState> {
    return useMediatedStateFn<State, RawState>(initialState, mediator);
};
  
// --- Implementation ---

/**
 * Like `useState`, but every value set is passed through a mediator function
 * before the state is updated.
 *
 * @param initialState The initial state value, or a function to compute it.
 * @param mediator An optional function that takes the raw value passed to the setter
 *                 and returns the final state value to be stored.
 */

type SetMediatedState<State, RawState> = Dispatch<NextState<RawState, State>>;


const useMediatedStateFn = <State, RawState> (
  initialState?: InitialState<State>,
  mediator?: (value: RawState) => State
): 
| [State | undefined, Dispatch<NextState<State | undefined>>]
| [State, Dispatch<NextState<State>>]
| [State, Dispatch<NextState<RawState, State>>] => {
  // Use useState directly with the initialState. useState handles functional initializers.
  const [state, setState] = useState<State | undefined>(initialState);

  if (!mediator) {
    const setRawState = setState as Dispatch<NextState<State | undefined, State | undefined>>
    return [
      state,
      setRawState,
    ];
  }
  const mediatorRef = useSyncedRef(mediator);

  const setMediatedState = useCallback<SetMediatedState<State, RawState>>(
    (value) => {
      const currentMediator = mediatorRef.current;

      if (currentMediator) {
        // If a mediator exists, then the type of State is never `undefined`.
        // Previous state is always `State` and never `undefined`.
        setState((previousState: State | undefined) => {
          
          // Previous state can never be undefined if there is a mediator,
          // because that means that the initial state must have been provided.
          const nextRawValue = resolveHookState<RawState, State>(
            value,
            previousState as State
          );
          
          // Pass the raw value through the mediator to get the final state.
          return currentMediator(nextRawValue);
        })
      } else {
         // No mediator exists, in this case RawState is State
        setState(value as any)
      }
    },
    [mediatorRef], 
  );
  
  // Return the current state and the mediated setter function.
   return [
    state as State, // If no mediator, this will have type State | undefined, if there is mediator it is State
    setMediatedState as Dispatch<NextState<RawState, State>> // if no mediator, it will be Dispatch<NextState<State>>
  ]
};
