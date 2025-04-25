"use client"
import React, { useState, useCallback, CSSProperties } from "react";
import useAnimation from "../../../hooks/useAnimation";

function AnimationExample() {
    const [position, setPosition] = useState(0); // State to animate (e.g., horizontal position)

    // Animation callback: Update position based on progress
    const animationCallback = useCallback((progress: number) => {
        // Example: Linear movement from 0 to 200 pixels
        const newPosition = progress * 200;
        setPosition(newPosition);
    }, []);

    const handleComplete = () => {
        console.log("Animation complete!");
    };

    const { start, stop, reset, isRunning } = useAnimation(animationCallback, {
        duration: 1500, // Animate over 1.5 seconds
        onComplete: handleComplete,
    });

    const boxStyle: CSSProperties = {
        width: "50px",
        height: "50px",
        backgroundColor: "dodgerblue",
        position: "relative",
        left: `${position}px`, // Apply the animated position
        marginTop: "20px",
    };

    return (
        <div>
            <h1>useAnimation Example</h1>
            <p>Controls a `requestAnimationFrame` loop over a duration.</p>
            <button onClick={start} disabled={isRunning}>
                Start
            </button>
            <button
                onClick={stop}
                disabled={!isRunning}
                style={{ marginLeft: "10px" }}
            >
                Stop
            </button>
            <button onClick={reset} style={{ marginLeft: "10px" }}>
                Reset
            </button>
            <p>Status: {isRunning ? "Running" : "Stopped"}</p>

            <div
                style={{
                    width: "250px",
                    height: "60px",
                    border: "1px solid #ccc",
                    overflow: "hidden",
                }}
            >
                <div style={boxStyle}></div>
            </div>
        </div>
    );
}

export default AnimationExample;