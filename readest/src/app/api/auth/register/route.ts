import { NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@/app/models/User";
import { connectMongo } from "@/app/lib/mongo";
import bcrypt from "bcryptjs";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Register body:", body); // depuración

    const { name, email, password } = registerSchema.parse(body);

    await connectMongo();

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ id: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
