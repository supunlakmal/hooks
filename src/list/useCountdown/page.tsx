import React, { useCallback } from "react";
import { useCountdown } from "@supunlakmal/hooks"; // Adjust the import path

const CountdownComponent: React.FC = () => {
    const handleComplete = useCallback(() => {
        alert("Countdown finished!");
    }, []);

    const { remainingSeconds, isRunning, start, pause, reset } = useCountdown({
        seconds: 60,
        interval: 500,
        autoStart: false,
        onComplete: handleComplete,
    });

    return (
        <div>
            <h2>Countdown Timer</h2>
            <p>Time Remaining: {remainingSeconds.toFixed(1)} seconds</p>
            <p>Status: {isRunning ? "Running" : "Paused/Stopped"}</p>
            <div>
                {!isRunning ? (
                    <button onClick={start} disabled={remainingSeconds <= 0}>
                        Start / Resume
                    </button>
                ) : (
                    <button onClick={pause}>Pause</button>
                )}
                <button onClick={reset}>Reset (to 60s)</button>
            </div>
        </div>
    );
};

export default CountdownComponent;