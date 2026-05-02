from fastapi import APIRouter
from pydantic import BaseModel
from app.supabase_client import supabase

router = APIRouter()


class EventCreate(BaseModel):
    title: str
    start_time: str
    end_time: str


@router.post("/")
def create_event(event: EventCreate):
    data = supabase.table("events").insert(event.dict()).execute()
    return data.data


@router.get("/")
def get_events():
    return supabase.table("events").select("*").execute().data


@router.delete("/{event_id}")
def delete_event(event_id: str):
    supabase.table("events").delete().eq("id", event_id).execute()
    return {"deleted": True}