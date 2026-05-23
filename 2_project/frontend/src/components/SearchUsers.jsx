import React, { useState } from "react";
import { userAPI } from "../api/api";
import "./SearchUsers.css";

const SearchUsers = ({ onUserSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setError("");

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await userAPI.searchUsers(value);
      setResults(response.data);
    } catch (err) {
      setError("Failed to search users");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    onUserSelect(user);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="search-users">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={handleSearch}
          className="search-input"
        />
        {loading && <span className="search-loading">Searching...</span>}
      </div>

      {error && <div className="search-error">{error}</div>}

      {results.length > 0 && (
        <div className="search-results">
          {results.map((user) => (
            <div
              key={user.id}
              className="search-result-item"
              onClick={() => handleSelectUser(user)}
            >
              <div className="result-user-info">
                <div className="result-username">{user.username}</div>
                {user.full_name && (
                  <div className="result-fullname">{user.full_name}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
