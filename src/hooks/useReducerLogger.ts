import { useReducer, useRef, Reducer, Dispatch } from 'react';

// Helper function to get the current time string for logs
const getTime = () => new Date().toLocaleTimeString();

/**
 * A hook that wraps React's `useReducer` to provide console logging
 * of actions and state changes during development.
 * Logs are only output when `process.env.NODE_ENV` is 'development'.
 *
 * @template S - The type of the state.
 * @template A - The type of the action.
 * @param reducer - The reducer function `(state: S, action: A) => S`.
 * @param initialState - The initial state value.
 * @param initializer - Optional function to compute the initial state lazily.
 * @param loggerName - Optional name to identify this reducer instance in logs.
 * @returns A tuple containing the current state and the dispatch function, same as `useReducer`.
 */
export const useReducerLogger = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  initializer?: (initialArg: S) => S,
  loggerName: string = 'Reducer'
): [S, Dispatch<A>] => {
  // Determine initial state
  const computedInitialState = initializer
    ? initializer(initialState)
    : initialState;

  // Wrap the original reducer to intercept and log
  const reducerWithLogger = (state: S, action: A): S => {
    const nextState = reducer(state, action);

    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(
        `%c${loggerName} Action @ ${getTime()}`,
        'color: #4CAF50; font-weight: bold;'
      );
      console.log(
        '%cPrevious State:',
        'color: #9E9E9E; font-weight: bold;',
        state
      );
      console.log('%cAction:', 'color: #03A9F4; font-weight: bold;', action);
      console.log(
        '%cNext State:',
        'color: #4CAF50; font-weight: bold;',
        nextState
      );
      console.groupEnd();
    }

    return nextState;
  };

  // Use the standard useReducer with the wrapped reducer
  const [state, dispatch] = useReducer(reducerWithLogger, computedInitialState);

  // Log initial state on mount (only in development)
  const isMounted = useRef(false);
  if (!isMounted.current && process.env.NODE_ENV === 'development') {
    console.groupCollapsed(
      `%c${loggerName} Initial State @ ${getTime()}`,
      'color: #795548; font-weight: bold;'
    );
    console.log(
      '%cInitial State:',
      'color: #9E9E9E; font-weight: bold;',
      computedInitialState
    );
    console.groupEnd();
    isMounted.current = true;
  }

  return [state, dispatch];
};
