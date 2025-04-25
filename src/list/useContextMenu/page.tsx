import React, { useRef, CSSProperties } from "react";
import useContextMenu  from "../../hooks/useContextMenu";

const CustomMenu = ({
    position,
    onClose,
    onSelect,
}: {
    position: { x: number; y: number };
    onClose: () => void;
    onSelect: (option: string) => void;
}) => {
    const menuStyle: CSSProperties = {
        position: "absolute",
        top: position.y,
        left: position.x,
        background: "white",
        border: "1px solid #ccc",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        padding: "5px 0",
        zIndex: 1100,
        minWidth: "100px",
    };

    const itemStyle: CSSProperties = {
        padding: "8px 15px",
        cursor: "pointer",
    };

    const handleSelect = (option: string) => {
        onSelect(option);
        onClose();
    };

    return (
        <div style={menuStyle}>
            <div style={itemStyle} onClick={() => handleSelect("Option 1")}>Option 1</div>
            <div style={itemStyle} onClick={() => handleSelect("Option 2")}>Option 2</div>
            <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #eee" }} />
            <div style={itemStyle} onClick={() => handleSelect("Close")}>Close Menu</div>
        </div>
    );
};

function ContextMenuExample() {
    const targetAreaRef = useRef<HTMLDivElement | null>(null);
    const { isOpen, position, close: closeMenu } = useContextMenu(targetAreaRef);

    const handleMenuSelect = (option: string) => {
        alert(`Selected: ${option}`);
    };

    const targetStyle: CSSProperties = {
        width: "300px",
        height: "200px",
        backgroundColor: "#e0f7fa",
        border: "2px dashed #00796b",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        marginTop: "20px",
    };

    return (
        <div>
            <h1>useContextMenu Example</h1>
            <p>Right-click inside the blue dashed area below:</p>

            <div ref={targetAreaRef} style={targetStyle}>Right-click here</div>

            {isOpen && (
                <CustomMenu
                    position={position}
                    onClose={closeMenu}
                    onSelect={handleMenuSelect}
                />
            )}
        </div>
    );
}

export default ContextMenuExample;