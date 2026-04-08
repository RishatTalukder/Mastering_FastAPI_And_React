from fastapi import APIRouter, Depends, status, HTTPException
from .schemas import User
from .models import User as UserModel
from sqlalchemy.orm import Session
from database import get_db
from pwdlib import PasswordHash
from auth.oauth import oauth2_schema, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

password_hash = PasswordHash.recommended()

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

def get_current_user(
    token: str = Depends(oauth2_schema),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user = db.query(UserModel).filter(UserModel.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not find user",
        )
    return user

@router.get("/me", response_model=User)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

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
