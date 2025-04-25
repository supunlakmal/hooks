import React from "react";

type MotionData = {
    x?: number | null;
    y?: number | null;
    z?: number | null;
};

const isRotationRate = (data: any): data is DeviceMotionEventRotationRate => {
    return data && typeof data === 'object' && 'alpha' in data && 'beta' in data && 'gamma' in data;
  };

function DeviceMotionExample() {
    import { useDeviceMotion } from "../../hooks/useDeviceMotion";

    const {
        acceleration,
        accelerationIncludingGravity,
        rotationRate,
        interval,
        isSupported,
    } = useDeviceMotion();

    const formatMotionData = (
        data: MotionData | DeviceMotionEventRotationRate | null
    ) => {
        if (!data) {
            return "N/A";
        }

        if (isRotationRate(data)) {
            const alpha = data.alpha?.toFixed(2) ?? "N/A";
            const beta = data.beta?.toFixed(2) ?? "N/A";
            const gamma = data.gamma?.toFixed(2) ?? "N/A";
            return `Alpha: ${alpha}, Beta: ${beta}, Gamma: ${gamma}`;
        } else {
            const x = data.x?.toFixed(2) ?? "N/A";
            const y = data.y?.toFixed(2) ?? "N/A";
            const z = data.z?.toFixed(2) ?? "N/A";
            return `X: ${x}, Y: ${y}, Z: ${z}`;
        }
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
                    <li>
                        Rotation Rate: {formatMotionData(rotationRate)}
                    </li>
                    <li>Interval: {interval ?? "N/A"} ms</li>
                </ul>
            )}
        </div>
    );
}

export default DeviceMotionExample;