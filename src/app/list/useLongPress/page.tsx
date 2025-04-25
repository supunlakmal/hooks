"use client"
import React, { useState, useRef } from "react";
import useLongPress  from "../../../hooks/useLongPress";

function LongPressExample() {
    const [message, setMessage] = useState("Press and hold the button");
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onLongPress = () => {
        setMessage("Button long-pressed!");
    };

    const onStart = () => {
      setMessage("Button pressed!");
    };

    const onEnd = () => {
      setMessage("Button released!");
    };


    useLongPress(buttonRef, onLongPress, { onStart, onEnd, threshold: 500 });

    return (
        <div>
            <h1>useLongPress Example</h1>
            <p>{message}</p>
            <button ref={buttonRef}>Press Me</button>
        </div>
    );
}

export default LongPressExample;