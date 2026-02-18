from pydantic import BaseModel

class Todo(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

class Todo_Request(BaseModel):
    title: str
    description: str
    completed: bool