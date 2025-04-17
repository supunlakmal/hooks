# `useCachedFetch`

A hook similar to `useFetch` but with an added layer of simple in-memory caching to prevent redundant network requests for the same data within a specified time-to-live (TTL).

## Usage

Use it like `useFetch`, providing a URL and optional configuration. The hook automatically checks the cache before making a network request.

```tsx
import React, { useState } from "react";
import { useCachedFetch } from "your-hooks-library"; // Adjust import path

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// Component to display user data
const UserDisplay: React.FC<{ userId: number }> = ({ userId }) => {
  const { data, error, isLoading, status, refetch } = useCachedFetch<User>(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    {
      ttl: 60 * 1000, // Cache for 1 minute
      // fetchOptions: { headers: { ... } } // Optional fetch headers etc.
    }
  );

  console.log(`User ${userId} - Status: ${status}`);

  if (isLoading) return <p>Loading user {userId}...</p>;
  if (error)
    return (
      <p style={{ color: "red" }}>
        Error fetching user {userId}: {error.message}
      </p>
    );
  if (!data) return <p>No data for user {userId}.</p>;

  return (
    <div
      style={{ border: "1px solid lightgray", margin: "10px", padding: "10px" }}
    >
      <h4>
        {data.name} (@{data.username})
      </h4>
      <p>Email: {data.email}</p>
      <p>Status: {status}</p>
      <button onClick={() => refetch()}>Refetch User {userId}</button>
      <button onClick={() => refetch({ ignoreCache: true })}>
        Refetch User {userId} (Bypass Cache)
      </button>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number>(1);
  const [showUser, setShowUser] = useState<boolean>(true);

  return (
    <div>
      <h2>Cached Fetch Demo</h2>
      <p>
        Select a user ID. Data is cached for 1 minute. Check network tab and
        console logs.
      </p>
      <div>
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            onClick={() => setSelectedUserId(id)}
            style={{ fontWeight: selectedUserId === id ? "bold" : "normal" }}
          >
            User {id}
          </button>
        ))}
        <button
          onClick={() => setShowUser((s) => !s)}
          style={{ marginLeft: "20px" }}
        >
          {showUser ? "Hide User" : "Show User"}
        </button>
      </div>

      {showUser && <UserDisplay userId={selectedUserId} />}

      {/* Render another instance for the same user to demonstrate cache sharing */}
      {/* {showUser && selectedUserId === 1 && (
           <div>
               <p>--- Another instance requesting User 1 ---</p>
              <UserDisplay userId={1} /> 
           </div>
       )} */}
    </div>
  );
};

export default App;
```

## API

### `useCachedFetch<T = any>(url: string | undefined | null, options?: UseCachedFetchOptions): UseCachedFetchResult<T>`

#### Generics

- `T` (defaults to `any`): The expected type of the data returned by the successful fetch request.

#### Parameters

- `url` (string | undefined | null, required): The URL to fetch. If `undefined` or `null`, the hook remains in an idle state.
- `options` (`UseCachedFetchOptions`, optional): An object for configuration:
  - `ttl` (number, optional): Time-to-live for cache entries in milliseconds. How long a cached response is considered fresh. Defaults to `300000` (5 minutes).
  - `fetchOptions` (`RequestInit`, optional): Standard options passed directly to the underlying `fetch` call (e.g., `method`, `headers`, `body`).
  - `getCacheKey` (`(url: string, options?: RequestInit) => string`, optional): A function to generate a unique key for caching based on the URL and fetch options. Defaults to using only the `url` as the key.
  - `cacheOnlyIfFresh` (boolean, optional): If `true`, the hook will _only_ use cached data if it's within the TTL. If `false` (default), it will return stale cached data immediately while re-fetching in the background if the TTL has expired.

#### Returns (`UseCachedFetchResult<T>` object)

- `data` (`T | undefined`): The fetched data. `undefined` initially, during loading, or on error.
- `error` (`Error | undefined`): An Error object if the fetch failed, `undefined` otherwise.
- `status` (`FetchStatus`): The current fetch state: `'idle'`, `'loading'`, `'success'`, or `'error'`.
- `isLoading` (boolean): True if `status` is `'loading'`.
- `isSuccess` (boolean): True if `status` is `'success'`.
- `isError` (boolean): True if `status` is `'error'`.
- `isIdle` (boolean): True if `status` is `'idle'`.
- `refetch` (`(options?: { ignoreCache?: boolean }) => Promise<void>`): A function to manually trigger the fetch again. Optionally takes an object `{ ignoreCache: true }` to bypass the cache check and force a network request.

## How it Works

1.  **Cache Storage**: Uses a simple `Map` object (defined outside the hook, acting as a global singleton cache) to store responses keyed by a cache key.
2.  **Cache Key**: By default, uses the URL as the cache key. A custom `getCacheKey` function can be provided for more complex scenarios (e.g., including specific headers or params in the key).
3.  **Initial State**: When the hook mounts or the `url`/`cacheKey` changes, it first checks the cache.
    - If a fresh (within TTL) entry exists for the key, it initializes the `data` state with the cached data and sets `status` to `'success'`.
    - If `cacheOnlyIfFresh` is `false` (default) and an expired entry exists, it still initializes `data` with the stale data but proceeds to fetch in the background.
    - If no entry exists or it's expired (and `cacheOnlyIfFresh` is true), it initializes `data` as `undefined`.
4.  **Fetching**: If no suitable cache entry is found (or cache is bypassed via `refetch({ ignoreCache: true })`):
    - Sets `status` to `'loading'`.
    - Calls the native `fetch` API with the provided `url` and `fetchOptions`.
    - On success: Parses the JSON response, updates `data` and `status`, clears any previous `error`, and stores the result in the cache with a timestamp.
    - On failure (network error or non-ok HTTP status): Sets `status` to `'error'`, populates the `error` state, and potentially keeps stale `data` if available.
5.  **State Updates**: Ensures state updates only happen if the component is still mounted.
6.  **`refetch`**: Provides a function to manually re-initiate the fetch logic, allowing cache bypass.

## Notes

- The cache is a simple in-memory `Map`. It will be cleared if the JavaScript environment restarts (e.g., page refresh).
- This implementation uses a global cache shared between all instances of the hook. For more isolated caching or integration with browser storage (like `localStorage`), modifications would be needed.
- Error handling assumes JSON responses for errors; adjust if your API returns errors differently.
- Consider cache invalidation strategies for data that changes frequently.
