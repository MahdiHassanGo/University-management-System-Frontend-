export { cn } from "cn";

/**
 * Defensively extracts an array from any API response structure:
 * - Direct array: `[ ... ]`
 * - Standard ApiResponse: `{ data: [ ... ] }`
 * - Paginated ApiResponse: `{ data: { items: [ ... ], meta: { ... } } }`
 * - Nested data: `{ data: { data: [ ... ] } }`
 * - Items property: `{ items: [ ... ] }`
 */
export function extractDataArray<T = any>(res: any): T[] {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.result)) return res.result;
  return [];
}

/**
 * Defensively extracts pagination meta from API responses
 */
export function extractPaginationMeta(res: any) {
  return (
    res?.data?.meta ||
    res?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    }
  );
}
