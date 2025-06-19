import { createUser, getUserByEmail, getAllUsers, User } from "../models/userModel.js";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto-inseguro";

export class AuthService {
  async register(email: string, password: string, role: "user" | "admin" = "user"): Promise<User> {
    const existing = await getUserByEmail(email);
    if (existing) throw new Error("Usuario ya existe");

    const hashed = await hash(password);

    return await createUser(email, hashed, role);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await verify(user.password, password);
    if (!valid) throw new Error("Contraseña incorrecta");

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role } // aca definimos el payload del token JWT
    , JWT_SECRET, { // usamos la clave secreta para firmar el token
      expiresIn: "7d",
    });
    return token;
  }

  async getUsers(): Promise<User[]> {
    return await getAllUsers();
  }
}
