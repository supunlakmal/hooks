"use client"
import React from "react";
import useToggle  from "../../../hooks/useToggle";

function ToggleExample() {
    const [value, toggle, setOn, setOff] = useToggle(false);

    return (
        <div>
            <h1>useToggle Example</h1>
            <p>State: {value ? "On" : "Off"}</p>
            <button onClick={toggle}>Toggle</button>
            <button onClick={setOn}>Set On</button>
            <button onClick={setOff}>Set Off</button>
        </div>
    );
}

export default ToggleExample;