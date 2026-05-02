# Quill API (FastAPI)

## One-time setup

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # then edit .env with SUPABASE_URL and SUPABASE_KEY
```

Use the folder name **`.venv`** (or any name you like). Do **not** create a folder literally named `path/to/venv` from old placeholder docs.

If you already used a different venv path, either keep using it or remove it and recreate `.venv` as above, then `pip install -r requirements.txt` again.

## Start the server

From the **`server`** directory (with the venv activated):

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- API: **http://127.0.0.1:8000**
- Interactive docs: **http://127.0.0.1:8000/docs**

Keep this running while you use `npm run dev` in the repo root; the Vite dev proxy forwards `/api` to port 8000.
