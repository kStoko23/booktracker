import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import type { Book, PaginatedResponse } from '../types/book';
import Card from './Card';
import SearchBar from './SearchBar';

const PAGE_SIZE = 20;

export default function Grid() {
  const [data, setData] = useState<PaginatedResponse<Book> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getBooks({ page, pageSize: PAGE_SIZE, search: search || undefined })
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { if (!cancelled) setError('Failed to load books.'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, search]);

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SearchBar
          searchInput={searchInput}
          search={search}
          onChange={setSearchInput}
          onSubmit={handleSearch}
          onClear={() => { setSearchInput(''); setSearch(''); setPage(1); }}
        />
        {data && (
          <span className="text-xs text-[var(--text-muted)]">{data.totalCount} books</span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-md px-4 py-2">
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="text-center text-[var(--text-faint)] py-16">Loading...</div>
      ) : data?.items.length === 0 ? (
        <div className="text-center text-[var(--text-faint)] py-16">No books found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.items.map((book) => (
            <Card key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-sm rounded-md px-4 py-2 cursor-pointer hover:bg-[var(--border)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-xs text-[var(--text-muted)] min-w-[60px] text-center">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text)] text-sm rounded-md px-4 py-2 cursor-pointer hover:bg-[var(--border)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
