# `useDebouncedFetch` Hook

## Description

`useDebouncedFetch` is a custom React hook that wraps the Fetch API and debounces the requests. This is useful for situations where you need to make API calls based on user input, but you don't want to flood the server with requests as the user types.

## Usage

```typescript
import React, { useState } from 'react';
import { useDebouncedFetch } from '@supunlakmal/hooks'; // Adjust the import path

interface SearchResult {
  // Define the structure of your API response data
  items: { id: number; name: string }[];
}

function DebouncedSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the fetch request based on searchTerm changing
  const { data, loading, error } = useDebouncedFetch<SearchResult>(
    `https://api.example.com/search?q=${searchTerm}`, // Replace with your actual API endpoint
    {
      debounceTimeout: 500, // Wait 500ms after typing stops before fetching
      // fetchOptions: { method: 'GET', headers: { ... } }
    }
  );

  return (
    <div>
      <h1>useDebouncedFetch Example</h1>
      <p>Enter a search term. The fetch request is debounced.</p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
        style={{ width: '300px', padding: '8px' }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      {data && data.items && data.items.length > 0 && (
        <div>
          <h2>Results:</h2>
          <ul>
            {data.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      )}
      {data && data.items && data.items.length === 0 && <p>No results found.</p>}

      <p style={{ marginTop: '20px', fontSize: '0.9em', color: 'gray' }}>
        Note: This example uses a placeholder API URL. Replace it with your actual search API.
      </p>
    </div>
  );
}

export default DebouncedSearch;
```

## API

### `useDebouncedFetch<T>(url: string | undefined | null, options?: UseDebouncedFetchOptions): UseDebouncedFetchResult<T>`

#### Generics

- `T` (defaults to `any`): The expected type of the JSON response data.

#### Parameters

- `url` (string | undefined | null, required): The URL to fetch. If `undefined` or `null`, the fetch is not performed.
- `options` (`UseDebouncedFetchOptions`, optional): An object for configuration:
  - `debounceTimeout` (number, optional): The time in milliseconds to wait after the `url` changes before initiating the fetch request. Defaults to `500`.
  - `fetchOptions` (`RequestInit`, optional): Standard options passed directly to the underlying `fetch` call (e.g., `method`, `headers`, `body`).
  - `skip` (boolean, optional): If `true`, the fetch request will be skipped. Defaults to `false`.

#### Returns (`UseDebouncedFetchResult<T>` object)

- `data` (`T | undefined`): The fetched data. `undefined` initially, during loading, or on error.
- `loading` (boolean): `true` while the debounced fetch request is in progress, `false` otherwise.
- `error` (`Error | undefined`): An Error object if the fetch failed, `undefined` otherwise.

## How it Works

The `useDebouncedFetch` hook combines debouncing logic (similar to `useDebounce`) with the functionality of a fetch hook. When the `url` or other dependencies change, instead of fetching immediately, it sets a timer. If the dependencies change again before the timer expires, the timer is reset. The actual fetch request is only initiated after the specified `debounceTimeout` has passed without any further changes to the dependencies. It uses internal state to track the loading status and store the fetched `data` or `error`.
