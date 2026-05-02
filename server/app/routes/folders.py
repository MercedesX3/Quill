from fastapi import APIRouter
from pydantic import BaseModel
from app.supabase_client import supabase

router = APIRouter()


class FolderCreate(BaseModel):
    name: str


@router.post("/")
def create_folder(folder: FolderCreate):
    data = supabase.table("folders").insert({
        "name": folder.name
    }).execute()
    return data.data


@router.get("/")
def get_folders():
    return supabase.table("folders").select("*").execute().data