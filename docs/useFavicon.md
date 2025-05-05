# useFavicon

Dynamically sets the website's favicon.

This hook finds or creates the appropriate `<link>` tag in the document's `<head>` and sets its `href` attribute to the provided URL. It also attempts to set the `type` attribute based on the URL's file extension.

## Usage

```jsx
import React, { useState } from 'react';
import { useFavicon } from '@supunlakmal/hooks'; // Adjust import path

function FaviconSwitcher() {
  const [faviconUrl, setFaviconUrl] = useState('/default-favicon.ico');

  // Apply the favicon
  useFavicon(faviconUrl);

  return (
    <div>
      <h2>Set Favicon</h2>
      <button onClick={() => setFaviconUrl('/icons/icon-alert.png')}>
        Set Alert Favicon (.png)
      </button>
      <button onClick={() => setFaviconUrl('/icons/icon-busy.gif')}>
        Set Busy Favicon (.gif)
      </button>
      <button onClick={() => setFaviconUrl('/favicon.ico')}>
        Set Default Favicon (.ico)
      </button>
      <p>Current Favicon URL: {faviconUrl}</p>
    </div>
  );
}

export default FaviconSwitcher;
```

## API

`useFavicon(url, rel?)`

### Parameters

- **`url`**: `string | null | undefined`
  - The URL of the new favicon image (e.g., `/favicon.ico`, `/path/to/logo.png`, data URI).
  - If `null`, `undefined`, or an empty string, the hook will not attempt to set the favicon.
- **`rel`**: `string` (optional)
  - The `rel` attribute for the `<link>` tag. This is typically `'icon'` or `'shortcut icon'`.
  - Defaults to `'icon'`.
  - The hook attempts to find an existing link with this `rel` attribute first.

### Returns

- `void` - This hook does not return any value.
