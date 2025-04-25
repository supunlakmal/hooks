import React, { useState } from "react";
import useVirtualList  from "../../hooks/useVirtualList";

function VirtualListExample() {
    const [items] = useState(Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`));
    const { virtualItems, containerProps, itemProps } = useVirtualList({
        items,
        itemHeight: 50,
        containerHeight: 300,
    });

    return (
        <div>
            <h1>useVirtualList Example</h1>
            <div {...containerProps} style={{ overflowY: "auto", height: "300px", border: "1px solid black" }}>
                {virtualItems.map(({ index, style }) => (
                    <div key={index} {...itemProps(index)} style={{ ...style, borderBottom: "1px solid gray" }}>
                        {items[index]}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VirtualListExample;