# useScript

Dynamically loads an external JavaScript script and tracks its loading status.

This hook handles appending the script tag to the DOM, attaching load and error handlers, and optionally removing the script tag when the component unmounts.

## Usage

```jsx
import React, { useState } from 'react';
import { useScript } from '@supunlakmal/hooks'; // Adjust the import path as needed

function ScriptLoaderComponent() {
  const [loadJquery, setLoadJquery] = useState(false);
  const jqueryStatus = useScript(
    loadJquery ? 'https://code.jquery.com/jquery-3.6.0.min.js' : null,
    {
      removeOnUnmount: false, // Keep jQuery loaded even if this component unmounts
      onLoad: () => {
        console.log('jQuery loaded successfully!');
        // You can now use jQuery, e.g., window.jQuery(...)
      },
      onError: (error) => {
        console.error('Failed to load jQuery:', error);
      },
      attrs: { // Example: Add integrity and crossorigin attributes
        integrity: 'sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=',
        crossorigin: 'anonymous',
      },
    }
  );

  return (
    <div>
      <button onClick={() => setLoadJquery(true)} disabled={loadJquery || jqueryStatus === 'loading'}>
        Load jQuery
      </button>
      <p>jQuery Status: {jqueryStatus}</p>
      {jqueryStatus === 'ready' && <p>jQuery is ready to use!</p>}
      {jqueryStatus === 'error' && <p>Error loading jQuery.</p>}
    </div>
  );
}

export default ScriptLoaderComponent;
```

## API

`useScript(src, options?)`

### Parameters

-   **`src`**: `string | null | undefined`
    -   The source URL of the script to load.
    -   If `null` or `undefined`, the hook will effectively unload any previously managed script (if `removeOnUnmount` is true) or simply remain in an 'idle' state.
-   **`options`**: `object` (optional)
    An object containing configuration options:
    -   `attrs?`: `Record<string, string | boolean>` - HTML attributes to set on the script element (e.g., `async`, `defer`, `integrity`, `crossorigin`). Boolean attributes like `async` or `defer` should be set to `true` if needed.
    -   `onLoad?`: `() => void` - Optional callback function that executes when the script successfully loads.
    -   `onError?`: `(error: Event | string) => void` - Optional callback function that executes if the script fails to load.
    -   `removeOnUnmount?`: `boolean` - If `true` (the default), the script tag will be removed from the DOM when the component unmounts. Set to `false` to keep the script loaded.

### Returns

-   **`status`**: `'idle' | 'loading' | 'ready' | 'error'`
    -   The current loading status of the script.
    -   `idle`: No `src` provided or script is unloaded.
    -   `loading`: Script is currently being loaded.
    -   `ready`: Script has loaded successfully.
    -   `error`: An error occurred while loading the script.
