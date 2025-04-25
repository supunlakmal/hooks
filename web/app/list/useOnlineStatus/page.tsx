"use client"
import React, { useState, useEffect } from "react";
import useOnlineStatus  from "../../../../src/hooks/useOnlineStatus";

function OnlineStatusExample() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    let isOnline = false;
    if(isMounted) {
        isOnline = useOnlineStatus();
    }

    return (
        <div>
            <h1>useOnlineStatus Example</h1>
            {isMounted && (
                 <p>{isOnline ? "You are online." : "You are offline."}</p>
            )}
           
        </div>
    );
}

export default OnlineStatusExample;