import Cookies from 'js-cookie';
import { useState, useCallback } from 'react';

const isFunction = (value: any): value is Function => typeof value === 'function';

const isString = (value: any): value is string => typeof value === 'string';

type State = string | undefined;

interface CookieOptions extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}

function useCookieState(cookieKey: string, options: CookieOptions = {}) {
  const [value, setValue] = useState<State>(() => {
    const cookieValue = Cookies.get(cookieKey);

    if (isString(cookieValue)) return cookieValue;

    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  });

  const setCookie = useCallback(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };
      const updatedValue = isFunction(newValue) ? newValue(value) : newValue;
      setValue(updatedValue)

      if (updatedValue === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, updatedValue, restOptions);
      }
    },
    [cookieKey, value, options],
  );

  return [value, setCookie] as const;
}

export default useCookieState;