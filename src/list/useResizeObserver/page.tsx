import React, { useRef, useState } from "react";
import { useResizeObserver } from "../../hooks/useResizeObserver";

function ResizeObserverExample() {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useResizeObserver(ref, (entry) => {
        setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
        });
    });

    return (
        <div>
            <h1>useResizeObserver Example</h1>
            <div
                ref={ref}
                style={{
                    resize: "both",
                    overflow: "auto",
                    width: "200px",
                    height: "200px",
                    border: "1px solid black",
                }}
            >
                Resize me!
            </div>
            <p>Width: {size.width}px</p>
            <p>Height: {size.height}px</p>
        </div>
    );
}

export default ResizeObserverExample;