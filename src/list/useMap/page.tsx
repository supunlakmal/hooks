import React from "react";
import useMap  from "../../hooks/useMap";

function MapExample() {
    const [map, { set, remove, clear }] = useMap<string, number>([
        ["key1", 1],
        ["key2", 2],
    ]);

    return (
        <div>
            <h1>useMap Example</h1>
            <ul>
                {Array.from(map.entries()).map(([key, value]) => (
                    <li key={key}>
                        {key}: {value}
                        <button onClick={() => remove(key)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => set("key3", 3)}>Add Key3</button>
            <button onClick={clear}>Clear Map</button>
        </div>
    );
}

export default MapExample;