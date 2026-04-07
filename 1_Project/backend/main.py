from fastapi import FastAPI
from enum import Enum
from fastapi.middleware.cors import CORSMiddleware
from todo.router import router
from user.router import router as user_router
from database import Base, engine
from todo import models
from user import models
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(user_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome"}

Base.metadata.create_all(bind=engine)