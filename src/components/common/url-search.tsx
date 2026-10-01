"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/debounce.hook";

export default function UrlSearch({
  placeholder = "Search records...",
  paramName = "searchTerm",
}: {
  placeholder?: string;
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get(paramName) || "";
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    const currentParam = searchParams.get(paramName) || "";
    if (debouncedSearch !== currentParam) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set(paramName, debouncedSearch);
        params.set("page", "1"); // Reset to page 1 on new search
      } else {
        params.delete(paramName);
      }
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, paramName, pathname, router, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 text-xs h-9 bg-background"
      />
      <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
