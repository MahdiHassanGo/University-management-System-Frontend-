import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

export async function GET(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const invoiceId = url.searchParams.get("invoiceId");
  const amount = url.searchParams.get("amount");
  const tran_id = url.searchParams.get("tran_id") || "TRX-VERIFIED";

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  if (status === "success") {
    return NextResponse.redirect(
      `${baseUrl}/payment/success?tran_id=${tran_id}&amount=${amount || ""}&invoiceId=${invoiceId || ""}`,
    );
  }

  return NextResponse.redirect(
    `${baseUrl}/payment/cancel?invoiceId=${invoiceId || ""}`,
  );
}
