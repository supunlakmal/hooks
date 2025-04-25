"use client";
import React, { useState, useEffect } from "react";
import useRouteChange from "../../../../src/hooks/useRouteChange";

function RouteChangeExample() {
    const [message, setMessage] = useState("No route change detected.");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);
    
    useEffect(() => {
      if(isMounted) {
        useRouteChange(() => {
            setMessage("Route has changed!");
        });
      }
    },[isMounted])

    return (
        <div>
             <h1>useRouteChange Example</h1>
             <p>{message}</p>
        </div>
    );
}

export default RouteChangeExample;