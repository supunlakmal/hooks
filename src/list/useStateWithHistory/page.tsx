import React from "react";
import useStateWithHistory  from "../../hooks/useStateWithHistory";

function StateWithHistoryExample() {
    const [value, setValue, { history, pointer, back, forward }] = useStateWithHistory(0);

    return (
        <div>
            <h1>useStateWithHistory Example</h1>
            <p>Current Value: {value}</p>
            <p>History: {history.join(", ")}</p>
            <p>Pointer: {pointer}</p>
            <button onClick={() => setValue((prev) => prev + 1)}>Increment</button>
            <button onClick={() => setValue((prev) => prev - 1)}>Decrement</button>
            <button onClick={back} disabled={pointer === 0}>Back</button>
            <button onClick={forward} disabled={pointer === history.length - 1}>Forward</button>
        </div>
    );
}

export default StateWithHistoryExample;