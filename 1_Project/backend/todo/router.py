from fastapi import APIRouter, status, Response, Query, Path, Body, Depends
from utils.dummy import dummy_todo
from enum import Enum
from todo.schemas import Todo, Todo_Request
from database import get_db
from sqlalchemy.orm import Session
from todo.models import Todo as TodoModel

router = APIRouter(
    prefix="/todo",
    tags=["todo"],
)

@router.get(
    "/",
    response_model=list[Todo],
    summary="Get all todo items",
)
async def root(db: Session = Depends(get_db)):
    """
    - **This endpoint will return a list of all todo items in the database.**
    """

    return db.query(TodoModel).order_by(TodoModel.id.desc()).all()


@router.get("/items/{item_id}")
async def read_item(item_id: int, response: Response) -> dict:
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


@router.post("/new_todo", response_model=Todo)
async def create_todo(request: Todo_Request, db: Session = Depends(get_db)):
    new_todo = TodoModel(
        title=request.title,
        description=request.description,
        completed=request.completed,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@router.put(
    "/{item_id}/update",
    response_model=Todo,
    summary="Update a todo item",
)
async def update_todo(
    item_id: int,
    todo: Todo_Request,
    db: Session = Depends(get_db),
):
    """
    - **This endpoint will update a todo item in the database.**
    """

    todo_model = db.query(TodoModel).filter(TodoModel.id == item_id).first()
    todo_model.title = todo.title
    todo_model.description = todo.description
    todo_model.completed = todo.completed
    db.commit()
    db.refresh(todo_model)
    return todo_model
