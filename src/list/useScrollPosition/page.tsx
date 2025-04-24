import React, { useState } from "react";
import { useScrollPosition } from "@supunlakmal/hooks";

function ScrollPositionExample() {
  const [scrollY, setScrollY] = useState(0);

  useScrollPosition(({ y }) => {
    setScrollY(y);
  });

  return (
    <div>
      <h1>useScrollPosition Example</h1>
      <p>Scroll Y Position: {scrollY}px</p>
      <div style={{ height: "200vh", background: "linear-gradient(white, gray)" }}>
        Scroll down to see the effect.
      </div>
    </div>
  );
}

export default ScrollPositionExample;