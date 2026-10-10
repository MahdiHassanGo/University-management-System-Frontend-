import type { ApiResponse } from "@/types";

export { cn } from "cn";
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}
export function extractDataArray<T>(
  response: ApiResponse<T[] | PaginatedData<T>> | T[] | undefined | null,
): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  return Array.isArray(response.data)
    ? response.data
    : response.data?.items || [];
}
export function extractPaginationMeta(response: unknown): PaginationMeta {
  if (response && typeof response === "object") {
    const item = response as {
      data?: { meta?: PaginationMeta };
      meta?: PaginationMeta;
    };
    if (item.data?.meta) return item.data.meta;
    if (item.meta) return item.meta;
  }
  return { page: 1, limit: 10, total: 0, totalPages: 1 };
}
