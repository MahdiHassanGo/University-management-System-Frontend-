export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginatedData<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
export type ListResponse<T> = ApiResponse<T[] | PaginatedData<T>>;
