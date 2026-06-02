import type { Book, BookQueryParams, CreateBookDto, PaginatedResponse } from '../types/book';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/books';

export async function getBooks(params: BookQueryParams = {}): Promise<PaginatedResponse<Book>> {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.search) query.set('search', params.search);

  const response = await fetch(`${BASE_URL}?${query.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch books: ${response.status}`);
  }

  return response.json();
}

export async function createBook(data: CreateBookDto): Promise<Book> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create book: ${response.status}`);
  }

  return response.json();
}
