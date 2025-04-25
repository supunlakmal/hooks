import React from "react";
import  useDeviceMotion  from "../../hooks/useDeviceMotion";

type MotionData = {
    x?: number | null;
    y?: number | null;
    z?: number | null;
};

function DeviceMotionExample() {
    const {
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
        interval,
        isSupported,
    } = useDeviceMotion();

    const formatMotionData = (data: MotionData | null) => {
        if (!data) return "N/A";
        const x = data.x?.toFixed(2) ?? "N/A";
        const y = data.y?.toFixed(2) ?? "N/A";
        const z = data.z?.toFixed(2) ?? "N/A";
        return `X: ${x}, Y: ${y}, Z: ${z}`;
    };

    return (
        <div>
            <h1>useDeviceMotion Example</h1>
            {!isSupported ? (
                <p style={{ color: "red" }}>Device Motion API not supported.</p>
            ) : (
                <ul>
                    <li>Acceleration: {formatMotionData(acceleration)}</li>
                    <li>
                        Acceleration Incl. Gravity: {formatMotionData(accelerationIncludingGravity)}
                    </li>
                    <li>Rotation Rate: {formatMotionData(rotationRate)}</li>
                    <li>Interval: {interval ?? "N/A"} ms</li>
                </ul>
            )}
        </div>
    );
}

export default DeviceMotionExample;