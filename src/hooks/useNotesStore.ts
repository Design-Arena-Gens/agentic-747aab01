import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
};

type NotesState = {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "updatedAt">) => void;
  updateNote: (id: string, note: Partial<Omit<Note, "id">>) => void;
  deleteNote: (id: string) => void;
  clearAll: () => void;
};

const emptyState: NotesState = {
  notes: [],
  addNote: () => undefined,
  updateNote: () => undefined,
  deleteNote: () => undefined,
  clearAll: () => undefined
};

const isClient = typeof window !== "undefined";
const generateId = (): string => {
  const randomUUID = typeof globalThis.crypto?.randomUUID === "function" ? globalThis.crypto.randomUUID : null;
  if (randomUUID) {
    return randomUUID();
  }

  return `note-${Math.random().toString(36).slice(2, 10)}`;
};

export const useNotesStore = create(
  persist<NotesState>(
    (set) => ({
      ...emptyState,
      addNote: (note) =>
        set((state) => ({
          notes: [
            {
              id: generateId(),
              updatedAt: Date.now(),
              ...note
            },
            ...state.notes
          ]
        })),
      updateNote: (id, note) =>
        set((state) => ({
          notes: state.notes.map((item) =>
            item.id === id
              ? {
                  ...item,
                  ...note,
                  updatedAt: Date.now()
                }
              : item
          )
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((item) => item.id !== id)
        })),
      clearAll: () => set({ notes: [] })
    }),
    {
      name: "mobile-notes-store",
      storage: isClient ? createJSONStorage(() => localStorage) : undefined
    }
  )
);
