"use client";

import { useState } from 'react'; // Added useState here
import { useAsyncAbortable } from '@/hooks/useAsyncAbortable';

// Simulate an API call that takes time and can be aborted
const fakeAbortableApiCall = (signal: AbortSignal): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve("Data fetched successfully after 3 seconds!");
    }, 3000);

    signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};

const UseAsyncAbortablePage = () => {
  const [state, actions, meta] = useAsyncAbortable<string>(fakeAbortableApiCall, undefined);
  const { loading, value, error } = state;
  const { execute, abort } = actions;

  // Determine if the last operation was aborted
  // This is a bit tricky because the hook resets value/error on AbortError.
  // We'll infer it if not loading, no value, no error, but the abort signal was triggered.
  // A more robust way might involve the hook setting a specific 'aborted' flag in its state.
  const [wasAborted, setWasAborted] = useState(false);

  const handleExecute = async () => {
    setWasAborted(false);
    await execute();
  }

  const handleAbort = () => {
    abort();
    // Check if the controller exists and was indeed aborted by our call.
    // The hook itself will handle the error and reset state.
    // We set a flag here to display a specific "Aborted by user" message.
    if (meta.abortControllerRef.current?.signal.aborted) {
      setWasAborted(true);
    } else {
        // Fallback check, sometimes the signal might not immediately reflect `aborted`
        // if the promise resolved very quickly or was already completed.
        // This relies on the fact that `error` becomes null and `value` becomes undefined on abort.
        // This is a heuristic.
        setTimeout(() => {
            if (meta.abortControllerRef.current?.signal.aborted && !loading && !value && !error) {
                 setWasAborted(true);
            }
        }, 0);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>useAsyncAbortable Hook Example</h1>
      <p>This page demonstrates the useAsyncAbortable hook to handle abortable asynchronous operations.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Abortable Async Operation</h2>
        <button onClick={handleExecute} disabled={loading} style={{ marginRight: '10px' }}>
          {loading ? 'Loading...' : 'Fetch Data (3s delay)'}
        </button>
        <button onClick={handleAbort} disabled={!loading} style={{ marginRight: '10px' }}>
          Abort Fetch
        </button>
        {!loading && !value && !error && !wasAborted && <p>Click &quot;Fetch Data&quot; to start. You can abort it before it completes.</p>}
        {loading && <p style={{ color: 'orange' }}>Fetching data... Click &quot;Abort Fetch&quot; to cancel.</p>}
        {value && <p style={{ color: 'green' }}>Success: {value}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error?.message}</p>}
        {wasAborted && !loading && !value && !error && <p style={{ color: 'grey' }}>Operation Aborted by user.</p>}
      </div>
    </div>
  );
};

export default UseAsyncAbortablePage;
