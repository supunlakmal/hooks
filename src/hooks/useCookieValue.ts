import { type Dispatch, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import Cookies from 'js-cookie';

function useFirstMountState(): boolean {
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  return isFirstMount.current;
}

/**
 * Custom hook that runs a callback function exactly once when the component mounts.
 *
 * @param onMount - The function to call on mount.
 */
function useMount(onMount: () => void): void {
  // Use a ref to store the callback to ensure the correct function is called,
  // even though useEffect with [] should only run once.
  // This pattern aligns with useUnmount and handles potential edge cases or future extensions.
  const onMountRef = useRef(onMount);

  // Update the ref in case the callback identity changes before the mount effect runs
  // (though unlikely to matter in practice for a mount-only effect).
  onMountRef.current = onMount;

  useEffect(() => {
    // Call the callback stored in the ref
    onMountRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once after initial mount
}

/**
 * Like `useRef`, but it returns immutable ref that contains actual value.
 *
 * @param value
 */
function useSyncedRef<T>(value: T): { readonly current: T } {
  const ref = useRef(value);

  ref.current = value;

  return useMemo(
    () =>
      Object.freeze({
        get current() {
          return ref.current;
        },
      }),
    [],
  );
}

const isBrowser =
  typeof globalThis !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  typeof document !== 'undefined';

const cookiesSetters = new Map<string, Set<Dispatch<string | null>>>();

const registerSetter = (key: string, setter: Dispatch<string | null>) => {
  let setters = cookiesSetters.get(key);

  if (!setters) {
    setters = new Set();
    cookiesSetters.set(key, setters);
  }

  setters.add(setter);
};

const unregisterSetter = (key: string, setter: Dispatch<string | null>): void => {
  const setters = cookiesSetters.get(key);

  if (!setters) {
    return;
  }

  setters.delete(setter);

  if (setters.size === 0) {
    cookiesSetters.delete(key);
  }
};

const invokeRegisteredSetters = (
  key: string,
  value: string | null,
  skipSetter?: Dispatch<string | null>,
) => {
  const setters = cookiesSetters.get(key);

  if (!setters) {
    return;
  }

  setters.forEach((s) => {
    if (s === skipSetter) {
        return;
      }
      s(value);})
};

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

export function useCookieValue(
  key: string,
  options: UseCookieValueOptions<false>,
): UseCookieValueReturn;
export function useCookieValue(key: string, options?: UseCookieValueOptions): UseCookieValueReturn;
/**
 * Manages a single cookie.
 *
 * @param key Name of the cookie to manage.
 * @param options Cookie options that will be used during setting and deleting the cookie.
 */
export function useCookieValue(
  key: string,
  options: UseCookieValueOptions = {},
): UseCookieValueReturn {
  if (process.env.NODE_ENV === 'development' && Cookies === undefined) {
    throw new ReferenceError(
      'Dependency `js-cookies` is not installed, it is required for `useCookieValue` work.',
    );
  }

  let { initializeWithValue = true, ...cookiesOptions } = options;

  if (!isBrowser) {
    initializeWithValue = false;
  }

  const methods = useSyncedRef({
    set(value: string) {
      setState(value);
      Cookies.set(key, value, cookiesOptions);
      // Update all other hooks with the same key
      invokeRegisteredSetters(key, value, setState);
    },
    remove() {
      setState(null);
      Cookies.remove(key, cookiesOptions);
      invokeRegisteredSetters(key, null, setState);
    },
    fetchVal: () => Cookies.get(key) ?? null,
    fetch() {
      const value = methods.current.fetchVal();
      setState(value);
      invokeRegisteredSetters(key, value, setState);
    },
  });

  const isFirstMount = useFirstMountState();
  const [state, setState] = useState<string | null | undefined>(
    isFirstMount && initializeWithValue ? methods.current.fetchVal() : undefined,
  );

  useMount(() => {
    if (!initializeWithValue) {
      methods.current.fetch();
    }
  });

  useEffect(() => {
    registerSetter(key, setState);

    return () => {
      unregisterSetter(key, setState);
    };
  }, [key]);

  return [
    state,

    useCallback((value: string) => {
      methods.current.set(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),

    useCallback(() => {
      methods.current.remove();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),

    useCallback(() => {
      methods.current.fetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  ];
}