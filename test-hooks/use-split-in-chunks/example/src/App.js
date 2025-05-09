import React from "react";

import { useSplitInChunks } from "@lagunaisw/use-split-in-chunks";

const App = () => {
  const names = [
    "Ted",
    "Tracy",
    "Marshal",
    "Lily",
    "Barney",
    "Robin",
    "Harry",
    "Hermione",
    "Ron",
    "Michael",
    "Jim",
    "Pam",
    "Dwight"
  ];
  const { chunks, setSize } = useSplitInChunks(names, 2);

  const handleMinus = () => {
    setSize(prev => prev - 1);
  };

  const handlePlus = () => {
    setSize(prev => prev + 1);
  };

  return (
    <div>
      <div>
        <p>Change size:</p>
        <button onClick={handleMinus}>-</button>
        <button onClick={handlePlus}>+</button>
      </div>
      {chunks.map((chunk, index) => (
        <ul key={index}>
          {chunk.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ))}
    </div>
  );
};
export default App;
