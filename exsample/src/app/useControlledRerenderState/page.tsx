"use client";

import { useState, useEffect } from 'react';
import { useControlledRerenderState } from '@/hooks/useControlledRerenderState';

let actualStateRenderCount = 0;

const UseControlledRerenderStatePage = () => {
  // Standard useState for comparison (always re-renders on change)
  const [standardState, setStandardState] = useState(0);
  
  // useControlledRerenderState
  const [controlledState, setControlledState] = useControlledRerenderState(0);

  // To track component renders
  const [renderIndicator, setRenderIndicator] = useState(0);
  useEffect(() => {
    actualStateRenderCount++;
    console.log(`Component rendered. Count: ${actualStateRenderCount}`);
  }, [renderIndicator]); // This effect runs when renderIndicator changes

  const handleIncrementStandard = () => {
    setStandardState(s => s + 1);
    setRenderIndicator(r => r + 1); // Manually trigger render for this example's logging
  };

  const handleIncrementControlledRerender = () => {
    setControlledState(s => (s || 0) + 1, true); // Rerender explicitly
    // For this demo, we still need to trigger a visual update if we want to see the new value.
    // The hook itself would prevent re-render if the second param was false.
    // Here, we're demonstrating the *ability* to control it.
    // To truly see no re-render for the controlled state, you'd check console logs
    // and not call setRenderIndicator for the "no rerender" case.
    setRenderIndicator(r => r + 1); 
  };
  
  const handleIncrementControlledNoRerender = () => {
    const nextVal = (controlledState || 0) + 1;
    setControlledState(nextVal, false); // Update state, but DO NOT rerender
    console.log(`Controlled state updated internally to: ${nextVal}, but no re-render was triggered by this action.`);
    // Note: The UI below will not update for 'controlledState' until the next actual render.
    // To see the updated value in the UI, you'd need another action that *does* cause a render.
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>useControlledRerenderState Hook Example</h1>
      <p>Demonstrates state updates that may or may not cause a re-render.</p>
      <p>Component Render Count (logged in console and via indicator): {actualStateRenderCount}</p>
      <small>(Console logs provide more accurate render timing for the hook&apos;s behavior.)</small>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>Standard useState</h2>
        <p>Value: {standardState}</p>
        <button onClick={handleIncrementStandard}>Increment Standard State (Always Re-renders)</button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>useControlledRerenderState</h2>
        <p>Value (reflects last render): {controlledState}</p>
        <button onClick={handleIncrementControlledRerender} style={{marginRight: "10px"}}>
          Increment Controlled State (with Re-render)
        </button>
        <button onClick={handleIncrementControlledNoRerender}>
          Increment Controlled State (No Re-render by this action)
        </button>
        <p style={{fontSize: "0.8em", color: "gray", marginTop: "5px"}}>
          When using &quot;No Re-render&quot;, the value is updated internally. The UI display here will only update if another action (like incrementing standard state or the &quot;with Re-render&quot; button) causes a component re-render. Check console.
        </p>
      </div>
       <button onClick={() => setRenderIndicator(r => r + 1)} style={{marginTop: "10px"}}>Force Re-render (to update UI for controlledState)</button>
    </div>
  );
};

export default UseControlledRerenderStatePage;
