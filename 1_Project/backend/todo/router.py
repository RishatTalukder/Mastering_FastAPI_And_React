from fastapi import APIRouter, status, Response, Query, Path, Body
from utils.dummy import dummy_todo
from enum import Enum
from todo.schemas import Todo, Todo_Request
router = APIRouter(
    prefix="/todo",
    tags=["todo"],
)

@router.get(
    "/",
    response_model=list[Todo],
    summary="Get all todo items",
)
async def root():
    """
    - **This endpoint will return a list of all todo items in the database.**
    """
    return dummy_todo

@router.get("/items/{item_id}")
async def read_item(item_id : int, response: Response) -> dict:
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
    

@router.post(
        "/new_todo", 
        response_model=Todo
)
async def create_todo(todo: Todo_Request):
    return todo

@router.post(
    "/new_todo/{id}",
)
async def update_todo(
    todo: Todo_Request = Body(...), 
    id: int = Path(..., title="The ID of the todo to update"),
    query: str | None = Query(None, title="An optional query string")
    ):
    return {
        "id": id,
        "data": todo,
        "query": query
    }