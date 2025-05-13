<!-- docs/useGet.md -->

# `useGet`

This hook is a specialized version of `useFetch` for making GET requests. It provides a convenient way to fetch data from a given URL using the HTTP GET method.

## Usage

```typescript
import { useGet } from './useGet';

interface User {
  id: number;
  name: string;
}

const MyComponent = () => {
  const { data, loading, error } = useGet<User[]>('/api/users');

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Users</h1>
      <ul>
        {data?.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
};
```

## Parameters

- `url`: The URL to fetch data from. Can be `string`, `null`, or `undefined`. If `null` or `undefined`, the fetch request will not be made.
- `options`: Optional. An object extending `RequestInit` (excluding `method` and `body`). You can provide headers, mode, credentials, etc.

## Return Value

The hook returns an object with the following properties:

- `data`: The fetched data, or `null` if loading or an error occurred. The type is `T`, which is inferred from the generic parameter.
- `loading`: A boolean indicating whether the request is currently in progress.
- `error`: An `Error` object if the request failed, or `null` otherwise.

This hook is built on top of the `useFetch` hook and inherits its core functionality and state management.
