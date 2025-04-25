"use client"
import React, { useState } from "react";
import useKeyCombo  from "../../hooks/useKeyCombo";

function KeyComboExample() {
    const [message, setMessage] = useState("Press Ctrl+K");

    useKeyCombo("Control+K", () => {
        setMessage("Ctrl+K was pressed!");
    });

    return (
        <div>
            <h1>useKeyCombo Example</h1>
            <p>{message}</p>
        </div>
    );
}

export default KeyComboExample;