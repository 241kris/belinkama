// app/api/auth/register/route.ts
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().regex(/^\+241\d{9}$/, "Numéro de téléphone invalide (+241 + 9 chiffres)"),
  secondphone: z.string().regex(/^\+241\d{9}$/, "Numéro de téléphone invalide (+241 + 9 chiffres)"),
  password: z.string().min(6),
});



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existing) {
      return NextResponse.json({ error: "Numéro déjà utilisé" }, { status: 400 });
    }

    const hashed = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: { ...data, password: hashed },
    });

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err: unknown) { // ✅ au lieu de any
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }

    if (err instanceof Error) {
      console.error("❌ Register error:", err.message);
    } else {
      console.error("❌ Register error (inconnu):", err);
    }

    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
