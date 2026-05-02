from fastapi import APIRouter
from pydantic import BaseModel
from app.supabase_client import supabase

router = APIRouter()


class TaskCreate(BaseModel):
    title: str
    completed: bool = False
    due_date: str | None = None


@router.post("/")
def create_task(task: TaskCreate):
    data = supabase.table("tasks").insert(task.dict()).execute()
    return data.data


@router.get("/")
def get_tasks():
    return supabase.table("tasks").select("*").execute().data


@router.put("/{task_id}")
def update_task(task_id: str, task: TaskCreate):
    data = supabase.table("tasks") \
        .update(task.dict()) \
        .eq("id", task_id) \
        .execute()
    return data.data


@router.delete("/{task_id}")
def delete_task(task_id: str):
    supabase.table("tasks").delete().eq("id", task_id).execute()
    return {"deleted": True}