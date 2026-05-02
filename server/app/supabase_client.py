import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

# Load server/.env when running from repo (cwd may be `server/` or project root)
_server_dir = Path(__file__).resolve().parent.parent
load_dotenv(_server_dir / ".env")
load_dotenv(_server_dir.parent / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_KEY. Copy server/.env.example to server/.env and set both values."
    )

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)