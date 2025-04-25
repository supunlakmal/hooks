"use client";
import React, { useState, useEffect } from "react";
import useEventListener from "../../../hooks/useEventListener";

function EventListenerExample() {
  const [count, setCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted) {
    useEventListener("click", () => {
      setCount((prevCount) => prevCount + 1);
    });
  }


  return (
    <div>
      <p>Click anywhere on the screen!</p>
      <p>Counter: {count}</p>
    </div>
  );
}

export default EventListenerExample;