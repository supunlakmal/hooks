# useDefault

A simple React hook that returns a default value if the provided value is `null` or `undefined`.

## Usage

```tsx
import { useState } from 'react';
import { useDefault } from './hooks/useDefault'; // Adjust import path

function DefaultValueComponent({
  initialUsername,
}: {
  initialUsername?: string | null;
}) {
  const [username, setUsername] = useState<string | null | undefined>(
    initialUsername
  );

  // If username is null or undefined, userOrDefault will be 'Guest'
  const userOrDefault = useDefault(username, 'Guest');

  return (
    <div>
      <p>Welcome, {userOrDefault}!</p>
      <button onClick={() => setUsername(null)}>Set to Null</button>
      <button onClick={() => setUsername(undefined)}>Set to Undefined</button>
      <button onClick={() => setUsername('Alice')}>Set to Alice</button>
    </div>
  );
}
```

## API

`useDefault<T>(value: T | null | undefined, defaultValue: T): T`

### Parameters

- `value`: The value to check. Can be of any type `T`, `null`, or `undefined`.
- `defaultValue`: The value of type `T` to return if `value` is `null` or `undefined`.

### Return Value

- Returns `value` if it is not `null` and not `undefined`.
- Returns `defaultValue` otherwise.

### Dependencies

- The hook uses `useMemo` and will re-evaluate only if `value` or `defaultValue` changes reference.
