# Real-time Chat Application

A full-stack real-time chat application built with **FastAPI** and **React**, featuring user authentication, real-time messaging via WebSockets, user search, and conversation management.

## Quick Start

### Backend Setup

```bash
cd 2_project/backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd 2_project/frontend
npm install
npm run dev
```

Then visit `http://localhost:3000` in your browser.

## Features

✨ **User Authentication** - Secure registration and login with JWT tokens
🔍 **User Search** - Find users by username or full name
💬 **Real-time Messaging** - WebSocket-based instant messaging
📨 **Conversation Management** - View and manage chat history
🔔 **Unread Messages** - Track unread message counts
📱 **Responsive Design** - Works on desktop and mobile

## Project Structure

```
2_project/
├── backend/
│   ├── auth/              # Authentication (JWT, password hashing)
│   ├── user/              # User management and search
│   ├── chat/              # Messaging and WebSocket
│   ├── database.py        # Database configuration
│   ├── main.py            # FastAPI app
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment config
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── api/           # API utilities
│   │   └── App.jsx        # Main app
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── docs/
    └── README.md          # Detailed documentation
```

## Core Technologies

**Backend**:

- FastAPI - Modern web framework
- SQLAlchemy - ORM
- SQLite/PostgreSQL - Database
- WebSockets - Real-time messaging
- JWT - Authentication
- Bcrypt - Password hashing

**Frontend**:

- React 18 - UI library
- React Router - Routing
- Axios - HTTP client
- WebSocket API - Real-time communication
- Vite - Build tool

## API Endpoints

### Auth

- `POST /auth/register` - Register user
- `POST /auth/login` - Login

### Users

- `GET /users/search?q=query` - Search users
- `GET /users/me` - Current user
- `GET /users/{id}` - User profile

### Chat

- `POST /chat/messages` - Send message
- `GET /chat/messages/{user_id}` - Conversation history
- `GET /chat/conversations` - All conversations
- `WS /ws/chat/{user_id}?token=token` - WebSocket connection

## Key Features Implementation

### Real-time Messaging

WebSocket connections handle real-time message delivery between users:

```javascript
// Connect to WebSocket
const ws = new WebSocket(
  `ws://localhost:8000/ws/chat/${userId}?token=${token}`,
);

// Send message
ws.send(JSON.stringify({ message: "Hello!" }));

// Receive messages
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update UI with new message
};
```

### User Search

Efficient user search with database indexing:

```bash
GET /users/search?q=john
```

### Conversation Management

Track all conversations with unread counts and last message.

## Development

For detailed setup instructions, configuration, and troubleshooting, see [docs/README.md](docs/README.md).

## Security

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- HTTP-only cookie support ready

## Testing

Create test accounts and use the app to:

- Register multiple users
- Search for users
- Start conversations
- Send/receive messages in real-time
- View conversation history

## Deployment

See [docs/README.md](docs/README.md) for production deployment guidelines.

## License

MIT License

## Support

For questions or issues, please check the documentation or open an issue.
