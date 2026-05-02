const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export type ApiNote = {
  id: string;
  title: string;
  content: string;
  folder_id?: string | null;
  created_at?: string;
  tags?: string[] | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const notesApi = {
  list: () => request<ApiNote[]>("/notes"),
  get: (id: string) => request<ApiNote>(`/notes/${id}`),
  create: (body: { title: string; content: string; folder_id?: string | null; tags?: string[] | null }) =>
    request<ApiNote[] | ApiNote>("/notes", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: { title: string; content: string; folder_id?: string | null; tags?: string[] | null }) =>
    request<ApiNote[] | ApiNote>(`/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

export function unwrapNote(payload: ApiNote[] | ApiNote): ApiNote {
  if (Array.isArray(payload)) return payload[0] as ApiNote;
  return payload;
}

export type ApiFolder = {
  id: string;
  name: string;
};

export const foldersApi = {
  list: () => request<ApiFolder[]>("/folders"),
};

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
