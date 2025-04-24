import React, { useState } from "react";
import { useUnmount } from "@supunlakmal/hooks";

function UnmountExample() {
    const [message, setMessage] = useState("Component is mounted.");

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