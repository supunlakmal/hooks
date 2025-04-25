"use client"
import React from "react";
import useReducerLogger  from "../../../hooks/useReducerLogger";

function ReducerLoggerExample() {
    const initialState = { count: 0 };

    const reducer = (state: { count: number }, action: { type: string }) => {
        switch (action.type) {
            case "increment":
                return { count: state.count + 1 };
            case "decrement":
                return { count: state.count - 1 };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducerLogger(reducer, initialState);

    return (
        <div>
            <h1>useReducerLogger Example</h1>
            <p>Count: {state.count}</p>
            <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
            <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
        </div>
    );
}

export default ReducerLoggerExample;