"""
Chat and messaging router (send messages, fetch conversation history, etc.)
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from database import get_db
from chat.models import Message
from user.models import User
from chat.schemas import (
    MessageCreate,
    MessageResponse,
    ConversationMessage,
    ConversationResponse,
)
from auth.oauth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/messages", response_model=MessageResponse)
async def send_message(
    message: MessageCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message to another user"""
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Receiver not found"
        )

    # Create message
    db_message = Message(
        sender_id=current_user["id"],
        receiver_id=message.receiver_id,
        content=message.content,
    )

    db.add(db_message)
    db.commit()
    db.refresh(db_message)

    return db_message


@router.get("/messages/{user_id}", response_model=list[ConversationMessage])
async def get_conversation(
    user_id: int,
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get conversation history with another user"""
    # Check if user exists
    other_user = db.query(User).filter(User.id == user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Get messages between current user and other user
    messages = (
        db.query(Message)
        .filter(
            or_(
                and_(
                    Message.sender_id == current_user["id"],
                    Message.receiver_id == user_id,
                ),
                and_(
                    Message.sender_id == user_id,
                    Message.receiver_id == current_user["id"],
                ),
            )
        )
        .order_by(desc(Message.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )

    # Mark received messages as read
    db.query(Message).filter(
        and_(
            Message.receiver_id == current_user["id"],
            Message.sender_id == user_id,
            Message.is_read == 0,
        )
    ).update({"is_read": 1})
    db.commit()

    # Reverse to get chronological order
    messages.reverse()

    return messages


@router.get("/conversations")
async def get_conversations(
    current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get list of all conversations for current user"""
    # Get all unique users that current user has messaged
    query = (
        db.query(
            User.id,
            User.username,
            User.full_name,
            Message.content.label("last_message"),
            Message.created_at.label("last_message_time"),
        )
        .join(
            Message,
            or_(
                and_(
                    Message.sender_id == current_user["id"],
                    Message.receiver_id == User.id,
                ),
                and_(
                    Message.sender_id == User.id,
                    Message.receiver_id == current_user["id"],
                ),
            ),
        )
        .distinct(User.id)
        .order_by(User.id, desc(Message.created_at))
    )

    results = query.all()

    conversations = []
    seen_users = set()

    for result in results:
        if result.id not in seen_users:
            seen_users.add(result.id)

            # Count unread messages
            unread_count = (
                db.query(Message)
                .filter(
                    and_(
                        Message.sender_id == result.id,
                        Message.receiver_id == current_user["id"],
                        Message.is_read == 0,
                    )
                )
                .count()
            )

            conversations.append(
                {
                    "user_id": result.id,
                    "username": result.username,
                    "full_name": result.full_name,
                    "last_message": result.last_message,
                    "last_message_time": result.last_message_time,
                    "unread_count": unread_count,
                }
            )

    return conversations
