"use client"
import React, { useRef, useState } from "react";
import useRovingTabIndex from "../../../hooks/useRovingTabIndex";

function RovingTabIndexExample() {
  const [items] = useState(["Item 1", "Item 2", "Item 3"]);
  const containerRef = useRef<any>(null);
  const { activeIndex } = useRovingTabIndex(containerRef);  

  return (
    <div>
      <h1>useRovingTabIndex Example</h1>
      <div ref={containerRef}  >
         {items.map((item, index) => (
           <button
            key={item}
            role="option"
            tabIndex={index === activeIndex ? 0 : -1}
            style={{
              display: "block",
              marginBottom: "10px",            
              padding: "10px",
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );


}

export default RovingTabIndexExample;