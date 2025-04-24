import React, { useState } from "react";
import { useLongPress } from "@supunlakmal/hooks";

function LongPressExample() {
    const [message, setMessage] = useState("Press and hold the button");

    const onLongPress = () => {
        setMessage("Button long-pressed!");
    };

    const onClick = () => {
        setMessage("Button clicked!");
    };

    const longPressEvent = useLongPress(onLongPress, { onClick, delay: 500 });

    return (
        <div>
            <h1>useLongPress Example</h1>
            <p>{message}</p>
            <button {...longPressEvent}>Press Me</button>
        </div>
    );
}

export default LongPressExample;