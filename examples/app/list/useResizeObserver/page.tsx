"use client"
import React, { useRef, useState, useEffect } from "react";
import useResizeObserver from "../../../../src/hooks/useResizeObserver";

function ResizeObserverExample() {
  const ref = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const entry = useResizeObserver(ref);

  useEffect(() => {
    if (entry) {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    }
  }, [entry]);

  return (
    <div>
      <h1>useResizeObserver Example</h1>
      <div
        ref={ref}
        style={{
          resize: "both",
          overflow: "auto",
          width: "200px",
          height: "200px",
          border: "1px solid black",
        }}
      >
        Resize me!
      </div>
      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
    </div>
  );
}

export default ResizeObserverExample;