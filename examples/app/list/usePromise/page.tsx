import { usePromise } from 'src';
import { useCallback } from 'react';

export default function UsePromiseExample() {
  const getRandomNumberPromise = useCallback(() => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(Math.random());
      }, 2000);
    });
  }, []);

  const { data, error, loading, reload } = usePromise<number>(getRandomNumberPromise);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {data !== undefined && <p>Data: {data}</p>}
      {error && <p>Error: {error.message}</p>}
      <button onClick={reload}>Reload</button>
    </div>
  );
}