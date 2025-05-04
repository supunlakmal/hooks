import { type SetStateAction, useCallback, useRef, useState, useEffect } from 'react';

/**
 * Returns a boolean that is `true` only on first render.
 */
const useFirstMountState = (): boolean => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  return isFirstMount.current;
};

const stateChanger = (state: number) => (state + 1) % Number.MAX_SAFE_INTEGER;

/**
 * Return callback function that re-renders component.
 */
const useRerender = (): (() => void) => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = useState(0);

  return useCallback(() =>
    setState(stateChanger),
  }, []);
};

type StateInitializerFN<State> = () => State;
type StateUpdaterFN<State, PreviousState = State> = (previousState: PreviousState) => State;

export type InitialState<State> = State | StateInitializerFN<State>;
export type NextState<State, PreviousState = State> = State | StateUpdaterFN<State, PreviousState>;

const initState = <State>(initialState: InitialState<State>): State => {
  if (typeof initialState === 'function') {
    initialState = (initialState as StateInitializerFN<State>)();
  }

  return initialState;
};

const updateState = <State, PreviousState = State>(
  nextState: NextState<State, PreviousState>,
  previousState: PreviousState,
): State {
  if (typeof nextState === 'function') {
    return (nextState as StateUpdaterFN<State, PreviousState>)(previousState);
  }

  return nextState;
}

const resolveHookState = <State, PreviousState = State>(
  ...args:
  | Parameters<typeof initState<State>>
    | Parameters<typeof updateState<State, PreviousState>>
): State => {
  if (args.length === 1) {
    return initState(args[0]);
  }

  return updateState(args[0], args[1]);
};

export type ControlledRerenderDispatch<A> = (value: A, rerender?: boolean) => void;

/**
 * Like `React.useState`, but its state setter accepts extra argument, that allows to cancel
 * rerender.
 */
export const useControlledRerenderState = <S = undefined>(
  initialState?: S | (() => S),
): [S | undefined, ControlledRerenderDispatch<SetStateAction<S | undefined>>] => {

  const isFirstMount = useFirstMountState();

  const state = useRef<S | undefined>(
    useFirstMountState() ? (initialState instanceof Function ? initialState() : initialState) as S | undefined : undefined,
  );
  const rr = useRerender();

  return [
    state.current,
    useCallback(
      (value: SetStateAction<S | undefined>, rerender?: boolean) => { 
        const newState = resolveHookState(value, state.current); 
          
        if(isFirstMount){
          state.current = (initialState instanceof Function ? initialState() : initialState) as S | undefined
        }

        if(newState !== state.current) {
            state.current = newState

            if (rerender === undefined || rerender) {
              rr();
            }
        }
      },
      [rr, initialState, isFirstMount]
    )
  ];
};
