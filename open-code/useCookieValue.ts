import { useState, useCallback } from 'react';

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
};

const useCookieValue = (
  key: string,
  initialValue: string = '',
  options: CookieOptions = {}
): [string, (value: string, options?: CookieOptions) => void, () => void] => {
  const readCookie = (): string => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=');
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return initialValue;
  };

  const [cookieValue, setCookieValueState] = useState<string>(readCookie);

  const updateCookie = useCallback(
    (newValue: string, updateOptions?: CookieOptions) => {
      const mergedOptions = { ...options, ...updateOptions };
      let cookieString = `${key}=${encodeURIComponent(newValue)};`;

      if (mergedOptions.expires) {
        const expiration =
          typeof mergedOptions.expires === 'number'
            ? new Date(Date.now() + mergedOptions.expires * 1000)
            : mergedOptions.expires;
        cookieString += `expires=${expiration.toUTCString()};`;
      }

      if (mergedOptions.path) {
        cookieString += `path=${mergedOptions.path};`;
      }
      if (mergedOptions.domain) {
        cookieString += `domain=${mergedOptions.domain};`;
      }

      if (mergedOptions.secure) {
        cookieString += 'secure;';
      }
      document.cookie = cookieString;
      setCookieValueState(newValue);
    },
    [key, options]
  );

  const deleteCookie = useCallback(() => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    setCookieValueState(initialValue);
  }, [key,initialValue]);

  return [cookieValue, updateCookie, deleteCookie];
};

export default useCookieValue;