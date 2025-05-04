import { useState, useEffect, useCallback } from 'react';

export const usePromise = <T>(promiseFn: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setData(null);
    promiseFn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [promiseFn]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, error, loading, reload };
}