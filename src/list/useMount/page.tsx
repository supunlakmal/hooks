import React, { useState } from "react";
import useMount  from "../../hooks/useMount";

function MountExample() {
    const [message, setMessage] = useState("Component not mounted yet.");

    useMount(() => {
        setMessage("Component has been mounted!");
    });

    return (
        <div>
            <h1>useMount Example</h1>
            <p>{message}</p>
        </div>
    );
}

export default MountExample;