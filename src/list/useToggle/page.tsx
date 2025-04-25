import React from "react";
import useToggle  from "../../hooks/useToggle";

function ToggleExample() {
    const [isToggled, toggle] = useToggle(false);

    return (
        <div>
            <h1>useToggle Example</h1>
            <p>State: {isToggled ? "On" : "Off"}</p>
            <button onClick={toggle}>Toggle</button>
            <button onClick={() => toggle(true)}>Set On</button>
            <button onClick={() => toggle(false)}>Set Off</button>
        </div>
    );
}

export default ToggleExample;