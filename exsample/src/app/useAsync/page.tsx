"use client";

import { useAsync } from '@/hooks/useAsync';

// Simulate an API call
const fakeApiCall = (shouldSucceed: boolean): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve("Data fetched successfully!");
      } else {
        reject(new Error("Failed to fetch data."));
      }
    }, 1500);
  });
};

const UseAsyncPage = () => {
  const { execute, loading, value, error } = useAsync<string>(() => fakeApiCall(true), false);
  const { execute: executeError, loading: errorLoading, value: errorValue, error: errorError } = useAsync<string>(() => fakeApiCall(false), false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>useAsync Hook Example</h1>
      <p>This page demonstrates the useAsync hook to handle asynchronous operations like API calls.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Successful Async Operation</h2>
        <button onClick={() => execute()} disabled={loading} style={{ marginRight: '10px' }}>
          {loading ? 'Loading...' : 'Fetch Data (Success)'}
        </button>
        {!loading && !value && !error && <p>Click the button to fetch data.</p>}
        {value && <p style={{ color: 'green' }}>Success: {value}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error?.message}</p>}
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Failing Async Operation</h2>
        <button onClick={() => executeError()} disabled={errorLoading} style={{ marginRight: '10px' }}>
          {errorLoading ? 'Loading...' : 'Fetch Data (Error)'}
        </button>
        {!errorLoading && !errorValue && !errorError && <p>Click the button to fetch data that will fail.</p>}
        {errorValue && <p style={{ color: 'green' }}>Success: {errorValue}</p>}
        {errorError && <p style={{ color: 'red' }}>Error: {errorError?.message}</p>}
      </div>
    </div>
  );
};

export default UseAsyncPage;
