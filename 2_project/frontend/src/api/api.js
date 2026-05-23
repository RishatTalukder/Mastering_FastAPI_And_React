import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// User API
export const userAPI = {
  searchUsers: (query) => api.get("/users/search", { params: { q: query } }),
  getCurrentUser: () => api.get("/users/me"),
  getUserById: (userId) => api.get(`/users/${userId}`),
};

// Chat API
export const chatAPI = {
  sendMessage: (data) => api.post("/chat/messages", data),
  getConversation: (userId, limit = 50, offset = 0) =>
    api.get(`/chat/messages/${userId}`, { params: { limit, offset } }),
  getConversations: () => api.get("/chat/conversations"),
};

// WebSocket connection
export const createWebSocketConnection = (userId, token) => {
  const ws = new WebSocket(
    `ws://localhost:8000/ws/chat/${userId}?token=${token}`,
  );
  return ws;
};

export default api;
