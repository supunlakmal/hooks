import React from "react";
import { useMediaQuery } from "@supunlakmal/hooks";

function MediaQueryExample() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div>
      <h1>useMediaQuery Example</h1>
      <p>{isLargeScreen ? "Large screen detected" : "Small screen detected"}</p>
    </div>
  );
}

export default MediaQueryExample;