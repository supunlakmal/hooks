# useCookie

`useCookie` is a custom React hook that provides a convenient interface for reading, writing, and deleting cookies.

## Description

This hook simplifies the process of interacting with browser cookies within your React components. It allows you to easily get the value of a cookie, set a cookie with optional expiration and path, and remove a cookie.

## Parameters

- `name` (string): The name of the cookie to interact with.

## Return Value

The `useCookie` hook returns an array with three elements:

1. `cookieValue` (string | undefined): The current value of the cookie with the specified name. Returns `undefined` if the cookie does not exist.
2. `setCookie` (function): A function to set or update the cookie.
   - `newValue` (string): The value to set for the cookie.
   - `options` (object, optional): An object containing cookie options.
     - `expires` (Date | number, optional): The expiration date of the cookie. Can be a `Date` object or a number of days until expiration.
     - `path` (string, optional): The path for which the cookie is valid. Defaults to the current path.
3. `deleteCookie` (function): A function to delete the cookie.

## Example

```typescript
import React, { useState } from 'react';
import { useCookie } from '@supunlakmal/hooks'; // Adjust the import path

function CookieComponent() {
  const cookieName = 'myAppCookie';
  const [cookieValue, setCookie, deleteCookie] = useCookie(cookieName);
  const [inputValue, setInputValue] = useState('');

  const handleSetCookie = () => {
    // Set cookie to expire in 7 days
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    setCookie(inputValue, { expires: sevenDaysLater, path: '/' });
    setInputValue(''); // Clear input
  };

  return (
    <div>
      <h1>useCookie Example</h1>
      <p>Cookie Name: <strong>{cookieName}</strong></p>
      <p>
        Current Cookie Value:{' '}
        <strong>{cookieValue === undefined ? 'Not Set' : cookieValue}</strong>
      </p>

      <div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value to set cookie"
        />
        <button onClick={handleSetCookie} disabled={!inputValue}>
          Set Cookie
        </button>
        <button onClick={deleteCookie} disabled={cookieValue === undefined}>
          Delete Cookie
        </button>
      </div>

      <p style={{ marginTop: '20px', fontSize: '0.9em', color: 'gray' }}>
        Note: Cookie interactions depend on browser settings and origin.
      </p>
    </div>
  );
}

export default CookieComponent;
```
