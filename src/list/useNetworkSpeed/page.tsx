import React from "react";
import { useNetworkSpeed } from "@supunlakmal/hooks";

function NetworkSpeedExample() {
    const { speed, isTesting, startTest } = useNetworkSpeed();

    return (
        <div>
            <h1>useNetworkSpeed Example</h1>
            <p>Network Speed: {isTesting ? "Testing..." : `${speed} Mbps`}</p>
            <button onClick={startTest} disabled={isTesting}>
                {isTesting ? "Testing..." : "Test Speed"}
            </button>
        </div>
    );
}

export default NetworkSpeedExample;