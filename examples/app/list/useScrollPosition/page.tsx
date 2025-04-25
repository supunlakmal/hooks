"use client"
import React, { useEffect, useState } from "react";
import useScrollPosition from "../../../../src/hooks/useScrollPosition";

function ScrollPositionExample() {
    const [scrollY, setScrollY] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    useEffect(() => {
        if (isMounted) {
            const { y: currentScrollY } = useScrollPosition();
            setScrollY(currentScrollY);
        }
    }, [isMounted]);

    return (
        <div>
            <h1>useScrollPosition Example</h1>
            {isMounted && <p>Scroll Y Position: {Math.round(scrollY)}px</p>}
            <div style={{ height: "200vh", background: "linear-gradient(white, gray)" }}>
                Scroll down to see the effect.
            </div>
        </div>
    );
}

export default ScrollPositionExample;