import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/userModel";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userData: any = verifyToken(token!);
    if (!userData) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await User.findById(userData.id);
    return NextResponse.json({ email: user!.email, reseñas: user!.reseñas, favoritos: user!.favoritos });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error obteniendo perfil" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userData: any = verifyToken(token!);
    if (!userData) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { libroId } = await req.json();
    const user = await User.findById(userData.id);
    if (!user!.favoritos.includes(libroId)) {
      user!.favoritos.push(libroId);
    } else {
      user!.favoritos = user!.favoritos.filter(id => id !== libroId);
    }
    await user!.save();

    return NextResponse.json({ favoritos: user!.favoritos });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error actualizando favoritos" }, { status: 500 });
  }
}
