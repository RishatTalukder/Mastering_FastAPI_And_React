from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship


class Todo(Base):
    __tablename__ = "todo"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    completed = Column(Boolean)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="todos")