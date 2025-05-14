<!-- docs/usePost.md -->

# `usePost`

This hook is a specialized version of `useFetch` for making POST requests. It provides a convenient way to send data to a given URL using the HTTP POST method.

## Usage

```typescript
import { usePost } from './usePost';
import { useState } from 'react';

interface NewUser {
  name: string;
}

interface CreatedUser {
  id: number;
  name: string;
}

const CreateUserComponent = () => {
  const [userName, setUserName] = useState('');
  const { data, loading, error, refetch } = usePost<CreatedUser>('/api/users', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: userName }),
  });

  const handleSubmit = () => {
    refetch(); // Trigger the POST request
  };

  return (
    <>
      <h1>Create User</h1>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter user name"
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>

      {data && <p>Created user with ID: {data.id}</p>}
      {error && <p>Error: {error.message}</p>}
    </>
  );
};
```

## Parameters

- `url`: The URL to send data to. Can be `string`, `null`, or `undefined`. If `null` or `undefined`, the fetch request will not be made.
- `options`: Optional. An object extending `RequestInit` (excluding `method`). You should provide the `body` and `headers` (e.g., `'Content-Type': 'application/json'`) in the options.

## Return Value

The hook returns an object with the following properties:

- `data`: The data returned from the POST request, or `null` if loading or an error occurred. The type is `T`, which is inferred from the generic parameter.
- `loading`: A boolean indicating whether the request is currently in progress.
- `error`: An `Error` object if the request failed, or `null` otherwise.
- `refetch`: A function to manually trigger the POST request.

This hook is built on top of the `useFetch` hook and inherits its core functionality and state management.
