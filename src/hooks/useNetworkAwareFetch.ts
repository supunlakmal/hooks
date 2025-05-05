import { useState, useEffect } from 'react';
import { useNetworkState } from './useNetworkState'; // Assuming signature: () => { online: boolean; ... }
import { useFetch, FetchState } from './useFetch'; // Use exported type

/**
 * Options for useNetworkAwareFetch, extending standard fetch options.
 */
interface UseNetworkAwareFetchOptions extends RequestInit {
  // Future options specific to network awareness could go here
}

/**
 * A hook that combines useNetworkState and useFetch to perform fetch requests
 * only when the user is online. If the user goes offline, the fetch is effectively paused.
 * If the user comes back online, the fetch will be initiated (or re-initiated if the targetUrl changed).
 *
 * @template T The expected data type from the fetch request.
 * @param targetUrl The URL to fetch data from when online.
 * @param options Optional fetch configuration options.
 * @returns The result object from useFetch ({ data, error, loading }).
 */
export function useNetworkAwareFetch<T = unknown>(
  targetUrl: string,
  options?: UseNetworkAwareFetchOptions
): FetchState<T> {
  // Get network state
  const { online } = useNetworkState();

  // State to hold the URL to be passed to useFetch
  // Initialize based on current online status and targetUrl
  const [fetchUrl, setFetchUrl] = useState<string | null>(() =>
    online ? targetUrl : null
  );

  // Effect to update the fetchUrl when online status or targetUrl changes
  useEffect(() => {
    if (online) {
      // If online, set the URL to the target, potentially triggering fetch
      setFetchUrl(targetUrl);
    } else {
      // If offline, set URL to null to prevent/cancel fetch
      setFetchUrl(null);
      // Optional: Could also reset fetch state here if desired when going offline
    }
  }, [online, targetUrl]);

  // Use the underlying useFetch hook with the managed URL
  const fetchResult = useFetch<T>(fetchUrl, options);

  // Return the fetch state
  return fetchResult;
}
