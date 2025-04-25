"use client"
import React from "react";
import useWindowSize  from "../../hooks/useWindowSize";

function WindowSizeExample() {
    const { width, height } = useWindowSize();

    return (
        <div>
            <h1>useWindowSize Example</h1>
            <p>Width: {width}px</p>
            <p>Height: {height}px</p>
        </div>
    );
}

export default WindowSizeExample;