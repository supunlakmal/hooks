"use client";

import { useState, useEffect } from 'react';
import { useCachedFetch } from '@/hooks/useCachedFetch';

const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/todos/';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const UseCachedFetchPage = () => {
  const [todoId, setTodoId] = useState(1);
  // Replaced isFetching with isLoading, removed lastResponseTime
  const { data, error, isLoading, refetch } = useCachedFetch<Todo>(`${API_ENDPOINT}${todoId}`);

  const fetchNextTodo = () => {
    setTodoId(prevId => prevId + 1);
  };

  const fetchPreviousTodo = () => {
    setTodoId(prevId => (prevId > 1 ? prevId - 1 : 1));
  };
  
  // Effect to log cache status (simplified)
  useEffect(() => {
    if (data) {
      console.log(`Data for todoId ${todoId} loaded.`);
      // Further cache indication would require inspecting network tab or more complex logic
    }
  }, [data, todoId]);


  return (
    <div style={{ padding: '20px' }}>
      <h1>useCachedFetch Hook Example</h1>
      <p>This page demonstrates the useCachedFetch hook for fetching and caching API data.</p>
      <p>It fetches todo items from JSONPlaceholder. Fetched items are cached.</p>
      <p>Open your browser&apos;s console and network tab to observe caching behavior.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button onClick={fetchPreviousTodo} disabled={todoId <= 1 || isLoading} style={{ marginRight: '10px' }}>
          Previous Todo
        </button>
        <button onClick={fetchNextTodo} disabled={isLoading} style={{ marginRight: '10px' }}>
          Next Todo
        </button>
        <button onClick={() => refetch({ ignoreCache: true })} disabled={isLoading} style={{ marginRight: '10px' }}>
          Refetch (Ignore Cache)
        </button>
        <span>Current Todo ID: {todoId}</span>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      
      {data && !error && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>Todo Details (ID: {data.id})</h2>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>User ID:</strong> {data.userId}</p>
          <p><strong>Completed:</strong> {data.completed ? 'Yes' : 'No'}</p>
          {/* lastResponseTime removed */}
        </div>
      )}
       <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'grey' }}>
        Try fetching a few todos, then go back and forth. Check your browser&apos;s network tab to see if requests for already fetched Todo IDs are made again or served from cache. Use the &quot;Refetch (Ignore Cache)&quot; button to force a network request.
      </p>
    </div>
  );
};

export default UseCachedFetchPage;
