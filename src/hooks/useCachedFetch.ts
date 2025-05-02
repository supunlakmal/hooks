import { useState, useEffect, useRef, useCallback } from "react";

// Type Definitions
type CacheStore<T> = Map<string, CacheEntry<T>>;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type FetchStatus = "idle" | "loading" | "success" | "error";

// Hook Options
interface UseCachedFetchOptions {
  /** Time-to-live for cache entries in milliseconds. Defaults to 5 minutes. */
  ttl?: number;
  /** Standard fetch options (method, headers, body, etc.). */
  fetchOptions?: RequestInit;
  /** Function to generate a unique cache key from the URL and options. Defaults to using the URL. */
  getCacheKey?: (url: string, options?: RequestInit) => string;
  /** If true, prevents fetching if data exists in cache, even if expired. Defaults to false. */
  cacheOnlyIfFresh?: boolean;
}

// Hook Result
interface UseCachedFetchResult<T> {
  data: T | undefined;
  error: Error | undefined;
  status: FetchStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
  /** Function to manually trigger a refetch, optionally bypassing cache. */
  refetch: (options?: { ignoreCache?: boolean }) => Promise<void>;
}

// In-memory cache store (shared across hook instances if defined outside)
const globalCache: CacheStore<any> = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches data like `useFetch` but includes a simple in-memory cache
 * to avoid redundant requests for the same URL within a configurable TTL.
 *
 * @template T The expected type of the data to be fetched.
 * @param url The URL to fetch data from.
 * @param options Configuration options including TTL, fetch options, and cache key generation.
 * @returns State object with data, error, status, and refetch function.
 */
export function useCachedFetch<T = any>(
  url: string | undefined | null,
  options: UseCachedFetchOptions = {}
): UseCachedFetchResult<T> {
  const {
    ttl = DEFAULT_TTL,
    fetchOptions,
    getCacheKey = (u) => u, // Default key is just the URL
  } = options;

  const cacheKey = url ? getCacheKey(url, fetchOptions) : ""; // Generate cache key

  // State for the fetch status
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [data, setData] = useState<T | undefined>(() => {
    // Initialize state from cache if available and valid
    const cachedEntry = globalCache.get(cacheKey);
    if (cachedEntry && Date.now() - cachedEntry.timestamp <= ttl) {
      return cachedEntry.data as T;
    }
    return undefined;
  });
  const [error, setError] = useState<Error | undefined>(undefined);

  // Ref to track mounted status and prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Ref to store options without causing effect re-runs
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(
    async (ignoreCache = false) => {
      if (!url) {
        if (isMounted.current) {
          setStatus("idle");
          setData(undefined);
          setError(undefined);
        }
        return;
      }

      const currentCacheKey = getCacheKey(url, optionsRef.current.fetchOptions);
      const currentTtl = optionsRef.current.ttl ?? DEFAULT_TTL;
      const currentCacheOnlyIfFresh =
        optionsRef.current.cacheOnlyIfFresh ?? false;

      if (!ignoreCache) {
        const cachedEntry = globalCache.get(currentCacheKey);
        const isFresh =
          cachedEntry && Date.now() - cachedEntry.timestamp <= currentTtl;

        if (cachedEntry && (isFresh || !currentCacheOnlyIfFresh)) {
          if (isMounted.current) {
            setData(cachedEntry.data as T);
            setStatus("success");
            setError(undefined);
          }
          return; // Serve from cache
        }
      }

      if (isMounted.current) {
        setStatus("loading");
        setError(undefined); // Clear previous error on new fetch
      }

      try {
        const response = await fetch(url, optionsRef.current.fetchOptions);
        if (!response.ok) {
          let errorPayload: any;
          try {
            errorPayload = await response.json(); // Try to parse error body
          } catch {
            errorPayload = response.statusText; // Fallback to status text
          }
          throw new Error(
            typeof errorPayload === "string"
              ? errorPayload
              : JSON.stringify(errorPayload)
          );
        }

        const result = await response.json();

        if (isMounted.current) {
          setData(result as T);
          setStatus("success");
          setError(undefined);
          // Update cache
          globalCache.set(currentCacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }
      } catch (err: any) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setStatus("error");
        }
      }
    },
    [url, getCacheKey]
  ); // Dependencies: url and key generation logic

  // Initial fetch effect
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-run if URL or getCacheKey changes

  const refetch = useCallback(
    async (opts?: { ignoreCache?: boolean }) => {
      await fetchData(opts?.ignoreCache);
    },
    [fetchData]
  );

  return {
    data,
    error,
    status,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
    isIdle: status === "idle",
    refetch,
  };
}

