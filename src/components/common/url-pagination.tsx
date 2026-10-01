"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UrlPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
}

export default function UrlPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
}: UrlPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.replace(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    if (totalItems !== undefined) {
      return (
        <div className="text-xs text-muted-foreground pt-3 border-t">
          Showing {totalItems} total {totalItems === 1 ? "record" : "records"}
        </div>
      );
    }
    return null;
  }

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(
    currentPage * pageSize,
    totalItems || currentPage * pageSize,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t text-xs text-muted-foreground">
      <div>
        {totalItems !== undefined ? (
          <span>
            Showing <strong className="text-foreground">{startRecord}</strong>{" "}
            to <strong className="text-foreground">{endRecord}</strong> of{" "}
            <strong className="text-foreground">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <ChevronLeft className="size-3.5" />
          <span>Previous</span>
        </Button>

        <span className="px-2 font-medium text-foreground">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 gap-1 px-2.5 text-xs"
        >
          <span>Next</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
