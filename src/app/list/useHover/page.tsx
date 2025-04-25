"use client"
import React from "react";
import useHover  from "../../hooks/useHover";

function HoverExample() {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    return (
        <div
            ref={hoverRef}
            style={{
                padding: "20px",
                border: "1px solid black",
                backgroundColor: isHovered ? "lightblue" : "white",
                transition: "background-color 0.3s ease",
            }}
        >
            {isHovered ? "Hovering!" : "Hover over me!"}
        </div>
    );
}

export default HoverExample;