"use client"
import React from "react";
import useBreakpoint from "../../hooks/useBreakpoint";

function ResponsiveComponent() {
    const activeBreakpoint = useBreakpoint();

    let content = 'Screen size is below "sm" breakpoint (or SSR).';

    if (activeBreakpoint === "sm") {
        content = "Active breakpoint: sm (640px and up)";
    } else if (activeBreakpoint === "md") {
        content = "Active breakpoint: md (768px and up)";
    } else if (activeBreakpoint === "lg") {
        content = "Active breakpoint: lg (1024px and up)";
    } else if (activeBreakpoint === "xl") {
        content = "Active breakpoint: xl (1280px and up)";
    } else if (activeBreakpoint === "2xl") {
        content = "Active breakpoint: 2xl (1536px and up)";
    }

    return (
        <div>
            <h1>Breakpoint Demo</h1>
            <p>Resize your browser window to see the active breakpoint change.</p>
            <p
                style={{
                    fontWeight: "bold",
                    marginTop: "15px",
                    padding: "10px",
                    background: "#f0f0f0",
                }}
            >
                {content}
            </p>
        </div>
    );
}

export default ResponsiveComponent;