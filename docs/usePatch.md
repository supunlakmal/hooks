<!-- docs/usePatch.md -->

# `usePatch`

This hook is a specialized version of `useFetch` for making PATCH requests. It provides a convenient way to partially update a resource at a given URL using the HTTP PATCH method.

## Usage

```typescript
import { usePatch } from './usePatch';
import { useState } from 'react';

interface User {
  id: number;
  name?: string;
  email?: string;
}

const UpdateUserComponent = ({ userId }: { userId: string }) => {
  const [userName, setUserName] = useState('');
  const { data, loading, error, refetch } = usePatch<User>(`/api/users/${userId}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: userName }),
  });

  const handleUpdate = () => {
    refetch(); // Trigger the PATCH request
  };

  return (
    <>
      <h2>Update User {userId}</h2>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="New user name"
      />
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update User'}
      </button>

      {data && <p>User {userId} updated successfully.</p>}
      {error && <p>Error updating user: {error.message}</p>}
    </>
  );
};
```

## Parameters

- `url`: The URL of the resource to partially update. Can be `string`, `null`, or `undefined`. If `null` or `undefined`, the fetch request will not be made.
- `options`: Optional. An object extending `RequestInit` (excluding `method`). You should provide the `body` with the partial update data and `headers` (e.g., `'Content-Type': 'application/json'`) in the options.

## Return Value

The hook returns an object with the following properties:

- `data`: The data returned from the PATCH request (often the updated resource), or `null` if loading or an error occurred. The type is `T`, which is inferred from the generic parameter.
- `loading`: A boolean indicating whether the request is currently in progress.
- `error`: An `Error` object if the request failed, or `null` otherwise.
- `refetch`: A function to manually trigger the PATCH request.

This hook is built on top of the `useFetch` hook and inherits its core functionality and state management.
