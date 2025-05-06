import { useState, useCallback } from 'react';

// Helper function to get a cookie value by name
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null; // Handle SSR

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    // Does this cookie string begin with the name we want?
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};

// Helper function to set a cookie
const setCookie = (
  name: string,
  value: string,
  options?: { expires?: Date | number; path?: string; domain?: string; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' }
): void => {
  if (typeof document === 'undefined') return; // Handle SSR

  let cookieString = name + '=' + value;
  if (options) {
    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 1000);
        cookieString += '; expires=' + date.toUTCString();
      } else {
        cookieString += '; expires=' + options.expires.toUTCString();
      }
    }
    if (options.path) cookieString += '; path=' + options.path;
    if (options.domain) cookieString += '; domain=' + options.domain;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += '; SameSite=' + options.sameSite;
  }
  document.cookie = cookieString;
};

// Helper function to delete a cookie
const deleteCookie = (name: string, options?: { path?: string; domain?: string }): void => {
 setCookie(name, '', { ...options, expires: new Date(0) });
};

/**
 * @name useCookie
 * @description - Hook that manages a specific browser cookie.
 *
 * @param {string} cookieName The name of the cookie to manage.
 * @param {string} [initialValue] The initial value to use if the cookie is not set.
 * @returns {[string | null, (value: string, options?: { expires?: Date | number; path?: string; domain?: string; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' }) => void, (options?: { path?: string; domain?: string }) => void]} A tuple containing the cookie's current value (or initialValue/null), a function to update the cookie, and a function to delete the cookie.
 *
 * @example
 * const [username, setUsername, deleteUsername] = useCookie('username', 'Guest');
 *
 * setUsername('ReactUser', { expires: 7 }); // Set cookie for 7 seconds
 * deleteUsername(); // Delete the cookie
 */
export const useCookie = (
  cookieName: string,
  initialValue?: string
): [
  string | null,
  (
    value: string,
    options?: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    }
  ) => void,
  (options?: { path?: string; domain?: string }) => void,
] => {
  const [cookieValue, setInternalCookieValue] = useState<string | null>(() =>
    getCookie(cookieName) ?? initialValue ?? null
  );

  const updateCookie = useCallback(
    (value: string, options?: Parameters<typeof setCookie>[2]) => {
      setCookie(cookieName, value, options);
      setInternalCookieValue(value);
    },
    [cookieName]
  );

  const removeCookie = useCallback(
 (options?: { path?: string; domain?: string }) => {
        deleteCookie(cookieName, options);
        setInternalCookieValue(null);
    },
    [cookieName]
  );

  // Optionally add an effect to listen for cookie changes from other tabs/windows,
  // though this is not a standard browser event and requires workarounds.
  // For simplicity, this basic hook doesn't include cross-tab sync.

  return [cookieValue, updateCookie, removeCookie];
};
