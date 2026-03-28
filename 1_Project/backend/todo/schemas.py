from pydantic import BaseModel, ConfigDict

class Todo(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

class Todo_Request(BaseModel):
    title: str
    description: str
    completed: bool

class Todo_Title(BaseModel):
    id: int
    title: str

    model_config = ConfigDict(from_attributes=True)