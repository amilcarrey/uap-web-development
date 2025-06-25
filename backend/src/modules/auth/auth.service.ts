import { AuthRepository } from "./auth.repository";
import { CreateUserRequest, LoginRequest } from "./auth.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(userData: CreateUserRequest) {
    try {
      const existing = await this.authRepository.getUserByEmail(userData.email);
      if (existing) throw new Error("El usuario ya existe");

      const hash = await bcrypt.hash(userData.password, 10);
      // guarda hash en la base de datos
      const user = await this.authRepository.createUser(userData, hash);
      return { id: user.id, nombre: user.nombre, email: user.email, role: user.role };
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginRequest) {
    try {
      const user = await this.authRepository.getUserByNombre(loginData.nombre); // <--- Cambia aquí
      if (!user) throw new Error("Usuario o contraseña incorrectos");

      const valid = await bcrypt.compare(loginData.password, user.password);
      if (!valid) throw new Error("Usuario o contraseña incorrectos");

      const token = jwt.sign(
        { id: user.id, nombre: user.nombre, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      return { token, nombre: user.nombre, role: user.role };
    } catch (error) {
      throw error;
    }
  }
}