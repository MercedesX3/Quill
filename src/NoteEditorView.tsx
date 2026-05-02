import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  CheckSquare,
  ChevronLeft,
  Image as ImageIcon,
  Italic,
  List,
  Menu,
  PencilLine,
  Search,
  Tag,
} from "lucide-react";
import type { ApiNote } from "./lib/api";

type Props = {
  note: ApiNote;
  onBack: () => void;
  onOpenMenu: () => void;
  onSave: (payload: { title: string; content: string; tags: string[] }) => void | Promise<void>;
};

function formatNoteDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .toUpperCase();
}

function plainTextToHtml(text: string): string {
  const t = text.trim();
  if (!t) return "<p><br></p>";
  if (t.includes("<")) return text;
  return text
    .split("\n")
    .map((line) => `<p>${escapeHtml(line) || "<br>"}</p>`)
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function NoteEditorView({ note, onBack, onOpenMenu, onSave }: Props) {
  const [title, setTitle] = useState(note.title);
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef({ title: note.title, tags: note.tags ?? [] });

  useEffect(() => {
    latest.current = { title, tags };
  }, [title, tags]);

  /* eslint-disable react-hooks/set-state-in-effect -- reset editor when the active note from props changes */
  useEffect(() => {
    setTitle(note.title);
    setTags(note.tags ?? []);
    const el = editorRef.current;
    if (el) {
      el.innerHTML = plainTextToHtml(note.content);
    }
  }, [note.id, note.title, note.content, note.tags]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const flushSave = useCallback(() => {
    const el = editorRef.current;
    if (!el) return Promise.resolve();
    return onSave({
      title: latest.current.title,
      content: el.innerHTML,
      tags: latest.current.tags,
    });
  }, [onSave]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => flushSave(), 700);
  }, [flushSave]);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    scheduleSave();
  };

  const addTag = () => {
    const next = window.prompt("Tag name");
    if (next?.trim()) {
      setTags((t) => {
        const merged = [...t, next.trim()];
        queueMicrotask(() => {
          latest.current = { ...latest.current, tags: merged };
          void flushSave();
        });
        return merged;
      });
    }
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");
    if (url) exec("insertImage", url);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-sm flex-col bg-white text-neutral-900">
      <header className="flex shrink-0 items-center justify-between gap-2 px-3 pb-2 pt-4">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <button
            type="button"
            onClick={() => {
              void Promise.resolve(flushSave()).finally(() => onBack());
            }}
            className="shrink-0 p-1 text-neutral-900"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="truncate text-sm font-semibold">All Notes</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <PencilLine className="h-5 w-5 text-[#c9a227]" aria-hidden />
          <Search className="h-5 w-5 text-neutral-900" aria-hidden />
          <button type="button" onClick={onOpenMenu} className="p-0.5 text-neutral-900" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="h-1 shrink-0 bg-[#8b732e]" />

      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-28 pt-4">
        <p className="font-sans text-xs font-medium uppercase tracking-wide text-black">{formatNoteDate(note.created_at)}</p>

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            scheduleSave();
          }}
          className="mt-3 w-full border-0 bg-transparent p-0 text-2xl font-bold leading-tight text-black outline-none placeholder:text-neutral-400"
          placeholder="Title"
        />

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="mt-4 min-h-[220px] text-sm leading-relaxed text-neutral-600 outline-none [&_li]:my-1 [&_p]:my-2 [&_strong]:text-neutral-900"
          onInput={scheduleSave}
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={`${tag}-${i}`} className="rounded-md bg-[#004030] px-3 py-1.5 text-xs font-medium text-white">
              {tag}
            </span>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-xs text-neutral-400"
          >
            + add
          </button>
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-sm -translate-x-1/2 items-center justify-around border-t border-neutral-200 bg-white px-2 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <button type="button" className="p-2 text-neutral-900" aria-label="Bold" onClick={() => exec("bold")}>
          <Bold className="h-5 w-5" />
        </button>
        <button type="button" className="p-2 text-neutral-900" aria-label="Italic" onClick={() => exec("italic")}>
          <Italic className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-neutral-300" aria-hidden />
        <button type="button" className="p-2 text-neutral-900" aria-label="Bullet list" onClick={() => exec("insertUnorderedList")}>
          <List className="h-5 w-5" />
        </button>
        <button type="button" className="p-2 text-neutral-900" aria-label="Checklist" onClick={() => exec("insertUnorderedList")}>
          <CheckSquare className="h-5 w-5" />
        </button>
        <button type="button" className="p-2 text-neutral-900" aria-label="Insert image" onClick={insertImage}>
          <ImageIcon className="h-5 w-5" />
        </button>
        <button type="button" className="p-2 text-neutral-900" aria-label="Add tag" onClick={addTag}>
          <Tag className="h-5 w-5" />
        </button>
      </footer>
    </div>
  );
}
