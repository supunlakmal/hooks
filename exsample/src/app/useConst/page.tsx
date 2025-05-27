"use client";

import { useState } from 'react';
import { useConst } from '@/hooks/useConst';

// Simulate a function that might be expensive or should only run once
const initializeComplexObject = () => {
  console.log('Initializing complex object...');
  return {
    id: Math.random(),
    createdAt: new Date(),
    someData: Array.from({ length: 5 }, (_, i) => Math.random() * (i + 1) * 100),
  };
};

const UseConstPage = () => {
  const [renderCount, setRenderCount] = useState(0);

  // Using useConst to initialize the complex object
  // This ensures initializeComplexObject() is called only once.
  const constantValue = useConst(initializeComplexObject);

  // For comparison: a value initialized directly in the component body
  // This would be re-initialized on every render if not for useConst.
  // const nonConstantValue = initializeComplexObject(); 

  return (
    <div style={{ padding: '20px' }}>
      <h1>useConst Hook Example</h1>
      <p>This page demonstrates that a value initialized with `useConst` is created only once.</p>
      <p>Check the browser console for &quot;Initializing complex object...&quot; logs.</p>
      
      <button onClick={() => setRenderCount(c => c + 1)} style={{ marginTop: '20px' }}>
        Re-render Component (Render Count: {renderCount})
      </button>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Constant Value (from useConst):</h2>
        <p>ID: {constantValue.id}</p>
        <p>Created At: {constantValue.createdAt.toLocaleTimeString()}</p>
        <p>Some Data: {JSON.stringify(constantValue.someData)}</p>
      </div>
      
      <p style={{ marginTop: '10px', fontSize: '0.9em', color: 'gray' }}>
        No matter how many times you re-render the component, the &quot;Initializing complex object...&quot; message
        should appear in the console only once, and the &quot;Created At&quot; time should remain the same.
      </p>
    </div>
  );
};

export default UseConstPage;
