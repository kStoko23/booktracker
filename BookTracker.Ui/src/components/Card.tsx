import type { Book } from '../types/book';

interface CardProps {
  book: Book;
}

export default function Card({ book }: CardProps) {
  const imageId = (book.id % 100) + 1;

  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--border-subtle)] transition-colors">
      <div className="relative h-40 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${imageId}/400/160`}
          alt={book.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-subtle)] to-transparent" />
        <span className="absolute bottom-2 right-3 text-amber-400 text-xl">
          {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-4 py-3">
        <h3 className="text-sm font-medium text-[var(--text)]">
          {book.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)]">{book.author}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start justify-between px-4 py-3 mt-auto border-t border-[var(--border)] text-xs text-[var(--text-faint)]">
        <span>
          <span className="font-mono">ISBN: </span>
          {book.isbn}
        </span>
        <span>{book.pages} pages</span>
      </div>
    </div>
  );
}
