"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export function useUrlState(key: string): [string, (value: string) => void] {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  return [
    params.get(key) || "",
    (value) => {
      // Read the current address so consecutive changes do not overwrite each other.
      const next = new URLSearchParams(window.location.search);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key === "sectionId") {
        next.delete("examId");
        next.delete("sessionId");
      }
      const url = `${pathname}?${next}`;
      window.history.replaceState(null, "", url);
      router.replace(url, { scroll: false });
    },
  ];
}
