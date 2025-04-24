import React from "react";
import { useIsFirstRender } from "@supunlakmal/hooks";

function IsFirstRenderExample() {
    const isFirstRender = useIsFirstRender();

    return (
        <div>
            <h1>useIsFirstRender Example</h1>
            <p>{isFirstRender ? "This is the first render!" : "This is a subsequent render."}</p>
        </div>
    );
}

export default IsFirstRenderExample;