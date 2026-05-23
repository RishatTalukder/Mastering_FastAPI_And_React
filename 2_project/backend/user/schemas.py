"""
User request/response schemas
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for user registration"""

    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""

    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for user response"""

    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserSearchResponse(BaseModel):
    """Schema for user search results"""

    id: int
    username: str
    full_name: Optional[str]
    email: str

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Schema for detailed user profile"""

    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
