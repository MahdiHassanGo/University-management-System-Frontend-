import { type NextRequest, NextResponse } from "next/server";
import { createBkashPayment } from "@/lib/bkash";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, amount, studentId, studentPhone } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { success: false, message: "invoiceId and amount are required" },
        { status: 400 },
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const merchantInvoiceNumber = `INV-${studentId || "ST"}-${Date.now().toString().slice(-6)}`;
    const callbackURL = `${baseUrl}/api/payment/bkash/callback?invoiceId=${invoiceId}&amount=${amount}`;

    const bkashData = await createBkashPayment({
      amount,
      merchantInvoiceNumber,
      payerReference: studentPhone || "01619777283",
      callbackURL,
    });

    return NextResponse.json({
      success: true,
      bkashURL: bkashData.bkashURL,
      paymentID: bkashData.paymentID,
      merchantInvoiceNumber,
      amount,
    });
  } catch (error: any) {
    console.error("[bKash Initiate Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to initialize bKash checkout",
      },
      { status: 500 },
    );
  }
}
