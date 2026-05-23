# Real-time Chat Application

A modern real-time chat application built with FastAPI (backend) and React (frontend) with WebSocket support for instant messaging.

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **User Search**: Search for other users by username or full name
- **Real-time Messaging**: Instant message delivery using WebSockets
- **Conversation History**: View past conversations with other users
- **Unread Message Counter**: Track unread messages in conversations
- **Message Read Status**: Mark messages as read/unread
- **Responsive UI**: Works on desktop and mobile devices

## Project Structure

```
2_project/
├── backend/
│   ├── auth/
│   │   ├── oauth.py          # JWT token handling and password utilities
│   │   └── router.py         # Login and registration endpoints
│   ├── user/
│   │   ├── models.py         # User database model
│   │   ├── schemas.py        # User request/response schemas
│   │   └── router.py         # User search and profile endpoints
│   ├── chat/
│   │   ├── models.py         # Message database model
│   │   ├── schemas.py        # Message schemas
│   │   ├── router.py         # Message and conversation endpoints
│   │   └── websocket.py      # WebSocket connection handler
│   ├── utils/                # Utility functions
│   ├── database.py           # Database configuration
│   ├── main.py               # FastAPI application setup
│   ├── requirements.txt       # Python dependencies
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── SearchUsers.jsx      # User search component
│   │   │   ├── ChatWindow.jsx       # Main chat interface
│   │   │   └── ConversationList.jsx # List of conversations
│   │   ├── context/
│   │   │   └── AuthProvider.jsx     # Authentication context
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Home/chat page
│   │   │   ├── Login.jsx            # Login page
│   │   │   └── SignupPage.jsx       # Signup page
│   │   ├── protectedRoutes/
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── sharedLayouts/
│   │   │   └── MainLayout.jsx       # Main layout wrapper
│   │   ├── api/
│   │   │   └── api.js               # API client and WebSocket utilities
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── docs/
│   └── README.md             # This file
└── README.md                 # Project overview
```

## Backend Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:

```bash
cd 2_project/backend
```

2. Create a virtual environment:

```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables:

```bash
# Edit .env file
nano .env
```

5. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Frontend Setup

### Prerequisites

- Node.js 16 or higher
- npm or pnpm

### Installation

1. Navigate to the frontend directory:

```bash
cd 2_project/frontend
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT token

### Users

- `GET /users/search?q={query}` - Search for users
- `GET /users/me` - Get current user profile
- `GET /users/{user_id}` - Get user profile by ID

### Messages

- `POST /chat/messages` - Send a message
- `GET /chat/messages/{user_id}` - Get conversation history
- `GET /chat/conversations` - Get all conversations

### WebSocket

- `WS /ws/chat/{user_id}?token={token}` - WebSocket connection for real-time messaging

## Usage Guide

### Registration and Login

1. Click "Sign Up" to create a new account
2. Enter username, email, password, and full name
3. After registration, login with your credentials

### Searching and Messaging

1. Use the search bar to find other users by username or full name
2. Click on a user to open the chat window
3. Type your message and press Enter or click Send
4. Messages appear in real-time via WebSocket

### Viewing Conversations

- See all your active conversations in the left sidebar
- Each conversation shows the last message and unread count
- Click on a conversation to view message history

## Database

The application uses SQLite by default. The database file is created automatically at:

```
2_project/backend/chat.db
```

To use a different database, modify the `DATABASE_URL` in `.env`:

```
# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost/chat_db

# MySQL
DATABASE_URL=mysql://user:password@localhost/chat_db
```

## Security Considerations

### Production Deployment

1. **Change SECRET_KEY**: Update the SECRET_KEY in `.env` to a strong random string
2. **CORS Configuration**: Update CORS settings in `main.py` to only allow your frontend domain
3. **HTTPS**: Always use HTTPS in production
4. **Database**: Use PostgreSQL or MySQL instead of SQLite
5. **Environment Variables**: Store sensitive data securely using environment variables
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Input Validation**: Sanitize all user inputs

### Authentication

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes
- All API endpoints (except login/register) require authentication

## Troubleshooting

### Backend Issues

**Port already in use**:

```bash
uvicorn main:app --reload --port 8001
```

**Database locked**:

```bash
# Remove the database file and restart
rm chat.db
```

**Import errors**:

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port already in use**:

```bash
npm run dev -- --port 3001
```

**Dependency conflicts**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**WebSocket connection failed**:

- Make sure the backend is running on port 8000
- Check that CORS is properly configured
- Check browser console for error messages

## Performance Tips

1. **Message Pagination**: Limit messages fetched from database
2. **Connection Pooling**: Use connection pooling for database
3. **Caching**: Implement caching for user searches
4. **Compression**: Enable gzip compression on responses
5. **WebSocket Optimization**: Handle multiple connections efficiently

## Future Enhancements

- [ ] Group chats
- [ ] File sharing
- [ ] Message reactions/emojis
- [ ] User presence (online/offline status)
- [ ] Message search
- [ ] User profiles with bio and profile pictures
- [ ] Message notifications
- [ ] Dark mode
- [ ] Typing indicators
- [ ] Message editing and deletion

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the project repository.
