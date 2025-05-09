import { useState, useCallback } from 'react';

/**
 * @name useForceUpdate
 * @description - Hook that provides a function to force a component to re-render.
 *
 * @returns {() => void} A function that, when called, will force the component to re-render.
 *
 * @example
 * const forceUpdate = useForceUpdate();
 *
 * // Later, when you need to force a re-render:
 * forceUpdate();
 */
export const useForceUpdate = (): (() => void) => {
  const [, updateState] = useState({});

  const forceUpdate = useCallback(() => {
    updateState({});
  }, []);

  return forceUpdate;
};
