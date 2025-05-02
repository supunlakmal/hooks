import { useCallback, useEffect, useRef, useState } from 'react';

interface WorkerState<T> {
  result: T | null;
  error: Error | null;
  isLoading: boolean;
}

type WorkerFunction<T, A extends any[]> = (...args: A) => T;

export function useWebWorker<T, A extends any[]>(workerFunction: WorkerFunction<T, A>) {
  const [workerState, setWorkerState] = useState<WorkerState<T>>({
    result: null,
    error: null,
    isLoading: false,
  });
  const workerRef = useRef<Worker | null>(null);
  const workerFunctionRef = useRef(workerFunction);

  useEffect(() => {
    workerFunctionRef.current = workerFunction;
  }, [workerFunction]);

  const executeWorker = useCallback((...args: A) => {
    setWorkerState((prev) => ({ ...prev, isLoading: true, error: null }));

    const workerCode = `
      onmessage = (event) => {
        try {
          const workerFunction = (${workerFunctionRef.current.toString()});
          const result = workerFunction(...event.data);
          postMessage({ type: 'success', result });
        } catch (error) {
          postMessage({ type: 'error', error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);

    workerRef.current.onmessage = (event: MessageEvent<{ type: 'success' | 'error'; result?: T; error?: string }>) => {
      if (event.data.type === 'success') {
        setWorkerState({ result: event.data.result!, error: null, isLoading: false });
      } else if (event.data.type === 'error') {
        setWorkerState({ result: null, error: new Error(event.data.error), isLoading: false });
      }
      
      URL.revokeObjectURL(url);
      workerRef.current?.terminate();
    };

    workerRef.current.onerror = (error) => {
        setWorkerState({ result: null, error: new Error(error.message), isLoading: false });
        URL.revokeObjectURL(url);
        workerRef.current?.terminate();
    };

    workerRef.current.postMessage(args);
  }, []);

  const terminateWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setWorkerState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    return () => {
      terminateWorker();
    };
  }, [terminateWorker]);

  return {
    ...workerState,
    executeWorker,
    terminateWorker,
  };
}

