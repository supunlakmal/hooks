"use client"
import React from "react";
import useScrollPosition  from "../../hooks/useScrollPosition";

function ScrollPositionExample() {
    const { y: scrollY } = useScrollPosition();

    

    return (
        <div>
            <h1>useScrollPosition Example</h1>
            <p>Scroll Y Position: {Math.round(scrollY)}px</p>
            <div style={{ height: "200vh", background: "linear-gradient(white, gray)" }}>
                Scroll down to see the effect.
            </div>
        </div>
    );
}

export default ScrollPositionExample;