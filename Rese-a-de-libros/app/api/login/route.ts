import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/userModel";
import bcrypt from "bcryptjs";
import { generarToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password requeridos" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
    }

    const token = generarToken({ email: user.email });

    return NextResponse.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
