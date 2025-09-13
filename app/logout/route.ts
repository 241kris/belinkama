import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).set("auth_token", "", { maxAge: -1, path: "/" });
  return NextResponse.json({ success: true });
}
