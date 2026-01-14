import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/userModel";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ error: "Usuario ya registrado" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    return NextResponse.json({ message: "Usuario registrado correctamente", user: { email: user.email } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}
