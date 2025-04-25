"use client"
import React, { useState, useRef } from "react";
import useVirtualList  from "../../hooks/useVirtualList";

function VirtualListExample() {
    const [list] = useState(Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`));
    const containerRef = useRef<any>(null);

    const { virtualItems, innerRef } = useVirtualList({
        list,
        itemHeight: 50,
        containerRef: containerRef,
    });

    return (
        <div>
            <h1>useVirtualList Example</h1>
            <div
                ref={containerRef}
                style={{ overflowY: "auto", height: "300px", border: "1px solid black" }}
            >
                <div ref={innerRef} style={{ width: "100%", position: "relative"}}>
                    {virtualItems.map(({ index, offsetTop, data }) => (
                        <div
                            key={index} style={{ position: "absolute", top: offsetTop, width: "100%", borderBottom: "1px solid gray" }}>
                                {data}
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VirtualListExample;
                  
