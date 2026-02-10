from fastapi import APIRouter
from utils.dummy import dummy_todo
from enum import Enum
router = APIRouter(
    prefix="/todo",
    tags=["todo"],
)

@router.get("/")
async def root()-> list[dict[str, int | str | bool]]:
    return dummy_todo

@router.get("/items/{item_id}")
async def read_item(item_id : int):
    return {"item_id": item_id}


class PredefinedEndpoints(str, Enum):
    life = "life"
    universe = "universe"
    everything = "everything"

@router.get("/items/type/{item_type}")
async def read_item_type(item_type: PredefinedEndpoints, q: str | None = None):
    return {"item_type": item_type, "q": q}
    