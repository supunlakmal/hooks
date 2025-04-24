import React from "react";
import { useSet } from "@supunlakmal/hooks";

function SetExample() {
    const [set, { add, remove, has, clear }] = useSet<number>([1, 2, 3]);

    return (
        <div>
            <h1>useSet Example</h1>
            <ul>
                {Array.from(set).map((item) => (
                    <li key={item}>
                        {item}
                        <button onClick={() => remove(item)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => add(4)}>Add 4</button>
            <button onClick={() => clear()}>Clear Set</button>
            <p>Has 2: {has(2) ? "Yes" : "No"}</p>
        </div>
    );
}

export default SetExample;