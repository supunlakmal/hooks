# `useCookieValue` Hook

This hook provides a simple way to manage a single cookie, including setting, getting, and removing its value. It also synchronizes changes across multiple instances of the hook watching the same cookie.

## Usage
```
typescript
import useCookieValue from '@supunlakmal/hooks/useCookieValue';

function MyComponent() {
  const [theme, setTheme, removeTheme, fetchTheme] = useCookieValue('theme', {
    expires: 7, // Cookie expires in 7 days
    path: '/', // valid for all paths
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleRemoveCookie = ()=>{
    removeTheme();
  }

  const handlefetchCookie = ()=>{
    fetchTheme();
  }
  
  return (
    <div>
      <p>Current Theme: {theme || 'not set'}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={handleRemoveCookie}>Remove Cookie</button>
      <button onClick={handlefetchCookie}>fetch Cookie</button>
    </div>
  );
}
```
## API
```
typescript
import Cookies from 'js-cookie';

export type UseCookieValueOptions<
  InitializeWithValue extends boolean | undefined = boolean | undefined,
> = Cookies.CookieAttributes &
  (InitializeWithValue extends undefined
    ? {
        /**
         * Whether to initialize state with the cookie value or `undefined`.
         *
         * _We suggest setting this to `false` during SSR._
         *
         * @default true
         */
        initializeWithValue?: InitializeWithValue;
      }
    : {
        initializeWithValue: InitializeWithValue;
      });

export type UseCookieValueReturn<V extends undefined | null | string = undefined | null | string> =
  [value: V, set: (value: string) => void, remove: () => void, fetch: () => void];

export function useCookieValue(key: string, options?: UseCookieValueOptions): UseCookieValueReturn;
```
## Parameters

*   **key**: `string`
    *   Type: `string`
    *   Description: The name of the cookie you want to manage.
*   **options**: `UseCookieValueOptions` (optional)
    *   Type: `object`
    *   Description: Options to configure the cookie.
        *   `expires`: `number | Date` (optional) - Expiration date or number of days until expiration.
        *   `path`: `string` (optional) - The path for which the cookie is valid.
        *   `domain`: `string` (optional) - The domain for which the cookie is valid.
        *   `secure`: `boolean` (optional) - Whether the cookie should be transmitted over HTTPS only.
        *   `sameSite`: `boolean | 'strict' | 'lax' | 'none'` (optional) - The SameSite policy for the cookie.
        *   `initializeWithValue`: `boolean` (optional) - Whether to initialize state with the cookie value or `undefined`.

## Returns

*   `UseCookieValueReturn`: `[value: V, set: (value: string) => void, remove: () => void, fetch: () => void]`
    *   `value`: `V` - The current value of the cookie.
    *   `set`: `(value: string) => void` - A function to set a new value for the cookie.
    *   `remove`: `() => void` - A function to remove the cookie.
    *   `fetch`: `() => void` - A function to manually fetch the cookie.

## How it Works

`useCookieValue` uses `useState` internally to store the cookie's value. It leverages the `js-cookie` library to interact with browser cookies. When the `set` function is used, the cookie is updated using `js-cookie`. The hook also uses `useRef`, `useCallback` and `useEffect` for synchronization across multiple hook instances that are using the same key.