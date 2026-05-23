# Quick Start Guide

Get the chat application running in minutes!

## Prerequisites

- Python 3.8+
- Node.js 16+
- Terminal/Command Line

## Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend directory
cd 2_project/backend

# Create virtual environment
python -m venv env

# Activate environment
source env/bin/activate          # macOS/Linux
# or
env\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

✅ Backend runs on `http://localhost:8000`

## Step 2: Frontend Setup (Terminal 2)

```bash
# Navigate to frontend directory
cd 2_project/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend runs on `http://localhost:3000`

## Step 3: Test the Application

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" and create an account
3. Log in with your credentials
4. Open another browser window/incognito and create another account
5. Use the search bar to find the other user
6. Click on them to open a chat
7. Send messages - they should appear in real-time! 💬

## Common Issues & Solutions

### Backend Port Already in Use

```bash
uvicorn main:app --reload --port 8001
```

Then update frontend `vite.config.js` proxy target to `http://localhost:8001`

### Frontend Port Already in Use

```bash
npm run dev -- --port 3001
```

### Database Error

```bash
# Remove and recreate database
rm backend/chat.db
```

### WebSocket Connection Failed

- Ensure backend is running
- Check that token is properly stored in localStorage
- Look for errors in browser console (F12)

### Module Not Found

```bash
# Backend
pip install -r requirements.txt --force-reinstall

# Frontend
rm -rf node_modules
npm install
```

## Key Files to Know

**Backend**:

- `backend/main.py` - FastAPI app setup
- `backend/database.py` - Database configuration
- `backend/auth/oauth.py` - JWT and password utilities
- `backend/chat/websocket.py` - Real-time messaging

**Frontend**:

- `frontend/src/App.jsx` - Main app component
- `frontend/src/api/api.js` - API client setup
- `frontend/src/components/ChatWindow.jsx` - Chat interface
- `frontend/src/context/AuthProvider.jsx` - Authentication logic

## API Documentation

After starting backend, visit: `http://localhost:8000/docs`

This shows all available API endpoints and lets you test them directly.

## Next Steps

- Read [docs/README.md](../docs/README.md) for detailed documentation
- Customize the styling by modifying `.css` files
- Add features like group chats, file sharing, etc.
- Deploy to production (see docs for guidelines)

## Support

For issues or questions:

1. Check the documentation
2. Look at browser console (F12) for errors
3. Check terminal output for backend errors
4. Open an issue with error details

Happy chatting! 🎉
