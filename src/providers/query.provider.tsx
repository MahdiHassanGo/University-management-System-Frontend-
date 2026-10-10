"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/errors";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) =>
            toast.add({
              title: "Couldn’t load information",
              description: getErrorMessage(error),
              type: "error",
            }),
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
              // Don't retry on 401 or 403 or 404
              if (
                ("status" in Object(error) &&
                  (error as { status: number }).status === 401) ||
                ("status" in Object(error) &&
                  (error as { status: number }).status === 403) ||
                ("status" in Object(error) &&
                  (error as { status: number }).status === 404)
              ) {
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
