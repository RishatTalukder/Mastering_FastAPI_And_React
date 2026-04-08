from database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=False, index=False)
    password = Column(String)

    todos = relationship("Todo", back_populates="user", cascade="all, delete")