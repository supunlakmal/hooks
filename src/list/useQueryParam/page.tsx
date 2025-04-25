import React, { useState } from "react";
import { useQueryParam } from "../../hooks/useQueryParam";

function QueryParamExample() {
    const [param, setParam] = useQueryParam("example", "default");
    const [input, setInput] = useState(param);

    const updateParam = () => {
        setParam(input);
    };

    return (
        <div>
            <h1>useQueryParam Example</h1>
            <p>Query Parameter: {param}</p>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter query param"
            />
            <button onClick={updateParam}>Update Query Param</button>
        </div>
    );
}

export default QueryParamExample;