# useIdleFetch

A custom React hook that initiates a data fetch request using `useFetch` only _after_ the user becomes active following a specified period of inactivity, as determined by `useIdleTimer`.

This can be useful for deferring non-critical data loading until the user actively engages with the application again after being idle, potentially saving resources.

## Usage

```jsx
import { useIdleFetch } from '@supunlakmal/hooks'; // Adjust import path

interface UserData {
  id: number;
  name: string;
  email: string;
}

function UserProfileDisplay() {
  const apiUrl = 'https://api.example.com/user/profile';

  // Fetch user profile only when user becomes active after being idle for 5 minutes (300,000 ms)
  const { data, loading, error } = useIdleFetch<UserData>(apiUrl, {
    idleTimeout: 300000, // 5 minutes
    fetchOptions: { // Optional: Add fetch options like headers if needed
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    }
  });

  if (loading && !data) {
    // Show loading state only if fetch has been triggered (i.e., user became active)
    return <p>Loading profile after user activity...</p>;
  }

  if (error) {
    return <p>Error fetching profile: {error.message}</p>;
  }

  if (!data) {
      // Initial state before user becomes active after idle
      return <p>User profile will load when you become active after 5 minutes of inactivity.</p>
  }

  // Data is loaded
  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {data.id}</p>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  );
}

export default UserProfileDisplay;
```

## Parameters

- **`targetUrl`**: `string` (Required)
  - The URL from which to fetch data when the user becomes active after being idle.
- **`options`**: `UseIdleFetchOptions` (Required)
  - An object containing configuration options:
    - **`idleTimeout`**: `number` (Required) - The duration in milliseconds of user inactivity required before the user is considered idle. The fetch will trigger when the user becomes active _after_ this period.
    - **`fetchOptions`**: `RequestInit` (Optional) - Standard options to pass to the underlying `fetch` call (e.g., `method`, `headers`, `body`, `credentials`).
    - **`idleDebounce`**: `number` (Optional) - A debounce time in milliseconds for the idle/active events, passed to the underlying `useIdleTimer`.

## Return Value

- **`FetchState<T>`**: An object representing the state of the fetch operation, directly returned from the underlying `useFetch` hook. It typically includes:
  - **`data`**: `T | null` - The fetched data once the request completes successfully. Initially `null`.
  - **`error`**: `Error | null` - Any error object encountered during the fetch. Initially `null`.
  - **`loading`**: `boolean` - A boolean indicating whether the fetch request is currently in progress. Becomes `true` when the fetch starts (after user becomes active) and `false` when it completes or errors out.

## Notes

- The fetch request is **not** initiated on component mount.
- The fetch request is triggered specifically when the `onActive` callback from the internal `useIdleTimer` fires (i.e., when the user transitions from idle to active).
- Based on the current implementation, the fetch occurs only the _first_ time the user becomes active after the initial idle period per component mount/URL change. If the user goes idle and becomes active again later, it won't refetch unless the `targetUrl` or `options` change, causing the hook to re-run its setup.
