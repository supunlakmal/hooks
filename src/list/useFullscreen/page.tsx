import React, { useRef } from "react";
import { useFullscreen } from "../../hooks/useFullscreen";

function FullscreenExample() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen } =
        useFullscreen(targetRef);

    return (
        <div>
            <h1>useFullscreen Example</h1>
            <div
                ref={targetRef}
                style={{
                    border: "2px solid blue",
                    padding: "20px",
                    marginBottom: "10px",
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