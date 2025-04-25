import React, { useRef } from "react";
import useIntersectionObserver  from "../../hooks/useIntersectionObserver";

function IntersectionObserverExample() {
    const targetRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(targetRef, { threshold: 0.5 });

    return (
        <div>
            <h1>useIntersectionObserver Example</h1>
            <div
                ref={targetRef}
                style={{
                    height: "100px",
                    backgroundColor: entry?.isIntersecting ? "lightgreen" : "lightcoral",
                    margin: "50px 0",
                }}
            >
                {entry?.isIntersecting ? "Visible" : "Not Visible"}
            </div>
            <p>Scroll to see the box change color when it becomes visible.</p>
        </div>
    );
}

export default IntersectionObserverExample;