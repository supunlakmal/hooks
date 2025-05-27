"use client";

import { useState, useCallback } from 'react';
import { useAnimationFrame } from '@/hooks/useAnimationFrame';

const UseAnimationFramePage = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const animate = useCallback(() => {
    if (isRunning) {
      setCount(prevCount => prevCount + 1);
    }
  }, [isRunning]); // Add isRunning to dependency array

  useAnimationFrame(animate); // Call with only the callback

  return (
    <div style={{ padding: '20px' }}>
      <h1>useAnimationFrame Hook Example</h1>
      <p>This page demonstrates the useAnimationFrame hook to update a counter on each animation frame.</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setIsRunning(true)} disabled={isRunning} style={{ marginRight: '10px' }}>
          Start Animation
        </button>
        <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
          Stop Animation
        </button>
      </div>
      <p style={{ marginTop: '20px', fontSize: '2em' }}>Frame Count: {count}</p>
    </div>
  );
};

export default UseAnimationFramePage;
