import { useEffect, useMemo, useState } from "react";

type Screen = "login" | "home" | "note" | "todo" | "calendar";
type HomeTab = "notes" | "folders";

type NoteItem = {
  id: string;
  title: string;
  date: string;
  color: string;
  tags: string[];
  body: string;
  bullets?: string[];
};

type FolderItem = {
  id: string;
  name: string;
  color: string;
  icon: "briefcase" | "spiral";
};

type TodoGroup = {
  id: string;
  title: string;
  color: string;
  done: number;
  items: string[];
};

const notes: NoteItem[] = [
  {
    id: "roman-empire",
    title: "Roman Empire - Caesar's Empire",
    date: "APR 17 10:29 PM",
    color: "#01533f",
    tags: ["tag 1", "+1"],
    body: "Julius Caesar rose to power during a time of political instability in Rome, ultimately becoming dictator. His rule marked the transition from the Roman Republic toward imperial rule.",
    bullets: [
      "Julius Caesar - military general and dictator who gained control of Rome",
      "Brutus - senator involved in Caesar's assassination",
      "Mark Antony - ally of Caesar who later fought for power",
    ],
  },
  { id: "sticky-blue", title: "Sticky Note", date: "DATE 00", color: "#0b327d", tags: ["tag 1", "+1"], body: "Description of the sticky note" },
  { id: "sticky-rose", title: "Sticky Note", date: "DATE 00", color: "#7a1d4b", tags: ["tag 1", "+1"], body: "To do list 1\nTo do list 2\nTo do list 3" },
  { id: "sticky-gold", title: "Sticky Note", date: "DATE 00", color: "#8d6f1f", tags: ["tag 1", "+1"], body: "To do list 1\nTo do list 2\nTo do list 3" },
];

const folders: FolderItem[] = [
  { id: "f1", name: "Intro to ML", color: "#3a856f", icon: "briefcase" },
  { id: "f2", name: "ACM", color: "#cca53f", icon: "briefcase" },
  { id: "f3", name: "Intro to ML", color: "#a43369", icon: "briefcase" },
  { id: "f4", name: "Intro to ML", color: "#6f87e2", icon: "spiral" },
  { id: "f5", name: "Intro to ML", color: "#a43369", icon: "briefcase" },
  { id: "f6", name: "Intro to ML", color: "#6f87e2", icon: "spiral" },
];

const todoGroups: TodoGroup[] = [
  { id: "t1", title: "Launch Checklist", color: "#04553f", done: 3, items: ["Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac"] },
  { id: "t2", title: "Launch Checklist", color: "#0b327d", done: 3, items: ["Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac", "Final QA on Windows + Mac"] },
];

const GoogleMark = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const App = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [tab, setTab] = useState<HomeTab>("notes");
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0].id);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) ?? notes[0],
    [selectedNoteId],
  );

  useEffect(() => {
    chrome.storage.local.get(["selectedNoteId"], (result: { selectedNoteId?: string }) => {
      if (result.selectedNoteId) setSelectedNoteId(result.selectedNoteId);
    });
  }, []);

  const openNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    chrome.storage.local.set({ selectedNoteId: noteId });
    setScreen("note");
  };

  const navigateFromSidebar = (next: Screen) => {
    setScreen(next);
    setSidebarOpen(false);
  };

  const topBar = (title: string, showBack = false) => (
    <header className="mb-4 flex items-center justify-between">
      <div className="flex w-10 items-center justify-start">
        {showBack ? (
          <button type="button" onClick={() => setScreen("home")} className="text-xl text-neutral-900" aria-label="Back">
            ‹
          </button>
        ) : (
          <div className="h-9 w-9 rounded-full bg-neutral-300" />
        )}
      </div>
      <h2 className="text-[1.25rem] font-medium tracking-tight">{title}</h2>
      <div className="flex w-16 items-center justify-end gap-3 text-xl text-neutral-900">
        <span aria-hidden>⌕</span>
        <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          ☰
        </button>
      </div>
    </header>
  );

  const sidebar = screen !== "login" && isSidebarOpen && (
    <div className="fixed inset-0 z-30 mx-auto w-full max-w-sm bg-black/20">
      <button type="button" className="absolute inset-0" onClick={() => setSidebarOpen(false)} aria-label="Close menu overlay" />
      <aside className="absolute right-0 top-0 h-full w-[82%] bg-white px-7 py-10 shadow-xl">
        <nav className="mt-6 space-y-4 text-center">
          {[
            { label: "Home", value: "home" },
            { label: "To Do List", value: "todo" },
            { label: "Calendar", value: "calendar" },
          ].map((item) => {
            const isActive = screen === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => navigateFromSidebar(item.value as Screen)}
                className={`group relative block w-full py-1 text-2xl font-semibold ${isActive ? "text-neutral-900" : "text-neutral-700"}`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 bg-neutral-900 transition-all duration-300 ${isActive ? "w-0" : "w-0 group-hover:w-28"}`}
                />
              </button>
            );
          })}
        </nav>
        <button type="button" className="absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-3 text-4xl font-semibold text-neutral-400" onClick={() => navigateFromSidebar("login")}>
          Logout <span aria-hidden>↪</span>
        </button>
      </aside>
    </div>
  );

  if (screen === "note") {
    return (
      <>
        <div className="mx-auto min-h-svh w-full max-w-sm bg-white px-4 pb-8 pt-5 text-neutral-900">
          <header className="mb-4 flex items-center justify-between gap-2">
            <button type="button" onClick={() => setScreen("home")} className="shrink-0 text-xl text-neutral-900" aria-label="Back">
              ‹
            </button>
            <h2 className="text-center text-base font-semibold tracking-tight sm:text-lg">All Notes</h2>
            <div className="flex shrink-0 items-center gap-3 text-lg text-neutral-900">
              <span aria-hidden>✎</span>
              <span aria-hidden>⌕</span>
              <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
                ☰
              </button>
            </div>
          </header>

          <div className="mb-4 h-0.5 w-full bg-[#8b6f1f]" />
          <p className="font-mono text-xs uppercase tracking-wider text-neutral-500">{selectedNote.date}</p>
          <h1 className="mt-3 text-2xl font-semibold leading-snug tracking-tight text-neutral-950 sm:text-3xl">{selectedNote.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500 sm:text-base">{selectedNote.body}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {selectedNote.tags.map((tag) => (
              <span key={tag} className="rounded bg-[#01533f] px-2.5 py-1 text-xs font-medium text-white">
                {tag}
              </span>
            ))}
            <button type="button" className="rounded border border-dashed border-neutral-400 px-2.5 py-1 text-xs text-neutral-400">
              + add
            </button>
          </div>
          <h3 className="mt-6 text-lg font-semibold tracking-tight">Key People</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {(selectedNote.bullets ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-6 text-lg font-semibold tracking-tight">Key People</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
            {(selectedNote.bullets ?? []).map((item, index) => (
              <li key={`${item}-${index}`} className={index === 2 ? "text-neutral-400" : "text-neutral-900"}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        {sidebar}
      </>
    );
  }

  if (screen === "todo") {
    return (
      <>
        <div className="mx-auto min-h-svh w-full max-w-sm bg-white px-4 pb-24 pt-4 text-neutral-900">
          {topBar("To-Do")}
          <div className="mb-3 h-px w-full bg-neutral-200" />
          <div className="space-y-7">
            {todoGroups.map((group) => (
              <section key={group.id} className="overflow-hidden border border-neutral-300">
                <div className="flex items-center justify-between px-3 py-2 text-white" style={{ backgroundColor: group.color }}>
                  <h3 className="text-xl font-medium">{group.title}</h3>
                  <p className="font-mono text-2xl">{group.done}/6</p>
                </div>
                {group.items.map((item, idx) => (
                  <div key={`${group.id}-${idx}`} className="flex items-center justify-between border-t border-neutral-300 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`h-4 w-4 border ${idx < group.done ? "bg-[#04553f]" : "bg-transparent"}`} style={{ borderColor: group.color }} />
                      <p className={`text-sm ${idx < group.done ? "text-neutral-500 line-through" : "text-neutral-900"}`}>{item}</p>
                    </div>
                    {idx === 3 && (
                      <span className="bg-[#a43369] px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">Due Today</span>
                    )}
                  </div>
                ))}
                <div className="border-t border-neutral-300 px-3 py-2.5 text-neutral-400">+ Add an item</div>
              </section>
            ))}
          </div>

          <div className="fixed bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 px-4">
            <button type="button" className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white">
              <span aria-hidden>+</span> Add New To Do List
            </button>
          </div>
        </div>
        {sidebar}
      </>
    );
  }

  if (screen === "calendar") {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const rows = [
      ["", "", "", "1", "2", "3", "4"],
      ["5", "6", "7", "8", "9", "10", "11"],
      ["12", "13", "14", "15", "16", "17", "18"],
      ["19", "20", "21", "22", "23", "24", "25"],
      ["26", "27", "28", "29", "30", "", ""],
    ];

    return (
      <>
        <div className="mx-auto min-h-svh w-full max-w-sm bg-white px-4 pb-8 pt-4 text-neutral-900">
          {topBar("Calendar")}
          <div className="mb-4 h-px w-full bg-neutral-200" />
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">April 2026</h3>
            <p className="text-3xl tracking-[0.5em] text-neutral-900">‹›</p>
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {days.map((day) => (
              <p key={day} className="font-mono text-xs text-neutral-500">
                {day}
              </p>
            ))}
            {rows.flat().map((day, idx) => (
              <div key={`d-${idx}`} className="flex h-9 items-center justify-center">
                {day === "17" ? (
                  <div className="flex h-9 w-9 flex-col items-center justify-center bg-black text-sm text-white">
                    17
                    <span className="text-[8px]">•</span>
                  </div>
                ) : (
                  <span className={`text-sm ${day ? "text-neutral-900" : "text-transparent"}`}>
                    {day || "."}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-3xl font-semibold">Today - 3 notes</h4>
              <p className="font-mono text-sm text-neutral-400">APR 18, 2026</p>
            </div>
            {["#cca53f", "#3a856f", "#a43369", "#0b327d"].map((color, idx) => (
              <div key={color} className="mb-3 flex gap-3">
                <div className="w-1" style={{ backgroundColor: color }} />
                <div>
                  <p className="text-sm text-neutral-500">
                    <span className="font-mono">09:14 AM</span> &nbsp; Thesis - Chapter 3
                  </p>
                  <p className="text-sm text-neutral-500">Roman Empire transition notes....</p>
                </div>
                {idx > 2 ? null : null}
              </div>
            ))}
          </div>
        </div>
        {sidebar}
      </>
    );
  }

  if (screen === "home") {
    return (
      <>
        <div className="mx-auto min-h-svh w-full max-w-sm bg-white px-4 pb-24 pt-4 text-neutral-900">
          {topBar("Home")}
          <div className="mb-3 h-px w-full bg-neutral-200" />
          <div className="mb-4 grid grid-cols-2 ">
            <button type="button" onClick={() => setTab("notes")} className={`pb-2 text-sm font-semibold ${tab === "notes" ? "text-neutral-900" : "text-neutral-400"}`}>
              All Notes
              <div className={`mx-auto mt-2 h-0.5 w-16 ${tab === "notes" ? "bg-neutral-900" : "bg-neutral-200"}`} />
            </button>
            <button type="button" onClick={() => setTab("folders")} className={`pb-2 text-sm font-semibold ${tab === "folders" ? "text-neutral-900" : "text-neutral-400"}`}>
              Folders
              <div className={`mx-auto mt-2 h-0.5 w-16 ${tab === "folders" ? "bg-neutral-900" : "bg-neutral-200"}`} />
            </button>
          </div>
          {tab === "notes" ? (
            <div className="grid grid-cols-2 gap-3">
              {notes.map((note) => (
                <button key={note.id} type="button" onClick={() => openNote(note.id)} className="flex min-h-44 flex-col rounded-lg p-2.5 text-left text-white shadow-sm" style={{ backgroundColor: note.color }}>
                  <p className="font-mono text-[10px] uppercase tracking-wide opacity-90">{note.date}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-tight">{note.title}</p>
                  <div className="mt-2 h-px w-full bg-white/80" />
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <span key={tag} className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto font-mono text-[10px] leading-snug opacity-90">
                    {note.body.split("\n").slice(0, 3).map((line) => (
                      <p key={line}>• {line}</p>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {folders.map((folder) => (
                <div key={folder.id} className="flex min-h-44 flex-col items-center justify-center rounded-lg px-2 py-4 text-center text-white shadow-sm" style={{ backgroundColor: folder.color }}>
                  <span className="text-2xl" aria-hidden>
                    {folder.icon === "briefcase" ? "☐" : "◎"}
                  </span>
                  <p className="mt-2 text-sm font-semibold leading-tight">{folder.name}</p>
                </div>
              ))}
            </div>
          )}

          <div className="fixed bottom-4 left-1/2 w-full max-w-sm -translate-x-1/2 px-4">
            <button type="button" className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-md">
              <span aria-hidden>+</span>
              {tab === "notes" ? "Add New Note" : "Add New Folder"}
            </button>
          </div>
        </div>
        {sidebar}
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center bg-white px-5 py-6 text-neutral-900">
      <div className="mb-5 flex shrink-0 justify-center">
        <div className="relative h-20 w-20 rotate-[-16deg] rounded-md border-4 border-[#4f87ff]">
          <div className="absolute -right-2 top-3 rotate-12 text-3xl leading-none text-[#d3a11d]">✎</div>
          <div className="absolute -left-1 top-3 text-xl leading-none text-[#4f87ff]">⊏</div>
        </div>
      </div>
      <h1 className="text-center text-xl font-semibold leading-tight text-[#1e535c] sm:text-2xl">Home for NoteTakers</h1>
      <p className="mt-3 px-1 text-center font-mono text-xs leading-relaxed text-neutral-800 sm:text-[13px]">
        &ldquo;What day is it?&rdquo; asked Pooh.
        <br />
        &ldquo;It&apos;s today,&rdquo; squeaked Piglet.
        <br />
        &ldquo;My favorite day,&rdquo; said Pooh
      </p>
      <div className="mt-5 space-y-2.5">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500" />
      </div>
      <button type="button" onClick={() => setScreen("home")} className="mt-5 w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-900">
        Login
      </button>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-neutral-300" />
        <span className="text-xs font-medium text-neutral-500">Or</span>
        <div className="h-px flex-1 bg-neutral-300" />
      </div>
      <button type="button" onClick={() => setScreen("home")} className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-neutral-100 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200">
        <GoogleMark />
        Sign In With Google
      </button>
    </div>
  );
};

export default App;
