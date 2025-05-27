"use client";

import { useState } from 'react'; // useEffect is not needed based on the snippet
import { useConditionalEffect } from '@/hooks/useConditionalEffect';

const UseConditionalEffectPage = () => {
  const [count, setCount] = useState(0);
  const [effectRunCount, setEffectRunCount] = useState(0);
  // Adding a message state for better UI feedback as in previous successful versions
  const [message, setMessage] = useState('Conditional effect has not run yet.'); 

  const condition = count > 3;

  useConditionalEffect(
    () => { // Callback function
      setEffectRunCount(prev => prev + 1);
      const newMsg = `Conditional effect ran! Current count is ${count}.`;
      setMessage(newMsg);
      console.log(newMsg); // Original console log from snippet
      
      return () => { // Cleanup function
        const cleanupMsg = `Conditional effect cleanup. Previous count was ${count}.`;
        setMessage(cleanupMsg);
        console.log(cleanupMsg);
      };
    },
    [count], // Dependencies for the effect callback (it uses `count` in its message)
    [condition]  // The array of conditions to check (effect runs if `condition` is true)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>useConditionalEffect Hook Example</h1>
      <p>
        This page demonstrates an effect that runs (and cleans up) only when 
        the specified condition (count &gt; 3) is met.
      </p>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Counter:</h3>
        <p>Count: {count}</p>
        <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #eee' }}>
        <h3>Condition Status:</h3>
        <p>Is count &gt; 3? : <strong>{condition ? 'Yes' : 'No'}</strong></p>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
        <h3>Conditional Effect Log:</h3>
        <p>Effect has run {effectRunCount} times.</p>
        <p>Message: {message}</p> 
      </div>
    </div>
  );
};

export default UseConditionalEffectPage;
