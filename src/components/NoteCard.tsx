"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import type { Note } from "@/hooks/useNotesStore";
import { NoteForm } from "./NoteForm";

type NoteCardProps = {
  note: Note;
  onEdit: (id: string, data: { title: string; content: string; tags: string[] }) => void;
  onDelete: (id: string) => void;
};

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <NoteForm
        initial={note}
        onCancel={() => setIsEditing(false)}
        onSubmit={(data) => {
          onEdit(note.id, data);
          setIsEditing(false);
        }}
        compact
      />
    );
  }

  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{note.title || "Untitled note"}</h2>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-primary hover:text-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition hover:border-red-400 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
      {note.content ? <p className="whitespace-pre-wrap text-sm text-slate-700">{note.content}</p> : null}
      {note.tags.length ? (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
