from fastapi import APIRouter, status, Response
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
async def read_item(item_id : int, response: Response):
    if item_id > 10:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "item_id should be less than 10"}

    return {"item_id": item_id}


class PredefinedEndpoints(str, Enum):
    life = "life"
    universe = "universe"
    everything = "everything"

@router.get("/items/type/{item_type}")
async def read_item_type(item_type: PredefinedEndpoints, q: str | None = None):
    return {"item_type": item_type, "q": q}
    