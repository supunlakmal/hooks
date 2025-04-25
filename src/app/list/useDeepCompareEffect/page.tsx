"use client"
import React, { useState } from "react";
import useDeepCompareEffect  from "../../../hooks/useDeepCompareEffect";

function DeepCompareExample() {
    const [settings, setSettings] = useState({
        id: 1,
        config: { enabled: true, values: [10, 20, 30] },
    });

    const [effectRunCount, setEffectRunCount] = useState(0);

    useDeepCompareEffect(() => {
        console.log("Deep compare effect triggered.");
        setEffectRunCount((count) => count + 1);
    }, [settings]);

    return (
        <div>
            <h1>useDeepCompareEffect Example</h1>
            <p>Effect run count: {effectRunCount}</p>
            <button
                onClick={() =>
                    setSettings((prev) => ({ ...prev, config: { ...prev.config } }))
                }
            >
                Trigger Effect
            </button>
        </div>
    );
}

export default DeepCompareExample;