from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
class User(BaseModel):
    username: str
    email: Optional[str] = None
    password: str = Field(exclude=True)

    model_config = ConfigDict(from_attributes=True)