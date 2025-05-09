import { useState, useEffect } from "react";

export const useSplitInChunks = (originalArray: any[], chunkSize: number) => {
  const [array, setArray] = useState(originalArray);
  const [size, setSize] = useState(chunkSize);
  const [chunks, setChunks] = useState<any[]>([]);

  if (size <= 0) {
    throw new Error("chunkSize should be greater than 0");
  } else if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }

  useEffect(() => {
    const result = array.reduce(
      (resultArray: any[], item: any, index: number) => {
        const chunkIndex = Math.floor(index / size);
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
      },
      []
    );
    setChunks(result);
  }, [setChunks, size, array]);

  return { chunks, setArray, setSize };
};
