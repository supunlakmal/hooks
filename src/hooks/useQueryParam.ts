import { useState, useCallback, useEffect } from 'react';
import { useEventListener } from './useEventListener';

// Helper to safely get query param value (handles SSR)
const getQueryParamValue = (paramName: string): string | null => {
  if (
    typeof window === 'undefined' ||
    !window.location ||
    !window.location.search
  ) {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
};

// Helper to update query param in URL without adding history entry
const updateUrlQueryParam = (paramName: string, value: string | null) => {
  if (typeof window === 'undefined' || !window.history || !window.location) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  if (value === null || value === undefined) {
    params.delete(paramName);
  } else {
    params.set(paramName, value);
  }
  const newSearch = params.toString();
  // Create new URL preserving path and hash
  const newUrl = `${window.location.pathname}${
    newSearch ? '?' + newSearch : ''
  }${window.location.hash}`;

  // Use replaceState to avoid polluting browser history
  window.history.replaceState(window.history.state, '', newUrl);
};

/**
 * Custom hook to synchronize a state variable with a URL query parameter.
 * Note: This basic version only handles string values.
 *
 * @param {string} paramName The name of the URL query parameter.
 * @param {string} [initialValue=''] The default value to use if the parameter is not in the URL.
 * @returns {[string, (newValue: string | null) => void]} A tuple containing:
 *          - The current value of the query parameter state.
 *          - A function to update the state and the URL query parameter (pass null to remove).
 */
export const useQueryParam = (
  paramName: string,
  initialValue: string = ''
): [string, (newValue: string | null) => void] => {
  // State reflects the param value, falling back to initialValue if absent
  const [value, setValue] = useState<string>(() => {
    return getQueryParamValue(paramName) ?? initialValue;
  });

  // Update state and URL parameter
  const updateParam = useCallback(
    (newValue: string | null) => {
      // Determine the value to set in state (fallback to initialValue if param is removed)
      const stateValueToSet = newValue ?? initialValue;
      setValue(stateValueToSet);
      // Update the URL (null removes the parameter)
      updateUrlQueryParam(paramName, newValue);
    },
    [paramName, initialValue]
  );

  // Listen for popstate events (browser back/forward) to update state from URL
  const handlePopState = useCallback(() => {
    setValue(getQueryParamValue(paramName) ?? initialValue);
  }, [paramName, initialValue]);

  useEventListener('popstate', handlePopState);

  // Effect to ensure state is synced if paramName changes or on initial load
  // (Handles cases where URL might change externally without popstate, though less common)
  useEffect(() => {
    const currentValueFromUrl = getQueryParamValue(paramName);
    if (currentValueFromUrl !== value) {
      // Only update if different from current state
      setValue(currentValueFromUrl ?? initialValue);
    }
    // Depend on paramName and initialValue to re-sync if they change
  }, [paramName, initialValue, value]); // Include value to prevent unnecessary updates if URL matches state

  return [value, updateParam];
};
