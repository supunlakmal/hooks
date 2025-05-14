import { useFetch, FetchState } from './useFetch';

interface PostOptions extends Omit<RequestInit, 'method'> {
  // Additional POST specific options can be added here if needed
}

export const usePost = <T>(
  url: string | null | undefined,
  options?: PostOptions
): FetchState<T> => {
  return useFetch<T>(url, { ...options, method: 'POST' });
};
