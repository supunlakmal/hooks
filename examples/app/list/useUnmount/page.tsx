"use client"
import React from "react";
import useUnmount  from "../../../../src/hooks/useUnmount";

function UnmountExample() {
    const message = "Component is mounted.";
    
    useUnmount(() => {
        console.log("Component is unmounted.");
    });

    return (
        <div>
            <h1>useUnmount Example</h1>
            <p>{message}</p>
        </div>
    );
}

export default UnmountExample;