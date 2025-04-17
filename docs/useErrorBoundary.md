# `useErrorBoundary` Hook

Provides state management (`error`) and control functions (`resetBoundary`, `showBoundary`) for handling JavaScript errors within a component tree. This hook is designed to be used **in conjunction with** an actual React Error Boundary component (either a class component or one from a library like `react-error-boundary`). It does **not** catch errors itself.

## Why use this hook?

- **Resetting Errors:** Allows a fallback UI component (rendered by the Error Boundary) to include a "Retry" or "Reset" button that clears the error state, potentially allowing the original component tree to re-render successfully.
- **Programmatic Errors:** Enables triggering the error boundary state manually from within a component (e.g., after catching an error in an async operation or event handler that wouldn't be caught by the React render cycle).

## Usage

This example uses the `react-error-boundary` library for the actual boundary component.

**1. Install `react-error-boundary`:**

```bash
npm install react-error-boundary
# or
yarn add react-error-boundary
```

**2. Implement the Hook and Boundary:**

```typescript
import React, { useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useErrorBoundary } from "@supunlakmal/hooks"; // Adjust path

// --- Component that might throw an error ---
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("💥 Simulated Rendering Error!");
  }
  return <div>Component rendered successfully!</div>;
}

// --- Fallback Component rendered by ErrorBoundary ---
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Note: `resetErrorBoundary` comes from react-error-boundary props
  // If using a custom class boundary, you'd likely use the hook's resetBoundary here
  return (
    <div
      role="alert"
      style={{ border: "2px solid red", padding: "15px", margin: "20px 0" }}
    >
      <h2>Something went wrong:</h2>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  );
}

// --- Component using the hook to *show* an error programmatically ---
function AsyncErrorComponent() {
  const { showBoundary } = useErrorBoundary(); // Get showBoundary from our hook
  const [isLoading, setIsLoading] = useState(false);

  const simulateAsyncError = async () => {
    setIsLoading(true);
    try {
      // Simulate an API call or other async task that fails
      await new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API Call Failed!")), 1000)
      );
    } catch (error) {
      // Catch the async error and trigger the boundary
      if (error instanceof Error) {
        showBoundary(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={simulateAsyncError} disabled={isLoading}>
      {isLoading ? "Loading..." : "Simulate Async Error"}
    </button>
  );
}

// --- Main App Setup ---
function AppWithErrorBoundary() {
  const { error, resetBoundary, showBoundary } = useErrorBoundary();
  const [throwRenderError, setThrowRenderError] = useState(false);

  return (
    <div>
      <h1>useErrorBoundary Demo</h1>
      {/* 
         Wrap potentially problematic components in ErrorBoundary. 
         Pass the hook's resetBoundary and error state if needed,
         or rely on react-error-boundary's props like in ErrorFallback.
       */}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          console.log("Boundary reset!");
          setThrowRenderError(false); // Reset state causing the render error
          // Call our hook's resetBoundary if managing state here
          // resetBoundary();
        }}
        // You could potentially use the hook's error state here too,
        // but react-error-boundary manages its own internal error state.
        // resetKeys={[someKey]} // Optional: automatically reset when keys change
      >
        <p>This section is inside the Error Boundary.</p>
        <button
          onClick={() => setThrowRenderError(true)}
          disabled={throwRenderError}
        >
          Simulate Render Error
        </button>
        <BuggyComponent shouldThrow={throwRenderError} />

        {/* Component triggering error programmatically via the hook */}
        {/* ErrorBoundary won't catch this async error directly, 
           but showBoundary will activate the nearest boundary's fallback */}
        {/* We need another boundary or context for showBoundary to work */}
        {/* Let's wrap the AsyncErrorComponent separately for clarity */}
        <h2 style={{ marginTop: "20px" }}>Programmatic Error Trigger</h2>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={resetBoundary}
        >
          {/* Show error from hook state if present */}
          {error ? (
            <ErrorFallback error={error} resetErrorBoundary={resetBoundary} />
          ) : (
            <AsyncErrorComponent />
          )}
        </ErrorBoundary>
      </ErrorBoundary>
    </div>
  );
}

export default AppWithErrorBoundary;
```

## API

### Parameters

None.

### Returns

An object (`UseErrorBoundaryReturn`) containing:

- `error`: `Error | null` - The currently captured error object, or `null` if no error is active.
- `resetBoundary`: `() => void` - A memoized function that sets the `error` state back to `null`. Call this to attempt recovery from an error.
- `showBoundary`: `(error: Error) => void` - A memoized function that accepts an `Error` object and sets it as the current `error` state. This can be used to programmatically trigger the error state (e.g., from a `catch` block).

## How it Works

1.  **State Management**: Uses `useState` to manage the `error` state, initialized to `null`.
2.  **`resetBoundary` Function**: A memoized function (using `useCallback`) that simply calls `setError(null)`.
3.  **`showBoundary` Function**: A memoized function (using `useCallback`) that takes an `Error` object and updates the state using `setError(error)`.
4.  **Return Value**: Returns an object containing the current `error` state and the `resetBoundary` and `showBoundary` functions.

**Important:** This hook solely manages the _state_ related to an error. It **must** be used within the context of a component that actually implements the Error Boundary logic (like `<ErrorBoundary>` from `react-error-boundary` or a custom class component using `getDerivedStateFromError` and `componentDidCatch`) to catch rendering errors and display a fallback UI based on the presence of the `error` state.
