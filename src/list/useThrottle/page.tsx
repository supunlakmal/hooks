import React, { useState } from "react";
import { useThrottle } from "@supunlakmal/hooks";

function ThrottleExample() {
  const [value, setValue] = useState("");
  const throttledValue = useThrottle(value, 1000);

  return (
    <div>
      <h1>useThrottle Example</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type something"
      />
      <p>Throttled Value: {throttledValue}</p>
    </div>
  );
}

export default ThrottleExample;