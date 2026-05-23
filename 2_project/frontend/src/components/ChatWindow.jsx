import React, { useState, useEffect, useRef } from "react";
import { chatAPI, createWebSocketConnection } from "../api/api";
import { useAuth } from "../context/AuthProvider";
import "./ChatWindow.css";

const ChatWindow = ({ selectedUser }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const websocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load chat history when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadChatHistory();
      connectWebSocket();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [selectedUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversation(selectedUser.id);
      setMessages(response.data);
    } catch (err) {
      setError("Failed to load chat history");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    if (!token || !selectedUser) return;

    try {
      websocketRef.current = createWebSocketConnection(selectedUser.id, token);

      websocketRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      websocketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.data]);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("Connection error. Messages may not be real-time.");
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (err) {
      console.error("Error connecting WebSocket:", err);
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !websocketRef.current) return;

    try {
      websocketRef.current.send(JSON.stringify({ message: inputMessage }));
      setInputMessage("");
    } catch (err) {
      setError("Failed to send message");
      console.error("Error:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="chat-window empty">
        <div className="empty-state">
          <p>Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{selectedUser.username}</h2>
        {selectedUser.full_name && (
          <p className="chat-subtitle">{selectedUser.full_name}</p>
        )}
      </div>

      <div className="chat-messages">
        {loading && <div className="loading">Loading messages...</div>}
        {error && <div className="error-message">{error}</div>}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender_id === user.id ? "sent" : "received"
            }`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="chat-textarea"
          rows="3"
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
