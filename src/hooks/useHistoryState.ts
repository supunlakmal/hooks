import { useState, useCallback } from 'react';

type HistoryState<T> = {
  history: T[];
  pointer: number;
};

export function useHistoryState<T>(initialState: T): [
  T,
  (newState: T) => void,
  () => void,
  () => void,
  boolean,
  boolean
] {
  const [state, setState] = useState<HistoryState<T>>({
    history: [initialState],
    pointer: 0,
  });

  const present = state.history[state.pointer];

  const setPresentState = useCallback((newState: T) => {
    setState((prevState) => {
      const newHistory = prevState.history.slice(0, prevState.pointer + 1);
      return {
        history: [...newHistory, newState],
        pointer: prevState.pointer + 1,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      pointer: Math.max(0, prevState.pointer - 1),
    }));
  }, []);

  const goForward = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      pointer: Math.min(prevState.history.length - 1, prevState.pointer + 1),
    }));
  }, []);

  const canGoBack = state.pointer > 0;
  const canGoForward = state.pointer < state.history.length - 1;

 return [present, setPresentState, goBack, goForward, canGoBack, canGoForward];
}