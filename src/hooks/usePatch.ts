import { useFetch, FetchState } from './useFetch';

interface PatchOptions extends Omit<RequestInit, 'method'> {
  // Additional PATCH specific options can be added here if needed
}

export const usePatch = <T>(
  url: string | null | undefined,
  options?: PatchOptions
): FetchState<T> => {
  return useFetch<T>(url, { ...options, method: 'PATCH' });
};
