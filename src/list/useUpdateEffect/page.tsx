import React, { useState } from "react";
import { useUpdateEffect } from "@supunlakmal/hooks";

function UpdateEffectExample() {
  const [count, setCount] = useState(0);

  useUpdateEffect(() => {
    console.log("Count updated to:", count);
  }, [count]);

  return (
    <div>
      <h1>useUpdateEffect Example</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
}

export default UpdateEffectExample;