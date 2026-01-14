export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validation";
import { signJWT } from "@/lib/jwt";
import { NextResponse } from "next/server";
import { setAuthCookieOn } from "@/lib/auth-cookie";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = LoginSchema.parse(await req.json());

    const emailNorm = email.trim().toLowerCase();        
    const user = await User.findOne({ email: emailNorm });
    if (!user) return new Response("Credenciales inválidas", { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return new Response("Credenciales inválidas", { status: 401 });

    const token = await signJWT({ sub: String(user._id), email: user.email });
    const res = NextResponse.json({ ok: true });
    setAuthCookieOn(res, token);
    return res;
  } catch {
    return new Response("Error interno", { status: 500 });
  }
}
