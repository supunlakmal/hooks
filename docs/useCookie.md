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