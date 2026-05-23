"""
User management router (search, profile, etc.)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from user.models import User
from user.schemas import UserResponse, UserSearchResponse, UserProfile
from auth.oauth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/search", response_model=list[UserSearchResponse])
async def search_users(
    q: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search for users by username or full name"""
    if not q or len(q) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must be at least 2 characters long",
        )

    # Search for users
    users = (
        db.query(User)
        .filter(
            (User.username.ilike(f"%{q}%")) | (User.full_name.ilike(f"%{q}%")),
            User.id != current_user["id"],  # Exclude current user
            User.is_active == True,
        )
        .limit(20)
        .all()
    )

    return users


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's profile"""
    user = db.query(User).filter(User.id == current_user["id"]).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user


@router.get("/{user_id}", response_model=UserProfile)
async def get_user(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user profile by ID"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user
