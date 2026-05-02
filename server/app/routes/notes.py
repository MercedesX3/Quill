from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.supabase_client import supabase

router = APIRouter()


# --------------------
# Schema
# --------------------
class NoteCreate(BaseModel):
    title: str
    content: str
    folder_id: str | None = None
    # Requires a `tags` column (e.g. jsonb or text[]) on `notes` in Supabase; omit from DB if unused.
    tags: list[str] | None = None


def _note_row(note: NoteCreate) -> dict:
    row: dict = {
        "title": note.title,
        "content": note.content,
        "folder_id": note.folder_id,
    }
    if note.tags is not None:
        row["tags"] = note.tags
    return row


# --------------------
# CREATE NOTE
# --------------------
@router.post("/")
def create_note(note: NoteCreate):
    data = supabase.table("notes").insert(_note_row(note)).execute()

    return data.data


# --------------------
# GET ALL NOTES
# --------------------
@router.get("/")
def get_notes():
    data = supabase.table("notes").select("*").execute()
    return data.data


# --------------------
# GET SINGLE NOTE
# --------------------
@router.get("/{note_id}")
def get_note(note_id: str):
    data = supabase.table("notes") \
        .select("*") \
        .eq("id", note_id) \
        .single() \
        .execute()

    return data.data


# --------------------
# UPDATE NOTE
# --------------------
@router.put("/{note_id}")
def update_note(note_id: str, note: NoteCreate):
    data = supabase.table("notes") \
        .update(_note_row(note)) \
        .eq("id", note_id) \
        .execute()

    return data.data


# --------------------
# DELETE NOTE
# --------------------
@router.delete("/{note_id}")
def delete_note(note_id: str):
    data = supabase.table("notes") \
        .delete() \
        .eq("id", note_id) \
        .execute()

    return {"deleted": True}