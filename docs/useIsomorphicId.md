# useIsomorphicId

The `useIsomorphicId` hook generates unique IDs that are stable and consistent across server and client rendering environments. It acts as a wrapper around React's built-in `useId` (available in React 18+) when available, providing a fallback for older versions or environments where `useId` might not be present.

**Recommendation:** For proper Server-Side Rendering (SSR) hydration compatibility, using React 18+ with the built-in `useId` is highly recommended. The fallback provided in this hook for older React versions might not be perfectly safe for hydration.

## Usage

```jsx
import React from 'react';
import { useIsomorphicId } from '@supunlakmal/hooks'; // Assuming installation

function AccessibleComponent() {
  // Generate unique, stable IDs for accessibility attributes
  const titleId = useIsomorphicId();
  const descriptionId = useIsomorphicId();
  const inputId = useIsomorphicId();

  return (
    <div>
      <h2 id={titleId}>Accessible Form Section</h2>
      <p id={descriptionId}>This section demonstrates using IDs for ARIA attributes.</p>
      
      <label htmlFor={inputId}>Enter Value:</label>
      <input 
        id={inputId} 
        type="text" 
        aria-labelledby={titleId} 
        aria-describedby={descriptionId} 
      />

      <p>
        Generated IDs (will be consistent across server/client):
        <br />
        Title ID: <code>{titleId}</code>
        <br />
        Description ID: <code>{descriptionId}</code>
        <br />
        Input ID: <code>{inputId}</code>
      </p>
    </div>
  );
}

export default AccessibleComponent;
```

## API

### Parameters

None.

### Return Value

-   `id`: `string`
    -   A unique and stable ID string suitable for use in HTML attributes like `id`, `htmlFor`, `aria-labelledby`, etc.

## Behavior

-   **React 18+:** If `React.useId` is available, the hook directly calls and returns its result. This is the preferred and safest method for SSR hydration.
-   **React < 18 / No `useId`:**
    -   It uses a simple incrementing counter (`serverId`) during server rendering or the initial client render to generate a basic ID (e.g., `fallback-id-1`).
    -   It stores this ID using `useState`.
    -   **Important:** This fallback mechanism might lead to hydration mismatches in React versions below 18 if the server-generated ID doesn't perfectly align with what the client expects or generates before hydration completes. Consider upgrading React or using a dedicated SSR-safe ID library for React < 18 if strict hydration safety is required.
-   The hook ensures that the ID generated remains stable for the lifetime of the component instance.
