import React from "react";
import { useOnlineStatus } from "@supunlakmal/hooks";

function OnlineStatusExample() {
    const isOnline = useOnlineStatus();

    return (
        <div>
            <h1>useOnlineStatus Example</h1>
            <p>{isOnline ? "You are online." : "You are offline."}</p>
        </div>
    );
}

export default OnlineStatusExample;