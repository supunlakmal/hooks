import React, { useRef } from "react";
import useMergeRefs  from "../../hooks/useMergeRefs";

function MergeRefsExample() {
    const ref1 = useRef<any>(null);
    const ref2 = useRef<any>(null);

    const mergedRef = useMergeRefs(ref1, ref2);

    return (
        <div>
            <h1>useMergeRefs Example</h1>
            <div
                ref={mergedRef}
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "lightblue",
                }}
            >
                Merged Refs
            </div>
        </div>
    );
}

export default MergeRefsExample;