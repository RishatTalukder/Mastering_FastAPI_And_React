from fastapi import APIRouter, Depends
from .schemas import User
from .models import User as UserModel
from sqlalchemy.orm import Session
from database import get_db
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

@router.post("/new_user", response_model=User)
async def create_user(request: User, db: Session = Depends(get_db)):
    new_user = UserModel(
        username=request.username,
        email=request.email,
        password=password_hash.hash(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user