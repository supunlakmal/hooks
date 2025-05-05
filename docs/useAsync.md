# `useAsync` Hook

A hook to simplify handling asynchronous operations (like API calls) in React components. It manages loading, error, and success states, and provides a function to manually trigger the operation.

## Usage

### Basic Usage (Immediate Execution)

```typescript
import React from "react";
import { useAsync } from "@supunlakmal/hooks"; // Adjust the import path as needed

interface UserData {
  id: number;
  name: string;
  email: string;
}

// Example async function (e.g., fetching data)
const fetchUserData = async (userId: number): Promise<UserData> => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

function UserProfile({ userId }: { userId: number }) {
  // Pass the async function (wrapped if it needs arguments)
  const {
    loading,
    error,
    value: userData,
  } = useAsync<UserData>(() => fetchUserData(userId));
  // By default, useAsync executes the function immediately

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>Error fetching user data: {error.message}</div>;
  if (!userData) return <div>No user data found.</div>; // Should not happen if loading/error are false, but good practice

  return (
    <div>
      <h1>{userData.name}</h1>
      <p>Email: {userData.email}</p>
    </div>
  );
}

export default UserProfile;
```

### Manual Execution

Set the second argument `immediate` to `false` to prevent execution on mount. Use the returned `execute` function to trigger the async operation when needed (e.g., on button click).

```typescript
import React from "react";
import { useAsync } from "@supunlakmal/hooks"; // Adjust the import path as needed

const simulateSlowTask = (): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Task completed successfully!");
    }, 2000); // Simulate a 2-second task
  });
};

function ManualAsyncTask() {
  const { loading, error, value, execute } = useAsync<string>(
    simulateSlowTask,
    false
  ); // Set immediate to false

  return (
    <div>
      <h1>Manual Async Task</h1>
      <button onClick={execute} disabled={loading}>
        {loading ? "Running Task..." : "Start Task"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
      {value && <p style={{ color: "green" }}>Result: {value}</p>}
    </div>
  );
}

export default ManualAsyncTask;
```

## API

### Parameters

- `asyncFunction`: The asynchronous function (`() => Promise<T>`) to be managed. This function should return a `Promise` that resolves with the desired value (`T`) or rejects with an error (`E`). If your function needs arguments, wrap it in an anonymous function (e.g., `() => myAsyncFunc(arg1, arg2)`).
- `immediate`: (Optional) A boolean (`boolean`) indicating whether the `asyncFunction` should be executed immediately when the hook mounts. Defaults to `true`.

### Returns

An object (`UseAsyncReturn<T, E>`) containing:

- `loading`: A boolean (`boolean`) indicating if the async function is currently executing. `true` while the promise is pending, `false` otherwise.
- `error`: The error object (`E` or `null`) if the promise rejected, `null` otherwise.
- `value`: The resolved value (`T` or `null`) if the promise resolved successfully, `null` otherwise.
- `execute`: A function (`() => Promise<void>`) that can be called to manually trigger the execution of the `asyncFunction`. Calling this resets the state (`loading: true`, `error: null`, `value: null`) before invoking the function again.

## How it Works

1.  **State Management**: Uses `useState` to manage an `AsyncState` object containing `loading`, `error`, and `value`.
2.  **Execute Function**: Defines an `execute` function using `useCallback`. This function is responsible for:
    - Setting the initial loading state (`loading: true`, resetting `error` and `value`).
    - Calling the provided `asyncFunction` within a `try...catch` block.
    - On successful resolution, updating the state with `loading: false`, the resolved `value`, and `error: null`.
    - On rejection, updating the state with `loading: false`, the caught `error`, and `value: null`.
3.  **Immediate Execution**: Uses `useEffect` to call the `execute` function when the component mounts if the `immediate` parameter is `true` (the default).
4.  **Memoization**: `execute` is memoized with `useCallback`, depending only on `asyncFunction`. The `useEffect` for immediate execution depends on `immediate`.
5.  **Return Value**: Returns the current state (`loading`, `error`, `value`) spread into an object, along with the memoized `execute` function.
