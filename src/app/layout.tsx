import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "@/providers";

export const metadata: Metadata = {
  openGraph: {
    title: "UniCore University Management",
    description:
      "A connected workspace for students, faculty, and university administration.",
    type: "website",
  },
  title: "University Management System | Academic ERP Portal",
  description:
    "An enterprise academic management and student information portal supporting Super Admin, Faculty, and Student workflows.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-3"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
