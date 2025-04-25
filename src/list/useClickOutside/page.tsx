import React, { useState, useRef, RefObject } from "react";
import useClickOutside from "../../hooks/useClickOutside"; // Adjust the import path as needed

function ModalComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

    useClickOutside(modalRef as RefObject<any>, () => {
        if (isOpen) {
            setIsOpen(false);
            console.log("Clicked outside, closing modal.");
        }
    });

    return (
        <div>
            <button onClick={() => setIsOpen(true)}>Open Modal</button>

            {isOpen && (
                <div
                    ref={modalRef}
                    style={{
                        padding: "20px",
                        marginTop: "10px",
                        border: "1px solid black",
                        backgroundColor: "white",
                        display: "inline-block",
                    }}
                >
                    <h2>Modal Content</h2>
                    <p>Click outside this box to close it.</p>
                    <button onClick={() => setIsOpen(false)}>Close Manually</button>
                </div>
            )}

            <p style={{ marginTop: "20px" }}>Other page content...</p>
        </div>
    );
}

export default ModalComponent;