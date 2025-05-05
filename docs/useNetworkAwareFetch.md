# useNetworkAwareFetch

A custom React hook that intelligently performs data fetching using `useFetch` only when the user's browser is detected as being online, leveraging `useNetworkState`. If the user goes offline, any ongoing or potential fetch is effectively paused or prevented. When the user comes back online, the fetch is initiated (or re-initiated if the target URL changed while offline).

## Usage

```jsx
import { useNetworkAwareFetch } from '@supunlakmal/hooks'; // Adjust import path
import { useNetworkState } from './useNetworkState'; // Import useNetworkState to display status

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function OnlinePostsList() {
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
  const { online } = useNetworkState(); // Get live network status for display

  // Fetch data only when online
  const { data, loading, error } = useNetworkAwareFetch<Post>(apiUrl, {
    // Optional fetch options here
  });

  return (
    <div>
      <h1>Network Aware Posts</h1>
      <p>Current Network Status: {online ? 'Online' : 'Offline'}</p>

      {loading && <p>Loading post data (requires online connection)...</p>}

      {error && <p>Error fetching post: {error.message} (Check connection?)</p>}

      {data && !loading && (
        <div>
          <h2>Post Details (Loaded when Online)</h2>
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </div>
      )}

      {!online && !loading && !error && (
         <p>You are currently offline. Data fetching is paused.</p>
      )}
    </div>
  );
}

export default OnlinePostsList;
```

## Parameters

- **`targetUrl`**: `string` (Required)
  - The URL from which to fetch data. The fetch will only proceed if the user is online.
- **`options`**: `UseNetworkAwareFetchOptions` (Optional)
  - Standard `RequestInit` options to pass to the underlying `fetch` call (e.g., `method`, `headers`, `body`). This interface currently just extends `RequestInit`.

## Return Value

- **`FetchState<T>`**: An object representing the state of the fetch operation, directly returned from the underlying `useFetch` hook. It contains:
  - **`data`**: `T | null` - The fetched data. `null` initially, when offline, or if an error occurs.
  - **`error`**: `Error | null` - Any error object encountered during the fetch. `null` otherwise.
  - **`loading`**: `boolean` - `true` if the fetch is currently active (which requires being online), `false` otherwise.

## Notes

- This hook monitors the network status using `useNetworkState`.
- The underlying `useFetch` hook is only provided with the `targetUrl` when the `online` status is `true`. When `online` is `false`, `null` is passed to `useFetch`, preventing it from fetching or potentially cancelling an ongoing request depending on `useFetch`'s implementation details.
- If the `targetUrl` changes while the user is offline, the fetch for the new URL will be initiated automatically when the user comes back online.
