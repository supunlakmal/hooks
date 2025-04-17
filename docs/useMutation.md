# `useMutation`

A hook designed to simplify handling asynchronous operations that modify data (like API POST, PUT, DELETE requests). It manages loading, success, and error states automatically and provides callbacks for side effects.

## Usage

Provide an asynchronous function (`mutationFn`) that performs the operation. Call the returned `mutate` or `mutateAsync` function to trigger it.

```tsx
import React, { useState } from "react";
import { useMutation } from "your-hooks-library"; // Adjust import path

interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

interface ApiError {
  message: string;
  status?: number;
}

// Define the actual API call function
const createPost = async (newPost: Post): Promise<Post> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  if (!response.ok) {
    // Simulate a more structured error
    const error: ApiError = {
      message: `Failed to create post: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }
  return response.json(); // Returns the created post with an ID
};

const PostCreator: React.FC = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {
    mutate,
    mutateAsync,
    status,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    reset,
  } = useMutation<Post, ApiError, Omit<Post, "id">>(createPost, {
    onMutate: (variables) => {
      console.log("Mutation started with:", variables);
      // Optionally return context for optimistic updates rollback
    },
    onSuccess: (createdPost, variables) => {
      console.log("Post created successfully:", createdPost);
      alert(`Success! Post created with ID: ${createdPost.id}`);
      // Invalidate queries, update cache, show notification, etc.
      setTitle("");
      setBody("");
    },
    onError: (err, variables) => {
      console.error("Mutation failed:", err);
      alert(`Error: ${err.message} (Status: ${err.status || "N/A"})`);
      // Log error, show error message
    },
    onSettled: (data, error, variables) => {
      console.log("Mutation settled (finished)", { data, error });
      // Runs after onSuccess or onError
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newPostData = { title, body, userId: 1 };

    // Option 1: Fire-and-forget style (handles loading/error state via hook)
    // mutate(newPostData);

    // Option 2: Using async/await for more control after mutation
    try {
      const result = await mutateAsync(newPostData);
      console.log("Mutation finished in submit handler with result:", result);
      // Perform actions *after* successful async mutation completes
    } catch (err) {
      console.error("Caught mutation error in submit handler:", err);
      // Handle error specifically in the submit handler if needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Post</h2>

      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Post"}
      </button>
      <button
        type="button"
        onClick={reset}
        disabled={isLoading || status === "idle"}
      >
        Reset Mutation State
      </button>

      {isSuccess && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Success! Last created post ID: {data?.id}
        </div>
      )}
      {isError && (
        <div style={{ color: "red", marginTop: "10px" }}>
          Error creating post: {error?.message}
        </div>
      )}
      <p>Status: {status}</p>
    </form>
  );
};

export default PostCreator;
```

## API

### `useMutation<TData, TError, TVariables>(mutationFn: (variables: TVariables) => Promise<TData>, options?: UseMutationOptions<TData, TError, TVariables>): UseMutationResult<TData, TError, TVariables>`

#### Generics

- `TData` (defaults to `any`): The type of the data returned by the `mutationFn` upon successful completion.
- `TError` (defaults to `Error`): The type of the error object expected if the `mutationFn` throws or rejects.
- `TVariables` (defaults to `void`): The type of the argument (variables) passed to the `mutationFn`. If the mutation function takes no arguments, use `void`.

#### Parameters

- `mutationFn` (`(variables: TVariables) => Promise<TData>`, required): The asynchronous function that performs the mutation. It receives variables (if defined) and must return a Promise that resolves with `TData` or rejects with `TError`.
- `options` (`UseMutationOptions<TData, TError, TVariables>`, optional): An object containing callback functions to handle different stages of the mutation lifecycle:
  - `onSuccess` (`(data: TData, variables: TVariables) => void`, optional): Called if the mutation function successfully resolves. Receives the data and the variables passed to `mutate`.
  - `onError` (`(error: TError, variables: TVariables) => void`, optional): Called if the mutation function throws or rejects. Receives the error and the variables.
  - `onMutate` (`(variables: TVariables) => void`, optional): Called _before_ the `mutationFn` is executed. Useful for optimistic updates. Receives the variables.
  - `onSettled` (`(data: TData | undefined, error: TError | undefined, variables: TVariables) => void`, optional): Called when the mutation finishes, regardless of success or error. Receives the data (or `undefined`), the error (or `undefined`), and the variables.

#### Returns (`UseMutationResult<TData, TError, TVariables>` object)

- `status` (`MutationStatus`): The current state: `'idle'`, `'loading'`, `'success'`, or `'error'`.
- `data` (`TData | undefined`): The data returned from the last successful mutation.
- `error` (`TError | undefined`): The error object from the last failed mutation.
- `isLoading` (boolean): True if `status` is `'loading'`.
- `isSuccess` (boolean): True if `status` is `'success'`.
- `isError` (boolean): True if `status` is `'error'`.
- `isIdle` (boolean): True if `status` is `'idle'`.
- `mutate` (`(variables: TVariables) => Promise<TData | undefined>`): A function to trigger the mutation. It returns a Promise that resolves with the data on success or `undefined` on error. It _catches_ errors internally to prevent unhandled rejections but updates the `error` state.
- `mutateAsync` (`(variables: TVariables) => Promise<TData>`): An alternative function to trigger the mutation. It returns a Promise that resolves with the data on success or _rejects_ with the error on failure. Use this if you need to `await` the mutation and handle errors with `try/catch` in the calling code.
- `reset` (`() => void`): A function to reset the mutation state (`status`, `data`, `error`) back to the initial `'idle'` state.
