import { useState, useCallback } from 'react';

interface UseErrorBoundaryReturn {
  error: Error | null;
  resetBoundary: () => void;
  showBoundary: (error: Error) => void;
}

/**
 * Hook to manage error state, typically used in conjunction with an Error Boundary component.
 * It allows components (especially fallback components) to reset the error state or programmatically trigger it.
 *
 * @returns {UseErrorBoundaryReturn} An object containing the current error, a function to reset the error, and a function to set an error.
 */
export const useErrorBoundary = (): UseErrorBoundaryReturn => {
  const [error, setError] = useState<Error | null>(null);

  const resetBoundary = useCallback(() => {
    setError(null);
  }, []);

  // Use Error type for consistency, although any value could technically be thrown
  const showBoundary = useCallback((error: Error) => {
    setError(error);
  }, []);

  // Note: This hook does not *catch* errors automatically.
  // It needs to be used with an Error Boundary component.

  return { error, resetBoundary, showBoundary };
};
