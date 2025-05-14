import { useFetch, FetchState } from './useFetch';

interface PutOptions extends Omit<RequestInit, 'method'> {
  // Additional PUT specific options can be added here if needed
}

export const usePut = <T>(
  url: string | null | undefined,
  options?: PutOptions
): FetchState<T> => {
  return useFetch<T>(url, { ...options, method: 'PUT' });
};
