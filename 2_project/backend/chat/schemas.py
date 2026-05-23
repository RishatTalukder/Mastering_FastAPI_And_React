"""
Chat and message request/response schemas
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    """Schema for creating a message"""

    receiver_id: int
    content: str = Field(..., min_length=1, max_length=5000)


class MessageResponse(BaseModel):
    """Schema for message response"""

    id: int
    sender_id: int
    receiver_id: int
    content: str
    created_at: datetime
    is_read: int

    class Config:
        from_attributes = True


class ConversationMessage(BaseModel):
    """Schema for messages in a conversation"""

    id: int
    sender_id: int
    receiver_id: int
    content: str
    created_at: datetime
    is_read: int
    sender_username: Optional[str] = None
    receiver_username: Optional[str] = None

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    """Schema for conversation list"""

    user_id: int
    username: str
    full_name: Optional[str]
    last_message: Optional[str]
    last_message_time: Optional[datetime]
    unread_count: int

    class Config:
        from_attributes = True
