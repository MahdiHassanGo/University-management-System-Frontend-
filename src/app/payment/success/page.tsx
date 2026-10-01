"use client";

import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const trxId =
    searchParams.get("trxID") || searchParams.get("tran_id") || "TRX-VERIFIED";
  const amount = searchParams.get("amount");

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if confetti fails in some environments
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-md w-full rounded-2xl border bg-card p-8 shadow-xl text-center space-y-5">
        <div className="flex justify-center">
          <Logo size="md" withLink={false} />
        </div>

        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="size-9" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Payment Successful
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your university fee transaction has been processed and
            authoritatively confirmed by the payment gateway.
          </p>
        </div>

        <div className="rounded-xl border bg-muted/40 p-4 text-xs font-mono text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-semibold text-foreground">{trxId}</span>
          </div>
          {amount && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold text-emerald-600">
                BDT {amount}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-semibold text-emerald-600">
              PAID / SETTLED
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/student/finance" className="block">
            <Button className="w-full gap-2 shadow-sm">
              <span>View Student Finance</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm">
          Loading payment confirmation...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
