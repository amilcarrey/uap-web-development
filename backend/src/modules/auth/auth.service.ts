import { AuthRepository } from "./auth.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(userData: { nombre: string; email: string; password: string }) {
    const existing = await this.authRepository.getUserByEmail(userData.email);
    if (existing) throw new Error("El usuario ya existe");
    const hash = await bcrypt.hash(userData.password, 10);
    const user = await this.authRepository.createUser(userData, hash);
    return { id: user.id, nombre: user.nombre, email: user.email, role: user.role };
  }

  async login({ nombre, email, password }: { nombre?: string; email?: string; password: string }) {
    const user = nombre
      ? await this.authRepository.getUserByNombre(nombre)
      : await this.authRepository.getUserByEmail(email!);
    if (!user) throw new Error("Usuario no encontrado.");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Contraseña incorrecta.");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return {
      token,
      nombre: user.nombre,
      role: user.role,
      cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    };
  }
}