import React from "react";
import { useRenderCount } from "@supunlakmal/hooks";

function RenderCountExample() {
    const renderCount = useRenderCount();

    return (
        <div>
            <h1>useRenderCount Example</h1>
            <p>This component has rendered {renderCount} times.</p>
        </div>
    );
}

export default RenderCountExample;