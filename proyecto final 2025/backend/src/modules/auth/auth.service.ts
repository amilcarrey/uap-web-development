/*
logica de negocio relacionada a la validacion de 
usuarios, autenticacion, etc

*/

import { User } from "../../types";
import { CreateUserRequest } from "./auth.dto";
import { AuthRepository } from "./auth.repository";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async createUser(data: CreateUserRequest): Promise<User> {
    const existing = await this.repo.getUserByEmail(data.email);
    if (existing) throw new Error("Ya existe un usuario con ese email");
    const hashedPassword = await hash(data.password);
    return this.repo.createUser({
      ...data,
      password: hashedPassword,
    });
    }

  async login(email: string, password: string): Promise<string> {
    const user = await this.repo.getUserByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    const isValid = await verify(user.password, password);
    if (!isValid) throw new Error("Contraseña inválida");    

    return jwt.sign({ id: user.id, email: user.email }, "secret" 
    , {
      expiresIn: "1h",
    });
  }
}