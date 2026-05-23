# Installation & Setup Guide

## Complete Setup Instructions

### Prerequisites

Before starting, ensure you have:

- **Python 3.8 or higher** - Download from https://www.python.org/downloads/
- **Node.js 16 or higher** - Download from https://nodejs.org/
- **Git** (optional, for version control)
- A terminal/command prompt

### Verify Installations

```bash
# Check Python
python --version  # Should be 3.8+

# Check Node.js and npm
node --version    # Should be 16+
npm --version     # Should be 8+
```

## Backend Installation

### 1. Create Virtual Environment

```bash
cd 2_project/backend

# Create virtual environment
python -m venv env

# Activate virtual environment
# macOS/Linux:
source env/bin/activate

# Windows:
env\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM
- `pydantic` - Data validation
- `python-jose` - JWT tokens
- `passlib` - Password hashing
- `websockets` - Real-time messaging
- And more...

### 3. Configure Environment

Create a `.env` file in `backend/` directory if it doesn't exist:

```bash
# 2_project/backend/.env

DATABASE_URL=sqlite:///./chat.db
SECRET_KEY=your-super-secret-key-change-in-production
ENVIRONMENT=development
```

For production, use a strong SECRET_KEY:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Run the Backend

```bash
uvicorn main:app --reload
```

Output should show:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**API Documentation**: Visit http://localhost:8000/docs

## Frontend Installation

### 1. Install Dependencies

```bash
cd 2_project/frontend
npm install
```

This installs:

- `react` & `react-dom` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `vite` - Build tool
- And more...

### 2. Start Development Server

```bash
npm run dev
```

Output should show:

```
VITE v5.0.8 ready in XXX ms

➜ Local:   http://localhost:3000/
```

Open http://localhost:3000 in your browser.

## Verify Everything Works

### Create Test Accounts

1. **Sign Up Account #1**
   - Username: `alice`
   - Email: `alice@example.com`
   - Password: `password123`
   - Full Name: `Alice Smith`

2. **Open Another Browser Window (Incognito)**
   - Sign Up Account #2
   - Username: `bob`
   - Email: `bob@example.com`
   - Password: `password456`
   - Full Name: `Bob Johnson`

### Test Real-time Chat

1. In first window (Alice), search for "bob"
2. Click on Bob to open chat
3. Type a message and send
4. Watch for real-time message delivery! 💬

If messages appear instantly in both windows, everything is working!

## Database Management

### View Database

The SQLite database is stored at:

```
2_project/backend/chat.db
```

To view with SQLite CLI:

```bash
sqlite3 backend/chat.db
.tables              # Show all tables
SELECT * FROM users; # View users
.quit                # Exit
```

### Reset Database

To start fresh:

```bash
# Stop the server first
rm 2_project/backend/chat.db
# Restart the server - new database created automatically
```

## Switching Databases

### PostgreSQL (Recommended for Production)

1. **Install PostgreSQL**: https://www.postgresql.org/download/
2. **Create database**:

   ```sql
   CREATE DATABASE chat_db;
   CREATE USER chat_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE chat_db TO chat_user;
   ```

3. **Update `.env`**:

   ```
   DATABASE_URL=postgresql://chat_user:secure_password@localhost/chat_db
   ```

4. **Install PostgreSQL driver**:

   ```bash
   pip install psycopg2-binary
   ```

5. **Restart backend**

### MySQL

1. **Install MySQL**: https://www.mysql.com/downloads/
2. **Create database**:

   ```sql
   CREATE DATABASE chat_db;
   CREATE USER 'chat_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON chat_db.* TO 'chat_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update `.env`**:

   ```
   DATABASE_URL=mysql+pymysql://chat_user:secure_password@localhost/chat_db
   ```

4. **Install MySQL driver**:

   ```bash
   pip install pymysql
   ```

5. **Restart backend**

## Troubleshooting

### Python Issues

**"python" is not recognized**

- Add Python to PATH (Windows)
- Use `python3` instead of `python` (macOS/Linux)

**"pip is not installed"**

```bash
python -m pip install --upgrade pip
```

**Virtual environment not activating**

```bash
# Try with full path
source ./env/bin/activate  # macOS/Linux
.\env\Scripts\activate.bat # Windows
```

### npm/Node Issues

**"npm" is not recognized**

- Reinstall Node.js from https://nodejs.org/

**npm version conflicts**

```bash
npm install -g npm@latest
```

**Clear npm cache**

```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Backend Errors

**Port 8000 in use**

```bash
# Use different port
uvicorn main:app --reload --port 8001
# Then update frontend proxy in vite.config.js
```

**Database locked**

```bash
rm backend/chat.db
# Restart server
```

**Import errors**

```bash
# Reinstall with fresh dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Errors

**WebSocket connection refused**

- Ensure backend is running on port 8000
- Check browser console for specific error
- Try disabling browser extensions

**CORS errors**

- Backend should be running with CORS enabled
- Check that token is properly saved in localStorage

**Blank page**

- Press F12 to open developer tools
- Check Console tab for JavaScript errors
- Check Network tab to see API requests

## Building for Production

### Backend

```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend

```bash
npm run build
```

This creates optimized files in `frontend/dist/`.

Deploy the `dist` folder to any static hosting (Vercel, Netlify, GitHub Pages, etc.)

## Performance Tips

1. **Backend**: Use PostgreSQL instead of SQLite
2. **Frontend**: Vite already optimizes builds
3. **Database**: Add indexes to frequently queried columns
4. **Caching**: Implement Redis for session caching
5. **WebSockets**: Monitor concurrent connections

## Next Steps

- Read [docs/README.md](docs/README.md) for detailed documentation
- Check [QUICKSTART.md](QUICKSTART.md) for quick reference
- Explore API docs at http://localhost:8000/docs
- Customize styling and features as needed

## Getting Help

1. **Check Documentation** - See docs/ folder
2. **Backend Issues** - Check terminal output
3. **Frontend Issues** - Open browser DevTools (F12)
4. **API Issues** - Visit http://localhost:8000/docs
5. **Search Errors** - Google the error message

Good luck! 🚀
