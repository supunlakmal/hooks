"use client"
import React, { useState } from 'react';
import useBroadcastChannel from '../../hooks/useBroadcastChannel';

interface MyData {
    message: string;
    timestamp: number;
}

const BroadcastComponent: React.FC = () => {
    const { data, postMessage } = useBroadcastChannel<MyData>('my-channel');
    const [messageToSend, setMessageToSend] = useState('');

    const sendMessage = () => {
        const newMessage: MyData = {
            message: messageToSend,
            timestamp: Date.now(),
        };
        postMessage(newMessage);
        setMessageToSend(''); // Clear input after sending
    };

    return (
        <div>
            <h2>Broadcast Channel Example</h2>
            <input
                type="text"
                value={messageToSend}
                onChange={(e) => setMessageToSend(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send Message to Other Tabs</button>

            <h3>Received Message:</h3>
            {data ? (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>No message received yet.</p>
            )}
        </div>
    );
};

export default BroadcastComponent;