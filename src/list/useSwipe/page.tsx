import React, { useState } from "react";
import { useSwipe } from "../../hooks/useSwipe";

function SwipeExample() {
    const [direction, setDirection] = useState<string | null>(null);
    const swipeHandlers = useSwipe({
        onSwipeLeft: () => setDirection("Left"),
        onSwipeRight: () => setDirection("Right"),
        onSwipeUp: () => setDirection("Up"),
        onSwipeDown: () => setDirection("Down"),
    });

    return (
        <div
            {...swipeHandlers}
            style={{
                width: "100%",
                height: "200px",
                backgroundColor: "lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <p>{direction ? `Swiped ${direction}` : "Swipe in any direction"}</p>
        </div>
    );
}

export default SwipeExample;