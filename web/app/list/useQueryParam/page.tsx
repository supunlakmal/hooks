"use client";
import React, { useState, useEffect } from "react";
import useQueryParam  from "../../../../src/hooks/useQueryParam";

function QueryParamExample() {
    const [isMounted, setIsMounted] = useState(false);
    const [input, setInput] = useState("");
    const [param, setParam] = useState("");
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const updateParam = () => {
        if(isMounted){
            setParam(input);
        }
    };
    if(isMounted){
        const [newParam] = useQueryParam("example", "default");
        setParam(newParam);
    }

    if(!isMounted){
      return (<div>Loading...</div>)
    }

    return (
        <div>
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