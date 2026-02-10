"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/hooks/useNotesStore";
import { twMerge } from "tailwind-merge";

type NoteFormProps = {
  initial?: Pick<Note, "title" | "content" | "tags">;
  onCancel?: () => void;
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void;
  compact?: boolean;
};

const normalizeTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

export function NoteForm({ initial, onCancel, onSubmit, compact }: NoteFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [tagInput, setTagInput] = useState(initial?.tags.join(", ") ?? "");

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setContent(initial.content);
    setTagInput(initial.tags.join(", "));
  }, [initial]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tags = normalizeTags(tagInput);
    onSubmit({ title: title.trim(), content: content.trim(), tags });
    if (!initial) {
      setTitle("");
      setContent("");
      setTagInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={twMerge(
        "flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-lg",
        compact && "shadow-none border border-slate-200"
      )}
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-500" htmlFor="note-title">
          Title
        </label>
        <input
          id="note-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Quick idea..."
          className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-500" htmlFor="note-content">
          Note
        </label>
        <textarea
          id="note-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Capture the details..."
          rows={compact ? 4 : 6}
          className="resize-none rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-500" htmlFor="note-tags">
          Tags
        </label>
        <input
          id="note-tags"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          placeholder="research, errands, ideas"
          className="rounded-xl border border-slate-200 px-4 py-3 text-base text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <p className="text-xs text-slate-400">Separate tags with commas.</p>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-primary/40 transition hover:bg-primary/90"
        >
          Save
        </button>
      </div>
    </form>
  );
}
