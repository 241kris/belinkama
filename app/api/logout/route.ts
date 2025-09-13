// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // expire immédiatement
  });

  return NextResponse.json({ success: true });
}
