# usePromise

This hook provides a way to manage the state of a Promise, making it easier to handle asynchronous operations. It tracks the loading state, any errors that occur, and the resulting data. Unlike `useAsync`, which is designed to manage the execution of a specific asynchronous function, `usePromise` is more general-purpose and can handle any Promise, regardless of how it was created.

## API

### Parameters

*   `promiseFn`: `() => Promise<T>` - A function that returns a Promise. This function will be executed when the hook initializes and when `reload` is called.

### Return Value

*   `data`: `T | null` - The data resolved by the Promise. Initially `null`, it will be updated when the Promise is fulfilled.
*   `error`: `any | null` - If the Promise is rejected, this will contain the error object. Otherwise, it's `null`.
*   `loading`: `boolean` - A boolean indicating whether the Promise is currently pending (true) or has been resolved/rejected (false).
*   `reload`: `() => void` - A function to re-execute the `promiseFn`. This is useful for refetching data or retrying the Promise.

## Examples
```
tsx
import { usePromise } from 'src';

function PromiseExample() {
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulating an API call
        const success = Math.random() > 0.5;
        if (success) {
          resolve('Data fetched successfully!');
        } else {
          reject('Failed to fetch data.');
        }
      }, 1000);
    });
  };

  const { data, error, loading, reload } = usePromise<string>(fetchData);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Data: {data}</p>}
      <button onClick={reload}>Reload</button>
    </div>
  );
}
```
## How it Works

1.  **Promise Management:** `usePromise` takes a function (`promiseFn`) that returns a Promise.
2.  **State Tracking:** It uses `useState` to manage the `data`, `error`, and `loading` states.
3.  **Initial Execution:** When the hook initializes, it immediately calls `promiseFn` and starts tracking the Promise's state.
4.  **`reload` Function:** It provides a `reload` function that you can call to re-execute `promiseFn` and restart the process, effectively refetching the data or retrying the Promise.
5. **Difference with `useAsync`**: `useAsync` is specialized for executing and managing *asynchronous functions*. `usePromise` is more general for managing the state of any *Promise*. `useAsync` have `execute` function, but `usePromise` have `reload` instead. `useAsync` have `immediate` parameter, but `usePromise` doesn't have this parameter.