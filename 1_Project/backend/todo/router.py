from fastapi import (
    APIRouter,
    status,
    Response,
    Query,
    Path,
    Body,
    Depends,
    HTTPException,
)
from utils.dummy import dummy_todo
from enum import Enum
from todo.schemas import Todo, Todo_Request, Todo_Title
from database import get_db
from sqlalchemy.orm import Session, load_only
from todo.models import Todo as TodoModel
from auth.oauth import oauth2_schema
from user.router import get_current_user
from user.models import User as UserModel

router = APIRouter(
    prefix="/todo",
    tags=["todo"],
)


@router.get(
    "/",
    response_model=list[Todo_Title],
    summary="Get all todo items",
)
async def root(
    db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)
):
    """
    - **This endpoint will return a list of all todo items in the database.**
    """
    return (
        db.query(TodoModel)
        .filter(TodoModel.user_id == current_user.id)
        .order_by(TodoModel.id.desc())
        .all()
    )


# class PredefinedEndpoints(str, Enum):
#     life = "life"
#     universe = "universe"
#     everything = "everything"


# @router.get("/items/type/{item_type}")
# async def read_item_type(item_type: PredefinedEndpoints, q: str | None = None):
#     return {"item_type": item_type, "q": q}


@router.post("/new_todo", response_model=Todo)
async def create_todo(
    request: Todo_Request,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    new_todo = TodoModel(
        title=request.title,
        description=request.description,
        completed=request.completed,
        user_id=current_user.id,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@router.get(
    "/{id}",
    response_model=Todo,
    summary="Get todo by id",
)
async def get_todo(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    - **This endpoint will return a todo by id.**
    """
    todo = (
        db.query(TodoModel)
        .filter(TodoModel.id == id, TodoModel.user_id == current_user.id)
        .first()
    )

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    return todo


@router.put(
    "/{item_id}/update",
    response_model=Todo,
    summary="Update a todo item",
)
async def update_todo(
    item_id: int,
    todo: Todo_Request,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    - **This endpoint will update a todo item in the database.**
    """

    todo_model = (
        db.query(TodoModel)
        .filter(TodoModel.id == item_id, TodoModel.user_id == current_user.id)
        .first()
    )

    if not todo_model:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo_model.title = todo.title
    todo_model.description = todo.description
    todo_model.completed = todo.completed
    db.commit()
    db.refresh(todo_model)
    return todo_model


@router.delete(
    "/{id}/delete",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a todo item",
)
async def delete_todo(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    - **This endpoint will delete a todo item from the database.**
    """
    deleted = (
        db.query(TodoModel)
        .filter(
            TodoModel.id == id,
            TodoModel.user_id == current_user.id,
        )
        .delete()
    )

    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
