import React, { useState } from "react";
import { useKeyPress } from "@supunlakmal/hooks";

function KeyPressExample() {
    const [key, setKey] = useState<string | null>(null);

    useKeyPress((event) => {
        setKey(event.key);
    });

    return (
        <div>
            <h1>useKeyPress Example</h1>
            <p>Last key pressed: {key || "None"}</p>
        </div>
    );
}

export default KeyPressExample;