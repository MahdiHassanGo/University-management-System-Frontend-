"use client";

import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-md w-full rounded-2xl border bg-card p-8 shadow-xl text-center space-y-5">
        <div className="flex justify-center">
          <Logo size="md" withLink={false} />
        </div>

        <div className="size-16 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 mx-auto flex items-center justify-center">
          <AlertCircle className="size-9" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Checkout not completed
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Checkout was cancelled, failed, or could not be verified. Please
            check your payment history before trying again.
          </p>
        </div>

        <div className="rounded-xl border bg-muted/40 p-4 text-xs text-left text-muted-foreground">
          If your account was charged, wait for confirmation or contact the
          finance office with your transaction reference.
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link href="/student/finance" className="block">
            <Button className="w-full gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Invoices</span>
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="ghost" className="w-full text-xs">
              Return to University Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
