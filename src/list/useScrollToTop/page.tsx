import React from "react";
import { useScrollToTop } from "../../hooks/useScrollToTop";

function ScrollToTopExample() {
    const scrollToTop = useScrollToTop();

    return (
        <div>
            <h1>useScrollToTop Example</h1>
            <div style={{ height: "200vh", background: "linear-gradient(white, gray)" }}>
                Scroll down and click the button to scroll to the top.
            </div>
            <button onClick={scrollToTop} style={{ position: "fixed", bottom: "10px", right: "10px" }}>
                Scroll to Top
            </button>
        </div>
    );
}

export default ScrollToTopExample;