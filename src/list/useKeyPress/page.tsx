import React, { useState } from 'react';
import useKeyPress  from "../../hooks/useKeyPress";

function KeyPressExample() {
    const [key, setKey] = useState<string | null>(null);
    const isPressed = useKeyPress('Enter');

    if(isPressed) setKey('Enter');
    return (
        <div>
            <h1>useKeyPress Example</h1>
            <p>Last key pressed: {key ? key : 'None'}</p>
        </div>
    );
}

export default KeyPressExample;