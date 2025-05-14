import { useFetch, FetchState } from './useFetch';

interface GetOptions extends Omit<RequestInit, 'method' | 'body'> {
  // Additional GET specific options can be added here if needed
}

export const useGet = <T>(
  url: string | null | undefined,
  options?: GetOptions
): FetchState<T> => {
  return useFetch<T>(url, { ...options, method: 'GET' });
};
