export type Book = {
  id: number;
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
  createdAt?: Date;
}
export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export type BookQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
}

export type CreateBookDto = {
  title: string;
  author: string;
  isbn: string;
  pages: number;
  rating: number;
}
