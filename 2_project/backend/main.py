"""
Main FastAPI application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Import routers
from auth.router import router as auth_router
from user.router import router as user_router
from chat.router import router as chat_router
from chat.websocket import router as ws_router

# Import database
from database import Base, engine

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Real-time Chat API",
    description="A real-time chat application built with FastAPI and React",
    version="1.0.0",
)

# Add CORS middleware (must be added before routers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(chat_router)
app.include_router(ws_router)


@app.get("/", tags=["root"])
async def read_root():
    """Root endpoint"""
    return {
        "message": "Welcome to Real-time Chat API",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
