"use client";
import React from "react";
import useFetch from "../../../hooks/useFetch";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function FetchExample() {
  const { data, loading, error } = useFetch<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FetchExample;