"use client";
import { useSearchParams } from "next/navigation";
export function useListParams() {
  const params = useSearchParams();
  return {
    page: Math.max(1, Math.floor(Number(params.get("page")) || 1)),
    limit: 10,
    sortBy: "createdAt",
    sortOrder:
      params.get("sortOrder") === "asc" ? ("asc" as const) : ("desc" as const),
    ...(params.get("searchTerm")
      ? { searchTerm: params.get("searchTerm") || "" }
      : {}),
  };
}
