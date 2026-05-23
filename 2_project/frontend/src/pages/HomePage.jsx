import React, { useState } from "react";
import SearchUsers from "../components/SearchUsers";
import ChatWindow from "../components/ChatWindow";
import ConversationList from "../components/ConversationList";
import "./HomePage.css";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <aside className="sidebar">
          <SearchUsers onUserSelect={handleUserSelect} />
          <ConversationList
            selectedUser={selectedUser}
            onSelectUser={handleUserSelect}
          />
        </aside>

        <main className="chat-area">
          <ChatWindow selectedUser={selectedUser} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;
