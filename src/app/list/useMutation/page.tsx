"use client"
import React, { useState } from "react";
import useMutation  from "../../hooks/useMutation";

function MutationExample() {
    const [result, setResult] = useState<string | null | undefined>(undefined);

    const mutation = useMutation(async (input: string) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(`Processed: ${input}`), 1000);
        });
    });

    const handleMutate = async () => {
        const response = await mutation.mutate("Sample Input");
        setResult(response);
    };

    return (
        <div>
            <h1>useMutation Example</h1>
            <button onClick={handleMutate} disabled={mutation.isLoading}>
                {mutation.isLoading ? "Processing..." : "Mutate"}
            </button>
            {result && <p>Result: {result}</p>}
        </div>
    );
}

export default MutationExample;