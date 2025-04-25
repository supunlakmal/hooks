"use client"
import React, { useRef } from "react";
import useNewFullscreen from "../../../../src/hooks/useNewFullscreen";

function FullscreenExample() {
    const targetRef = useRef<HTMLElement | null>(null);
    const { enterFullscreen, exitFullscreen, toggleFullscreen } = useNewFullscreen(targetRef);


    return ( 
        <div >
            <h1>useFullscreen Example</h1>
            <div 
                style={{
                    border: "2px solid blue",
                    padding: "20px",
                    marginBottom: "10px",
                    width:'100px'
                }} 
            >
                <p>This content can go fullscreen.</p>
            </div>
            <button onClick={enterFullscreen}>Enter Fullscreen</button>
            <button onClick={exitFullscreen}>Exit Fullscreen</button>
            <button onClick={toggleFullscreen}>Toggle Fullscreen</button>
        </div>
    );
}
export default FullscreenExample;