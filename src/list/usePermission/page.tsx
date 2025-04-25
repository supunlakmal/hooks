import React from "react";
import { usePermission } from "../../hooks/usePermission";

function PermissionExample() {
    const { state, requestPermission } = usePermission("notifications");

    return (
        <div>
            <h1>usePermission Example</h1>
            <p>Permission State: {state}</p>
            {state === "prompt" && (
                <button onClick={requestPermission}>Request Permission</button>
            )}
        </div>
    );
}

export default PermissionExample;