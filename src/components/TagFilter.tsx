"use client";

type TagFilterProps = {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
};

export function TagFilter({ tags, activeTag, onSelect }: TagFilterProps) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      <button
        className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
          activeTag === null
            ? "bg-primary text-white shadow-lg"
            : "bg-white text-slate-600 shadow-sm hover:bg-primary/10 hover:text-primary"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
            activeTag === tag
              ? "bg-primary text-white shadow-lg"
              : "bg-white text-slate-600 shadow-sm hover:bg-primary/10 hover:text-primary"
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
