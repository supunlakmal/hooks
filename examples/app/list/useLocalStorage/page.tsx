"use client"
import React, { useState } from "react";
import useLocalStorage  from "../../../../src/hooks/useLocalStorage";

function LocalStorageExample() {
    const [name, setName] = useLocalStorage("name", "");
    const [input, setInput] = useState("");

    const saveName = () => {
        setName(input);
        setInput("");
    };

    return (
        <div>
            <h1>useLocalStorage Example</h1>
            <p>Saved Name: {name || "None"}</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your name"
            />
            <button onClick={saveName}>Save</button>
            <button onClick={() => setName("")}>Clear</button>
        </div>
    );
}

export default LocalStorageExample;