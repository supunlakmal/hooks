"use client";

import { useBoolean } from '@/hooks/useBoolean';

const UseBooleanPage = () => {
  const [value, { toggle, setTrue, setFalse }] = useBoolean(false);

  return (
    <div style={{ padding: '20px' }}>
      <h1>useBoolean Hook Example</h1>
      <p>This page demonstrates the useBoolean hook for managing a boolean state.</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Boolean State Management</h2>
        <p><strong>Current Value:</strong> {value ? 'True' : 'False'}</p>
        <div style={{ marginTop: '10px' }}>
          <button onClick={toggle} style={{ marginRight: '10px' }}>
            Toggle
          </button>
          <button onClick={setTrue} style={{ marginRight: '10px' }} disabled={value}>
            Set to True
          </button>
          <button onClick={setFalse} disabled={!value}>
            Set to False
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseBooleanPage;
