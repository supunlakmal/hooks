"use client"
import React, { useState } from "react";
import useClipboard  from "../../../../src/hooks/useClipboard";

function ClipboardManager() {
    const { value, error, copy, paste } = useClipboard();
    const [textToCopy, setTextToCopy] = useState("Copy this text!");
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [pasteStatus, setPasteStatus] = useState<string | null>(null);

    const handleCopy = async () => {
        setCopyStatus("Copying...");
        try {
            await copy(textToCopy);
            setCopyStatus("Copied!");
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            setCopyStatus(`Copy failed: ${(err as Error).message}`);
            console.error("Copy error:", err);
        }
    };

    const handlePaste = async () => {
        setPasteStatus("Pasting...");
        try {
            const pastedText = await paste();
            setPasteStatus(`Pasted: "${pastedText}"`);
            setTimeout(() => setPasteStatus(null), 3000);
        } catch (err) {
            setPasteStatus(`Paste failed: ${(err as Error).message}`);
            console.error("Paste error:", err);
        }
    };

    return (
        <div>
            <h2>Clipboard Interaction</h2>
            <p>Note: Browser permissions may be required for paste.</p>

            <div>
                <h3>Copy to Clipboard</h3>
                <textarea
                    value={textToCopy}
                    onChange={(e) => setTextToCopy(e.target.value)}
                    rows={3}
                    cols={40}
                />
                <br />
                <button onClick={handleCopy} disabled={copyStatus === "Copying..."}>
                    {copyStatus === "Copying..." ? "Copying..." : "Copy"}
                </button>
                {copyStatus && (
                    <span
                        style={{
                            marginLeft: "10px",
                            color: copyStatus.startsWith("Copy failed") ? "red" : "green",
                        }}
                    >
                        {copyStatus}
                    </span>
                )}
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Paste from Clipboard</h3>
                <button onClick={handlePaste} disabled={pasteStatus === "Pasting..."}>
                    {pasteStatus === "Pasting..." ? "Pasting..." : "Paste"}
                </button>
                {pasteStatus && (
                    <span
                        style={{
                            marginLeft: "10px",
                            color: pasteStatus.startsWith("Paste failed") ? "red" : "red",
                        }}
                    >
                        {pasteStatus}
                    </span>
                )}
                <p style={{ marginTop: "10px" }}>
                    Last value read from clipboard by hook:
                    <strong
                        style={{
                            display: "block",
                            background: "#eee",
                            padding: "5px",
                            minHeight: "1.2em",
                        }}
                    >
                        {value ?? "[Nothing read yet or error occurred]"}
                    </strong>
                </p>
            </div>

            {error && (
                <p style={{ marginTop: "15px", color: "red", fontWeight: "bold" }}>
                    Clipboard Hook Error: {error.message}
                </p>
            )}
        </div>
    );
}

export default ClipboardManager;