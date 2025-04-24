import React from "react";
import { useDarkMode } from "@supunlakmal/hooks"; // Adjust path
import "./styles.css"; // Import your global styles

function DarkModeExample() {
    const { isDarkMode, toggle, enable, disable } = useDarkMode();

    return (
        <div>
            <h1>Dark Mode Demo</h1>
            <p>Current mode: {isDarkMode ? "Dark" : "Light"}</p>
            <button onClick={toggle}>Toggle Mode</button>
            <button onClick={enable}>Enable Dark Mode</button>
            <button onClick={disable}>Disable Dark Mode</button>
            <div className="content-box">
                This box will have styles applied based on the dark/light theme.
            </div>
        </div>
    );
}

export default DarkModeExample;