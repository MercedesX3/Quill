from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import notes, folders, tasks, events

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router, prefix="/notes", tags=["Notes"])
app.include_router(folders.router, prefix="/folders", tags=["Folders"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(events.router, prefix="/events", tags=["Events"])