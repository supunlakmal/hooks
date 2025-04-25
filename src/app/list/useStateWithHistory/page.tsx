"use client"
import React from "react";
import useStateWithHistory  from "../../../hooks/useStateWithHistory";

function StateWithHistoryExample() {
    const { state: value, setState: setValue, history, pointer, back, forward, canUndo, canRedo } = useStateWithHistory(0);

    return (
        <div>
            <h1>useStateWithHistory Example</h1>
            <p>Current Value: {value}</p>
             <p>History: {history.join(", ")}</p>
             <p>Pointer: {pointer}</p>
            <button onClick={() => setValue((prev) => prev + 1)}>Increment</button>
            <button onClick={() => setValue((prev) => prev - 1)}>Decrement</button>

            <button onClick={back} disabled={!canUndo}>Back</button>
            <button onClick={forward} disabled={!canRedo}>Forward</button>

        </div>
    );
}

export default StateWithHistoryExample;