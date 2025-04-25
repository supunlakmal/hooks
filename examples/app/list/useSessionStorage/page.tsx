"use client"
import React, { useState } from "react";
import useSessionStorage  from "../../../../src/hooks/useSessionStorage";

function SessionStorageExample() {
    const [value, setValue] = useSessionStorage("key", "default");
    const [input, setInput] = useState(value);

    const saveValue = () => {
        setValue(input);
    };

    return (
        <div>
            <h1>useSessionStorage Example</h1>
            <p>Stored Value: {value}</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter value"
            />
            <button onClick={saveValue}>Save</button>
            <button onClick={() => setValue("")}>Clear</button>
        </div>
    );
}

export default SessionStorageExample;