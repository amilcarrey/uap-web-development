import { createUser, getUserByEmail, getAllUsers, UserResponse} from "../models/userModel.js";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto-secretisimo123";

export class AuthService {
  async register(email: string, password: string, role: "user" | "admin" = "user"): Promise<UserResponse> {
    const existing = await getUserByEmail(email);
    if (existing) throw new Error("Usuario ya existe");

    const hashed = await hash(password);

    //crear el primer usuario y asignarle el rol de admin
    const isFirstUser = (await getAllUsers()).length === 0;
    // Si es el primer usuario del sistema lo hacemos admin automáticamente
    const finalRole = isFirstUser ? "admin" : (role || "user");
    
    const user = await createUser(email, hashed, finalRole);
    return { id: user.id, email: user.email, role: user.role };
}

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string }> {
    const user = await getUserByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await verify(user.password, password);
    if (!valid) throw new Error("Contraseña incorrecta");

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role } // aca definimos el payload del token JWT
    , JWT_SECRET, { // usamos la clave secreta para firmar el token
      expiresIn: "7d", // El token expira en 7 días
    });
    return { 
      user: { id: user.id, email: user.email, role: user.role }, 
      token 
    };
  }
  

  async getUsers(): Promise<UserResponse[]> {
    const users = await getAllUsers();
    //devolver sin passwords
    return users.map(user => ({ id: user.id, email: user.email, role: user.role }));
  }
}
