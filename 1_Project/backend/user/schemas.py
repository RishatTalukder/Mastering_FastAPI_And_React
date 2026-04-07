from pydantic import BaseModel, ConfigDict, Field

class User(BaseModel):
    username: str
    email: str
    password: str = Field(exclude=True)

    model_config = ConfigDict(from_attributes=True)