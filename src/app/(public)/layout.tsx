import type { ReactNode } from "react";
import PublicFooter from "@/components/layout/public/public-footer";
import PublicHeader from "@/components/layout/public/public-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
