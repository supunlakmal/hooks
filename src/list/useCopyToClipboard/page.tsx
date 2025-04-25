import React, { useState } from "react";
import useCopyToClipboard  from "../../hooks/useCopyToClipboard";

function ClipboardExample() {
    const [textToCopy, setTextToCopy] = useState("Hello from the hook!");
    const [copyStatus, copy] = useCopyToClipboard();

    const handleCopyClick = () => {
        copy(textToCopy);
    };

    return (
        <div>
            <h1>Copy to Clipboard</h1>
            <textarea
                value={textToCopy}
                onChange={(e) => setTextToCopy(e.target.value)}
                rows={3}
                cols={40}
            />
            <br />
            <button onClick={handleCopyClick}>Copy Text</button>

            {copyStatus === true && (
                <p style={{ color: "green" }}>Successfully copied!</p>
            )}
            {copyStatus === false && (
                <p style={{ color: "red" }}>Failed to copy. See console for details.</p>
            )}
            {copyStatus === null && <p>Click the button to copy the text above.</p>}
        </div>
    );
}

export default ClipboardExample;