import React, { useState } from "react";
import { useIdleTimer } from "../../hooks/useIdleTimer";

function IdleTimerExample() {
    const [status, setStatus] = useState("Active");

    const handleOnIdle = () => {
        setStatus("Idle");
    };

    const handleOnActive = () => {
        setStatus("Active");
    };

    useIdleTimer({
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        timeout: 5000,
    });

    return (
        <div>
            <h1>useIdleTimer Example</h1>
            <p>Status: {status}</p>
            <p>Stop interacting for 5 seconds to become idle.</p>
        </div>
    );
}

export default IdleTimerExample;