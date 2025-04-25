"use client"
import React, { useEffect } from "react";
import usePermission from "../../hooks/usePermission";

function PermissionExample() {
  const { state, isSupported, query } = usePermission({ name: "notifications" });

  useEffect(() => {
    if (state === "prompt") {
      query();
    }
  }, [state, query]);

  return (
    <div>
      <h1>usePermission Example</h1>
      <p>Is Supported: {isSupported ? "Yes" : "No"}</p>
      <p>Permission State: {state}</p>
    </div>
  );
}

export default PermissionExample;