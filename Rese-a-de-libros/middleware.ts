import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const protectedApiRoutes = ["/api/reseñas", "/api/votar"];
const protectedPages = ["/perfil", "/mis-reseñas"];

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (protectedApiRoutes.some(path => pathname.startsWith(path))) {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  if (protectedPages.some(path => pathname.startsWith(path))) {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    "/api/reseñas/:path*",
    "/api/votar/:path*",
    "/perfil/:path*",
    "/mis-reseñas/:path*",
  ],
};
