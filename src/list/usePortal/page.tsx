import React from "react";
import { usePortal } from "../../hooks/usePortal";

function PortalExample() {
    const Portal = usePortal();

    return (
        <div>
            <h1>usePortal Example</h1>
            <Portal>
                <div style={{ backgroundColor: "lightblue", padding: "10px" }}>
                    This is rendered in a portal!
                </div>
            </Portal>
        </div>
    );
}

export default PortalExample;