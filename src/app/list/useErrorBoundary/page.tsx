"use client";
import React, { useState } from 'react';
import useErrorBoundary from '../../../hooks/useErrorBoundary';

function ErrorBoundaryExample() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const { hasError, error, resetErrorBoundary } = useErrorBoundary();

  if (hasError) {
    return (
      <div>
        <h2>An error occurred:</h2>
        <pre>{error.toString()}</pre>
        <button onClick={() => {
            resetErrorBoundary();
            setShouldThrow(false);
        }}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setShouldThrow(true)}>
        Throw Error
      </button>
      {shouldThrow && (() => { throw new Error("This is a test error!"); })()}
      <h2>No error</h2>
    </div>
  );
}

export default ErrorBoundaryExample;