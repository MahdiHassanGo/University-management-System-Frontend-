import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendRequest, loginResponse, sameOrigin } from "@/lib/server-api";

const schema = z.object({
  role: z.enum(["SUPER_ADMIN", "INSTRUCTOR", "STUDENT"]),
});
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { message: "Invalid request origin" },
      { status: 403 },
    );
  try {
    const input = schema.safeParse(await request.json());
    if (!input.success)
      return NextResponse.json(
        { message: "Choose a valid demo role." },
        { status: 400 },
      );
    const accounts = {
      SUPER_ADMIN: {
        email: process.env.DEMO_ADMIN_EMAIL || "admin@university.edu",
        password: process.env.DEMO_ADMIN_PASSWORD || "Admin123!",
      },
      INSTRUCTOR: {
        email: process.env.DEMO_INSTRUCTOR_EMAIL || "instructor@university.edu",
        password: process.env.DEMO_INSTRUCTOR_PASSWORD || "Instructor123!",
      },
      STUDENT: {
        email: process.env.DEMO_STUDENT_EMAIL || "student@university.edu",
        password: process.env.DEMO_STUDENT_PASSWORD || "Student123!",
      },
    };
    const account = accounts[input.data.role];
    if (!account.password)
      return NextResponse.json(
        {
          message:
            "This demo account is unavailable. Please sign in with your account.",
        },
        { status: 503 },
      );
    return await loginResponse(
      await backendRequest("auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      }),
    );
  } catch {
    return NextResponse.json(
      { message: "Demo sign-in is temporarily unavailable." },
      { status: 502 },
    );
  }
}
