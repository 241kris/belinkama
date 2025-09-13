// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token")?.value;

  // On protège uniquement la page /register-home
  if (url.pathname === "/register-home") {
    if (!token) {
      // Redirection vers login avec message
      url.pathname = "/login";
      url.searchParams.set("message", "connectez-vous pour passer une annonce.");
      return NextResponse.redirect(url);
    }

    try {
      // Vérification du token
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next(); // Token valide, accès autorisé
    } catch {
      url.pathname = "/login";
      url.searchParams.set("message", "Session expirée. Veuillez vous reconnecter.");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next(); // Toutes les autres pages passent
}

// Définir les routes que ce middleware doit gérer
export const config = {
  matcher: ["/register-home"], 
};
