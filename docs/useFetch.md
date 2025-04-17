# `useFetch` Hook

A custom React hook for fetching data from an API endpoint. It simplifies data fetching logic by managing loading and error states internally.

## Usage

```typescript
import React from "react";
import { useFetch } from "@supunlakmal/hooks"; // Adjust the import path as needed

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function PostsComponent() {
  const { data, loading, error } = useFetch<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error fetching posts: {error.message}</div>;
  }

  if (!data) {
    return <div>No posts found.</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsComponent;
```

### Fetching with Options (e.g., POST request)

```typescript
import React, { useState, useEffect } from "react";
import { useFetch } from "@supunlakmal/hooks"; // Adjust the import path as needed

interface NewPost {
  title: string;
  body: string;
  userId: number;
}

interface CreatedPost extends NewPost {
  id: number;
}

function CreatePostComponent() {
  const [postData, setPostData] = useState<NewPost | null>(null);

  // Define fetch options
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  // Conditionally call useFetch only when postData is set
  const { data, loading, error } = useFetch<CreatedPost>(
    postData ? "https://jsonplaceholder.typicode.com/posts" : null, // URL is null initially
    fetchOptions
  );

  const handleCreatePost = () => {
    setPostData({
      title: "foo",
      body: "bar",
      userId: 1,
    });
  };

  return (
    <div>
      <button onClick={handleCreatePost} disabled={loading || !!postData}>
        Create Post
      </button>

      {loading && <div>Creating post...</div>}
      {error && <div>Error creating post: {error.message}</div>}
      {data && (
        <div>
          <h2>Post Created!</h2>
          <p>ID: {data.id}</p>
          <p>Title: {data.title}</p>
          <p>Body: {data.body}</p>
        </div>
      )}
    </div>
  );
}

export default CreatePostComponent;
```

## API

### Parameters

- `url`: The URL (`string`) to fetch data from. If the URL is `null` or `undefined`, the fetch request will not be initiated. This is useful for conditional fetching.
- `options`: (Optional) An object conforming to the standard `RequestInit` interface (like `method`, `headers`, `body`, etc.) to customize the fetch request. See [MDN Fetch API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options) for details.

### Returns

An object (`FetchState<T>`) containing:

- `data`: The fetched data of type `T` (or the type inferred by TypeScript). It's `null` initially, during loading, or if an error occurs.
- `loading`: A boolean (`boolean`) indicating whether the fetch request is currently in progress. `true` while fetching, `false` otherwise.
- `error`: An `Error` object if the fetch failed, otherwise `null`.

## How it Works

1.  **State Management**: Uses `useState` to manage the `data`, `loading`, and `error` states.
2.  **Options Handling**: Uses `useRef` to store the `options` object. This prevents the `useEffect` hook from re-running unnecessarily if the `options` object reference changes on every render (a common issue when objects are defined inline).
3.  **Effect for Fetching**: An `useEffect` hook runs when the `url` changes.
4.  **Conditional Fetch**: Inside the effect, it first checks if `url` is provided. If not, it resets the state and does nothing else.
5.  **Async Fetch Logic**: If a `url` exists, it defines an `async` function `fetchData`:
    - Sets `loading` to `true` and resets `data` and `error`.
    - Uses the native `fetch` API with the provided `url` and the current `options` from the ref.
    - Checks if `response.ok` is true. If not, it throws an error.
    - Parses the JSON response using `response.json()`.
    - Updates the state with the fetched `data`, sets `loading` to `false`, and `error` to `null`.
    - Includes a `catch` block to handle any errors during the fetch process (network errors, parsing errors, non-ok responses), updating the state with the `error` and setting `loading` to `false`.
6.  **Executing Fetch**: The `fetchData` function is called immediately within the effect.
7.  **Dependency Array**: The `useEffect` hook's dependency array only includes `url`. Changes in `options` are handled via the `useRef` and a separate small effect, optimizing re-fetches.
