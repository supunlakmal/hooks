import React, { useState } from "react";
import { useLogger } from "../../hooks/useLogger";

function LoggerExample() {
    const [count, setCount] = useState(0);

    useLogger("Count updated", count);

    return (
        <div>
            <h1>useLogger Example</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
            <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
        </div>
    );
}

export default LoggerExample;