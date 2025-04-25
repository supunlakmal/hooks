"use client";
import React, { useState } from "react";
import useEventListener from "../../../hooks/useEventListener";

function EventListenerExample() {
  const [count, setCount] = useState(0);

  useEventListener("click", () => {
    setCount(count + 1);
  });

  return (
    <div>
      <p>Click anywhere on the screen!</p>
      <p>Counter: {count}</p>
    </div>
  );
}

export default EventListenerExample;