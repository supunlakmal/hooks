import React, { useState } from "react";
import { useWebSocket } from "@supunlakmal/hooks";

function WebSocketExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const { sendMessage, lastMessage } = useWebSocket("wss://example.com/socket", {
    onMessage: (message) => setMessages((prev) => [...prev, message]),
  });

  const handleSend = () => {
    sendMessage("Hello, WebSocket!");
  };

  return (
    <div>
      <h1>useWebSocket Example</h1>
      <button onClick={handleSend}>Send Message</button>
      <p>Last Message: {lastMessage}</p>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketExample;