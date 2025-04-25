"use client"
import React, { useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";

function WebSocketExample() {
  const [messages, setMessages] = useState<string[]>([]);
  const { sendMessage, lastMessage } = useWebSocket(
    "wss://echo.websocket.events",
    {
      onMessage: (event) => {
        if (typeof event.data === "string") {
          setMessages((prev) => [...prev, event.data]);
        }
      },
    }
  );

  const handleSend = () => {
    sendMessage("Hello, WebSocket!");
  };

  return (
    <div>
      <h1>useWebSocket Example</h1>
      <button onClick={handleSend}>Send Message</button>
      <p>
        Last Message:{" "}
        {lastMessage && typeof lastMessage.data === "string"
          ? lastMessage.data
          : "No message"}
      </p>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default WebSocketExample;