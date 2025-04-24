import React, { useState } from "react";
import { useRovingTabIndex } from "@supunlakmal/hooks";

function RovingTabIndexExample() {
    const [items] = useState(["Item 1", "Item 2", "Item 3"]);
    const { getTabIndex, handleKeyDown } = useRovingTabIndex(items.length);

    return (
        <div>
            <h1>useRovingTabIndex Example</h1>
            {items.map((item, index) => (
                <button
                    key={item}
                    tabIndex={getTabIndex(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}

export default RovingTabIndexExample;