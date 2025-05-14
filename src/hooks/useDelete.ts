import { useFetch, FetchState } from './useFetch';

interface DeleteOptions extends Omit<RequestInit, 'method' | 'body'> {
  // Additional DELETE specific options can be added here if needed
}

export const useDelete = <T>(
  url: string | null | undefined,
  options?: DeleteOptions
): FetchState<T> => {
  return useFetch<T>(url, { ...options, method: 'DELETE' });
};
