import type React from 'react';

interface SearchBarProps {
  searchInput: string;
  search: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export default function SearchBar({ searchInput, search, onChange, onSubmit, onClear }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="relative flex items-center">
      <input
        type="text"
        placeholder="Search by title or author..."
        value={searchInput}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] placeholder-[var(--text-faint)] pl-3 pr-20 py-2 w-full outline-none focus:border-[var(--accent)] transition-colors"
      />
      <div className="absolute right-1 flex items-center gap-1">
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="text-[var(--text-faint)] hover:text-[var(--text)] text-xs px-1.5 py-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-xs rounded px-2.5 py-1 cursor-pointer hover:bg-[var(--border)] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
