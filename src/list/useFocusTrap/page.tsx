import React, { useState, useRef } from "react";
import useFocusTrap  from "../../hooks/useFocusTrap";

function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const modalRef = useRef<any>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    if (modalRef.current) {
        useFocusTrap(modalRef, isOpen, closeButtonRef);
    }
   
    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                border: "1px solid black",
                zIndex: 1000,
            }}
        >
            <h2>Modal</h2>
                <p>This is a modal with focus trapped inside.</p>
            <button ref={closeButtonRef} onClick={onClose}>
                Close
            </button>
        </div>
    );
}

function FocusTrapExample() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <h1>useFocusTrap Example</h1>
            <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default FocusTrapExample;