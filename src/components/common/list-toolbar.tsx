"use client";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
export default function ListToolbar() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = params.get("searchTerm") || "";
  const [search, setSearch] = useState(query);
  useEffect(() => setSearch(query), [query]);
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.replace(`${pathname}?${next}`);
  };
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex gap-2 w-full sm:w-auto">
        <input
          aria-label="Search records"
          placeholder="Search code or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("searchTerm", search.trim());
          }}
          className="min-w-0 flex-1 rounded-lg border bg-card px-3 py-2 text-sm"
        />
        <Button
          variant="outline"
          onClick={() => update("searchTerm", search.trim())}
        >
          <Search className="size-4" /> Search
        </Button>
        {query && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              update("searchTerm", "");
            }}
          >
            Clear
          </Button>
        )}
      </div>
      <select
        aria-label="Sort by creation date"
        className="rounded-lg border bg-card px-3 py-2 text-sm"
        value={params.get("sortOrder") === "asc" ? "asc" : "desc"}
        onChange={(e) => update("sortOrder", e.target.value)}
      >
        <option value="desc">Newest first</option>
        <option value="asc">Oldest first</option>
      </select>
    </div>
  );
}
