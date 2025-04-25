import React, { useState } from "react";
import { usePrevious } from "../../hooks/usePrevious";

function PreviousExample() {
    const [count, setCount] = useState(0);
    const previousCount = usePrevious(count);

    return (
        <div>
            <h1>usePrevious Example</h1>
            <p>Current Count: {count}</p>
            <p>Previous Count: {previousCount}</p>
            <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
            <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
        </div>
    );
}

export default PreviousExample;