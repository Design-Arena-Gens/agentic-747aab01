"use client";

import { useMemo, useState } from "react";
import { NoteCard } from "@/components/NoteCard";
import { NoteForm } from "@/components/NoteForm";
import { TagFilter } from "@/components/TagFilter";
import { useNotesStore } from "@/hooks/useNotesStore";
import { MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const { notes, addNote, updateNote, deleteNote, clearAll } = useNotesStore();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  const tags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTag = activeTag ? note.tags.includes(activeTag) : true;
      if (!matchesTag) return false;
      if (!search.trim()) return true;
      const query = search.trim().toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.includes(query))
      );
    });
  }, [notes, activeTag, search]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 bg-slate-100 px-4 pb-16 pt-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Mobile Notes</h1>
          <button
            onClick={() => setShowNewForm((current) => !current)}
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-primary/90"
          >
            <PencilSquareIcon className="h-5 w-5" />
            {showNewForm ? "Close" : "New Note"}
          </button>
        </div>
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 h-5 w-5 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes or tags"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      </header>

      {showNewForm ? (
        <NoteForm
          onSubmit={(data) => {
            addNote(data);
            setShowNewForm(false);
          }}
        />
      ) : null}

      <section className="flex flex-1 flex-col gap-4 pb-20">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(id, data) => updateNote(id, data)}
              onDelete={deleteNote}
            />
          ))
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
            <p className="text-lg font-semibold text-slate-700">No notes yet</p>
            <p className="text-sm text-slate-500">
              Tap <span className="font-medium">New Note</span> to capture your next big idea.
            </p>
          </div>
        )}
      </section>

      {notes.length ? (
        <button
          onClick={() => {
            const confirmed = window.confirm("Delete all notes?");
            if (confirmed) clearAll();
          }}
          className="fixed bottom-6 left-1/2 z-20 w-[90%] max-w-xs -translate-x-1/2 rounded-full border border-red-200 bg-white py-3 text-center text-sm font-semibold text-red-500 shadow-lg transition hover:border-red-400 hover:bg-red-50"
        >
          Clear All Notes
        </button>
      ) : null}
    </main>
  );
}
