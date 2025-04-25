import React, { useRef } from "react";
import useVisibility  from "../../hooks/useVisibility";

function VisibilityExample() {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useVisibility(ref);

    return (
        <div>
            <h1>useVisibility Example</h1>
            <div
                ref={ref}
                style={{ height: "100px", backgroundColor: isVisible ? "lightgreen" : "lightcoral" }}
            >
                {isVisible ? "Visible" : "Not Visible"}
            </div>
            <p>Scroll to toggle visibility.</p>
        </div>
    );
}

export default VisibilityExample;