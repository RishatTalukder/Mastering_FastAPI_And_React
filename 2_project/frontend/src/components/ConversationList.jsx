import React, { useState, useEffect } from "react";
import { chatAPI } from "../api/api";
import "./ConversationList.css";

const ConversationList = ({ selectedUser, onSelectUser }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    // Refresh conversations every 5 seconds
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data);
    } catch (err) {
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="conversations-list loading">Loading conversations...</div>
    );
  }

  return (
    <div className="conversations-list">
      <h3>Conversations</h3>
      {conversations.length === 0 ? (
        <div className="no-conversations">No conversations yet</div>
      ) : (
        <div className="conversations-container">
          {conversations.map((conv) => (
            <div
              key={conv.user_id}
              className={`conversation-item ${
                selectedUser?.id === conv.user_id ? "active" : ""
              }`}
              onClick={() =>
                onSelectUser({
                  id: conv.user_id,
                  username: conv.username,
                  full_name: conv.full_name,
                })
              }
            >
              <div className="conversation-info">
                <div className="conversation-username">{conv.username}</div>
                {conv.last_message && (
                  <div className="conversation-last-message">
                    {conv.last_message.substring(0, 50)}
                    {conv.last_message.length > 50 ? "..." : ""}
                  </div>
                )}
              </div>
              {conv.unread_count > 0 && (
                <div className="conversation-unread">{conv.unread_count}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList;
