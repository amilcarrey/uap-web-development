export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, name } = RegisterSchema.parse(body);

    const emailNorm = email.trim().toLowerCase();                
    const exists = await User.findOne({ email: emailNorm });
    if (exists) return new Response("Email ya registrado", { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email: emailNorm, passwordHash, name });

    return NextResponse.json({ id: user._id, email: user.email }, { status: 201 });
  } catch {
    return new Response("Error interno", { status: 500 });
  }
}
