import { useState } from 'react';
import { createBook } from '../api/books';
import type { CreateBookDto } from '../types/book';

const EMPTY_FORM: CreateBookDto = {
  title: '',
  author: '',
  isbn: '',
  pages: 0,
  rating: 0,
};

type FieldErrors = Partial<Record<keyof CreateBookDto, string>>;

export default function Form({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState<CreateBookDto>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.author.trim()) e.author = 'Author is required';
    if (!form.isbn.trim()) e.isbn = 'ISBN is required';
    if (!form.pages || form.pages <= 0) e.pages = 'Pages must be greater than 0';
    if (!form.rating || form.rating < 1 || form.rating > 5) e.rating = 'Rating must be between 1 and 5';
    return e;
  }

  function handleChange(field: keyof CreateBookDto, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSuccess(false);

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createBook(form);
      setForm(EMPTY_FORM);
      setErrors({});
      setServerErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onSuccess?.();
    } catch (err: unknown) {
      if (err instanceof Response) {
        const body = await err.json();
        if (body?.errors) setServerErrors(body.errors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fieldError = (field: keyof CreateBookDto) =>
    errors[field] || serverErrors[field];

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-5">

      {success && (
        <div className={`absolute top-23 left-1/2 transform -translate-x-1/2 text-sm min-w-[200px] text-[var(--success)] border border-[var(--success)]/30 bg-[var(--success)]/10 rounded-md px-4 py-2 transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-0'}`}>
          Book added successfully.
        </div>
      )}

      <Field label="Title" error={fieldError('title')}>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g. Clean Code"
          className={inputClass(!!fieldError('title'))}
        />
      </Field>

      <Field label="Author" error={fieldError('author')}>
        <input
          type="text"
          value={form.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="e.g. Robert C. Martin"
          className={inputClass(!!fieldError('author'))}
        />
      </Field>

      <Field label="ISBN" error={fieldError('isbn')}>
        <input
          type="text"
          value={form.isbn}
          onChange={(e) => handleChange('isbn', e.target.value)}
          placeholder="e.g. 9780756404741"
          className={inputClass(!!fieldError('isbn'))}
        />
      </Field>

      <Field label="Pages" error={fieldError('pages')}>
        <input
          type="number"
          min={1}
          value={form.pages || ''}
          onChange={(e) => handleChange('pages', parseInt(e.target.value) || 0)}
          placeholder="e.g. 662"
          className={inputClass(!!fieldError('pages'))}
        />
      </Field>

      <Field label="Rating" error={fieldError('rating')}>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleChange('rating', star)}
              className={`text-2xl cursor-pointer transition-colors ${
                star <= form.rating ? 'text-amber-400' : 'text-[var(--text-faint)]'
              } hover:text-amber-300`}
            >
              ★
            </button>
          ))}
        </div>
        {fieldError('rating') && (
          <p className="text-xs text-[var(--danger)] mt-1">{fieldError('rating')}</p>
        )}
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="self-start max-sm:mx-auto sm:mt-4 sm:ml-auto w-full sm:max-w-[10rem] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm rounded-md px-5 py-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Adding...' : 'Add book'}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `bg-[var(--bg-subtle)] border ${
    hasError ? 'border-[var(--danger)]' : 'border-[var(--border)]'
  } rounded-md text-sm text-[var(--text)] placeholder-[var(--text-faint)] px-3 py-2 w-full outline-none focus:border-[var(--accent)] transition-colors`;
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[var(--text-muted)] uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}
