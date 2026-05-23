"""
WebSocket router for real-time messaging
"""

from fastapi import (
    APIRouter,
    WebSocket,
    WebSocketDisconnect,
    Query,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session
from chat.models import Message
from user.models import User
from database import SessionLocal
from auth.oauth import decode_token
from datetime import datetime
from typing import Dict, Set

router = APIRouter(prefix="/ws", tags=["websocket"])

# Store active WebSocket connections
# Structure: {user_id: {other_user_id: websocket}}
active_connections: Dict[int, Dict[int, WebSocket]] = {}


async def get_user_from_token(token: str) -> dict:
    """Get user from JWT token"""
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            return None
        return {"id": user_id, "username": payload.get("username")}
    except:
        return None


@router.websocket("/chat/{other_user_id}")
async def websocket_endpoint(
    websocket: WebSocket, other_user_id: int, token: str = Query(...)
):
    """WebSocket endpoint for real-time chat"""
    # Verify token
    user = await get_user_from_token(token)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    current_user_id = user["id"]

    # Check if other user exists
    db = SessionLocal()
    other_user = db.query(User).filter(User.id == other_user_id).first()
    if not other_user:
        db.close()
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db.close()

    # Accept connection
    await websocket.accept()

    # Add connection to active connections
    if current_user_id not in active_connections:
        active_connections[current_user_id] = {}
    active_connections[current_user_id][other_user_id] = websocket

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()

            # Validate message
            if "message" not in data or not data["message"].strip():
                continue

            # Save message to database
            db = SessionLocal()
            db_message = Message(
                sender_id=current_user_id,
                receiver_id=other_user_id,
                content=data["message"],
            )
            db.add(db_message)
            db.commit()
            db.refresh(db_message)

            # Prepare response
            message_data = {
                "id": db_message.id,
                "sender_id": db_message.sender_id,
                "receiver_id": db_message.receiver_id,
                "content": db_message.content,
                "created_at": db_message.created_at.isoformat(),
                "is_read": db_message.is_read,
            }

            db.close()

            # Send message to receiver if connected
            if (
                other_user_id in active_connections
                and current_user_id in active_connections[other_user_id]
            ):
                try:
                    await active_connections[other_user_id][current_user_id].send_json(
                        {"type": "message", "data": message_data}
                    )
                except Exception as e:
                    print(f"Error sending message: {e}")

            # Echo back to sender
            await websocket.send_json({"type": "message", "data": message_data})

    except WebSocketDisconnect:
        # Remove connection when user disconnects
        if current_user_id in active_connections:
            if other_user_id in active_connections[current_user_id]:
                del active_connections[current_user_id][other_user_id]
            if not active_connections[current_user_id]:
                del active_connections[current_user_id]

    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.close(code=status.WS_1011_SERVER_ERROR)
