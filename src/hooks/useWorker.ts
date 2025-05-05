import { useCallback, useEffect, useRef, useState } from 'react';

type WorkerStatus = 'idle' | 'working' | 'success' | 'error';

interface UseWorkerResult<T, R> {
  execute: (...args: T[]) => void;
  result: R | null;
  error: Error | null;
  status: WorkerStatus;
  kill: () => void;
}

/** */
export const useWorker = <T, R>(
  workerFn: (...args: T[]) => R
): UseWorkerResult<T, R> => {
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<WorkerStatus>('idle');
  const workerRef = useRef<Worker | null>(null);

  const execute = useCallback(
    (...args: T[]) => {
      setStatus('working');
      setError(null);
      setResult(null);

      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }

      const workerCode = `
      self.onmessage = async (event) => {
        try {
          const result = await (${workerFn.toString()})(...event.data);
          self.postMessage({ type: 'success', result });
        } catch (error) {
          self.postMessage({ type: 'error', error: error.message });
        }
      };
    `;

      const blob = new Blob([workerCode], { type: 'text/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);
      workerRef.current = worker;

      worker.onmessage = (
        event: MessageEvent<{ type: string; result?: R; error?: string }>
      ) => {
        const { type, result, error } = event.data;
        if (type === 'success') {
          setResult(result ?? null);
          setStatus('success');
        } else if (type === 'error') {
          setError(new Error(error ?? 'Unknown worker error'));
          setStatus('error');
        }
        URL.revokeObjectURL(workerUrl);
      };

      worker.onerror = (event) => {
        setError(new Error(event.message));
        setStatus('error');
        URL.revokeObjectURL(workerUrl);
      };

      worker.postMessage(args);
    },
    [workerFn]
  );

  const kill = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setStatus('idle');
      setError(null);
      setResult(null);
    }
  }, []);

  useEffect(() => {
    return () => {
      kill();
    };
  }, [kill]);

  return { execute, result, error, status, kill };
};
