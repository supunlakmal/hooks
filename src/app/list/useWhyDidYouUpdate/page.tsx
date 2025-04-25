"use client"
import React, { useState } from "react";
import useWhyDidYouUpdate  from "../../../hooks/useWhyDidYouUpdate";

function WhyDidYouUpdateExample() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    useWhyDidYouUpdate("WhyDidYouUpdateExample", { count, text });

    return (
        <div>
            <h1>useWhyDidYouUpdate Example</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something"
            />
        </div>
    );
}

export default WhyDidYouUpdateExample;