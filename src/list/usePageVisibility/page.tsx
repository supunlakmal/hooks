import React from "react";
import { usePageVisibility } from "@supunlakmal/hooks";

function PageVisibilityExample() {
  const isVisible = usePageVisibility();

  return (
    <div>
      <h1>usePageVisibility Example</h1>
      <p>{isVisible ? "Page is visible." : "Page is hidden."}</p>
    </div>
  );
}

export default PageVisibilityExample;