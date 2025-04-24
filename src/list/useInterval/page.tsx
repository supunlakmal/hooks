import React, { useState } from "react";
import { useInterval } from "@supunlakmal/hooks";

function IntervalExample() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      setCount((prev) => prev + 1);
    },
    isRunning ? 1000 : null
  );

  return (
    <div>
      <h1>useInterval Example</h1>
      <p>Count: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Resume"}
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default IntervalExample;