import React, { useState } from "react";
import { useFiniteStateMachine } from "@supunlakmal/hooks";

const fetchMachineConfig = {
  initial: "idle",
  states: {
    idle: { on: { FETCH: "loading" } },
    loading: { on: { SUCCESS: "success", ERROR: "error" } },
    success: { on: { RETRY: "loading" } },
    error: { on: { RETRY: "loading" } },
  },
};

function FetchExample() {
  const { currentState, send } = useFiniteStateMachine(fetchMachineConfig);

  const fetchData = () => {
    send("FETCH");
    setTimeout(() => {
      Math.random() > 0.5 ? send("SUCCESS") : send("ERROR");
    }, 1000);
  };

  return (
    <div>
      <h1>useFiniteStateMachine Example</h1>
      <p>Current State: {currentState}</p>
      <button onClick={fetchData} disabled={currentState === "loading"}>
        Fetch Data
      </button>
      {currentState === "error" && (
        <button onClick={() => send("RETRY")}>Retry</button>
      )}
    </div>
  );
}

export default FetchExample;