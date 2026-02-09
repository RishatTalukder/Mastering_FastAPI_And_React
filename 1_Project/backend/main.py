from fastapi import FastAPI
from enum import Enum
from fastapi.middleware.cors import CORSMiddleware
from utils.dummy import dummy_todo

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root()-> list[dict[str, int | str | bool]]:
    return dummy_todo

@app.get("/items/{item_id}")
async def read_item(item_id : int):
    return {"item_id": item_id}


class PredefinedEndpoints(str, Enum):
    life = "life"
    universe = "universe"
    everything = "everything"

@app.get("/items/type/{item_type}")
async def read_item_type(item_type: PredefinedEndpoints, q: str | None = None):
    return {"item_type": item_type, "q": q}